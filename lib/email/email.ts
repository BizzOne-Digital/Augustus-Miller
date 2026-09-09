export interface EmailNotificationPayload {
  to?: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmailNotification(payload: EmailNotificationPayload): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'sgustus76@gmail.com';
  const recipient = payload.to || adminEmail;

  // Log in development/preview
  console.log(`[EMAIL NOTIFICATION] To: ${recipient} | Subject: ${payload.subject}`);
  console.log(`[EMAIL BODY]: ${payload.text}`);

  // In production with Resend or SMTP, perform delivery:
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'notifications@millergroup.com',
          to: recipient,
          subject: payload.subject,
          text: payload.text,
          html: payload.html || `<p>${payload.text.replace(/\n/g, '<br/>')}</p>`
        })
      });
      return true;
    } catch (err) {
      console.error('[EMAIL ERROR]', err);
      return false;
    }
  }

  return true;
}
