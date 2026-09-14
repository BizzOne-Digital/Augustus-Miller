/**
 * Notification email bodies.
 *
 * Every value here originates from a public form, so each one is escaped before
 * it reaches the HTML body.
 */

/** Fields as submitted through the contact / quote request form. */
export interface InquiryEmailFields {
  name: string;
  email: string;
  phone: string;
  service: string;
  preferredDate?: string;
  message: string;
  submittedAt: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const NAVY = '#0A2540';
const GOLD = '#C8973E';

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #E2E8F0;color:#64748B;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #E2E8F0;color:${NAVY};font-size:14px;">${escapeHtml(value)}</td>
    </tr>`;
}

/**
 * Subject line. Names the division when one was chosen so the recipient can
 * triage straight from the inbox list.
 */
export function buildInquirySubject(fields: InquiryEmailFields): string {
  const service = fields.service?.trim();
  const base =
    service && service !== 'General Inquiry'
      ? `New Quote Request - ${service}`
      : 'New Inquiry / Request for Quote';
  return `${base} (${fields.name})`;
}

/** Plain-text alternative, for clients that do not render HTML. */
export function buildInquiryText(fields: InquiryEmailFields): string {
  const lines = [
    'A new inquiry was submitted on millergroupofcompany.com.',
    '',
    `Name:           ${fields.name}`,
    `Email:          ${fields.email}`,
    `Phone:          ${fields.phone}`,
    `Service:        ${fields.service}`
  ];

  if (fields.preferredDate) {
    lines.push(`Preferred Date: ${fields.preferredDate}`);
  }

  lines.push(
    `Submitted:      ${fields.submittedAt}`,
    '',
    'Message',
    '-------',
    fields.message,
    '',
    'Reply to this email to respond directly to the sender.',
    'This inquiry has also been saved to the admin dashboard.'
  );

  return lines.join('\n');
}

export function buildInquiryHtml(fields: InquiryEmailFields): string {
  const detailRows = [
    row('Name', fields.name),
    row('Email', fields.email),
    row('Phone', fields.phone),
    row('Service', fields.service),
    fields.preferredDate ? row('Preferred Date', fields.preferredDate) : '',
    row('Submitted', fields.submittedAt)
  ].join('');

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#FFFFFF;border-radius:14px;overflow:hidden;border:1px solid #E2E8F0;">
      <tr>
        <td style="background:${NAVY};padding:24px 28px;">
          <div style="color:${GOLD};font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;">Miller Group of Company LLC</div>
          <div style="color:#FFFFFF;font-size:20px;font-weight:700;margin-top:6px;">New Inquiry / Quote Request</div>
        </td>
      </tr>

      <tr>
        <td style="padding:24px 28px 8px;">
          <p style="margin:0 0 18px;color:#475569;font-size:14px;line-height:1.6;">
            A new inquiry was submitted through the website contact form. Replying to this
            email will reach the sender directly.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8F0;border-radius:10px;border-collapse:separate;overflow:hidden;">
            ${detailRows}
          </table>
        </td>
      </tr>

      <tr>
        <td style="padding:8px 28px 24px;">
          <div style="color:#64748B;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Message</div>
          <div style="padding:16px;background:#F8FAFC;border-left:4px solid ${GOLD};border-radius:8px;color:${NAVY};font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(fields.message)}</div>
        </td>
      </tr>

      <tr>
        <td style="padding:16px 28px;background:#F8FAFC;border-top:1px solid #E2E8F0;color:#64748B;font-size:12px;line-height:1.6;">
          This inquiry has also been saved to the admin dashboard under Messages.
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
