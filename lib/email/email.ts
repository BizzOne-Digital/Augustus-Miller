/**
 * Outbound notification email.
 *
 * Delivery is attempted over SMTP (nodemailer) first, then Resend if an API key
 * is configured, and otherwise the message is logged only. Everything in this
 * module is server-side: SMTP credentials are read from the environment inside
 * the request and are never returned to a caller, logged, or sent to the client.
 */

import nodemailer, { type Transporter } from 'nodemailer';

export interface EmailNotificationPayload {
  /** Recipient. Defaults to the configured business address; never user-supplied. */
  to?: string;
  subject: string;
  text: string;
  html?: string;
  /** Where a reply should go. Must already be validated by the caller. */
  replyTo?: string;
}

export interface EmailResult {
  sent: boolean;
  /**
   * Why nothing was delivered. Deliberately coarse - it is safe to surface and
   * never carries credentials or transport detail.
   */
  reason?: 'not-configured' | 'send-failed';
}

/** Basic RFC-shaped check. Also rejects the CR/LF used for header injection. */
export function isValidEmailAddress(value: string | undefined | null): boolean {
  const email = value?.trim();
  if (!email || email.length > 254) return false;
  if (/[\r\n]/.test(email)) return false;
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email);
}

/** Strip CR/LF so an interpolated value cannot forge extra mail headers. */
function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

/**
 * The business address notifications go to. This is the same server-side
 * configuration the admin dashboard already uses - the website visitor can
 * never influence it.
 */
export function getNotificationRecipient(): string {
  return process.env.ADMIN_EMAIL || 'sgustus76@gmail.com';
}

interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  auth: { user: string; pass: string };
}

/**
 * Reads SMTP settings from the environment. Returns null when the transport is
 * not fully configured, so a missing password degrades to "not sent" rather
 * than throwing.
 */
function readSmtpSettings(): SmtpSettings | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT) || 587;

  return {
    host,
    port,
    // 465 is implicit TLS; 587 and 25 upgrade with STARTTLS.
    secure: port === 465,
    auth: { user, pass }
  };
}

// Cached on globalThis so a warm serverless invocation (and dev HMR) reuses one
// transporter instead of opening a connection per module reload.
declare global {
  var __miller_mailer: Transporter | undefined;
}

function getTransporter(settings: SmtpSettings): Transporter {
  if (!global.__miller_mailer) {
    global.__miller_mailer = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.secure,
      auth: settings.auth,
      // Short timeouts: a hung SMTP dial must not hold a serverless request open.
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });
  }
  return global.__miller_mailer;
}

/** The From header. Falls back to the authenticated mailbox. */
function resolveFrom(settings: SmtpSettings): string {
  return (
    process.env.SMTP_FROM?.trim() ||
    process.env.EMAIL_FROM?.trim() ||
    settings.auth.user
  );
}

/**
 * Send a notification. Never throws: a transport failure is reported through
 * the result so a caller can keep an already-saved record instead of rolling
 * it back or retrying.
 */
export async function sendEmailNotification(
  payload: EmailNotificationPayload
): Promise<EmailResult> {
  const recipient = payload.to || getNotificationRecipient();
  const subject = singleLine(payload.subject);
  const replyTo = isValidEmailAddress(payload.replyTo) ? payload.replyTo!.trim() : undefined;
  const html = payload.html || `<p>${payload.text.replace(/\n/g, '<br/>')}</p>`;

  // Subject and recipient only - the body can contain personal details.
  console.log(`[EMAIL] To: ${recipient} | Subject: ${subject}`);

  const smtp = readSmtpSettings();
  if (smtp) {
    try {
      await getTransporter(smtp).sendMail({
        from: resolveFrom(smtp),
        to: recipient,
        replyTo,
        subject,
        text: payload.text,
        html
      });
      return { sent: true };
    } catch (error) {
      // A failed transporter can hold a dead socket; drop it so the next
      // request builds a fresh one.
      global.__miller_mailer = undefined;
      // `error` is a nodemailer/SMTP error. It carries the response and code
      // but not the password, which nodemailer never echoes back.
      console.error('[EMAIL] SMTP delivery failed:', error instanceof Error ? error.message : error);
      return { sent: false, reason: 'send-failed' };
    }
  }

  // Resend fallback, kept from the previous implementation.
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'notifications@millergroup.com',
          to: recipient,
          reply_to: replyTo,
          subject,
          text: payload.text,
          html
        })
      });
      if (!res.ok) {
        console.error(`[EMAIL] Resend rejected the message (HTTP ${res.status}).`);
        return { sent: false, reason: 'send-failed' };
      }
      return { sent: true };
    } catch (error) {
      console.error('[EMAIL] Resend delivery failed:', error instanceof Error ? error.message : error);
      return { sent: false, reason: 'send-failed' };
    }
  }

  console.warn('[EMAIL] No SMTP or Resend configuration found - nothing was delivered.');
  return { sent: false, reason: 'not-configured' };
}
