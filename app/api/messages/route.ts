import { NextRequest, NextResponse } from 'next/server';
import { getContactMessages, createContactMessage } from '@/lib/db/db';
import { checkAdminAuthRequest } from '@/lib/auth/auth';
import { sendEmailNotification, isValidEmailAddress } from '@/lib/email/email';
import {
  buildInquirySubject,
  buildInquiryText,
  buildInquiryHtml,
  type InquiryEmailFields
} from '@/lib/email/templates';

// SMTP delivery uses a Node socket, so this route must not run on the edge.
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const session = checkAdminAuthRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const messages = await getContactMessages();
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, service, preferredDate, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Name, email, phone, and message are required' },
        { status: 400 }
      );
    }

    // The submitted address becomes the Reply-To header, so it has to be a
    // valid single-line address before anything is stored or sent.
    if (!isValidEmailAddress(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const resolvedService = service || 'General Inquiry';

    // Save first. If this throws, the catch below returns 500 and no email is
    // sent - there is no partial submission.
    const newMessage = await createContactMessage({
      name,
      email,
      phone,
      service: resolvedService,
      preferredDate,
      message
    });

    // The record is saved from here on. A delivery failure must never roll it
    // back or cause a second insert.
    const fields: InquiryEmailFields = {
      name,
      email,
      phone,
      service: resolvedService,
      preferredDate,
      message,
      submittedAt: new Date(newMessage.createdAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'America/New_York'
      })
    };

    // Awaited, not fire-and-forget: a serverless function is frozen once the
    // response is returned, which would cut a pending send short.
    const delivery = await sendEmailNotification({
      subject: buildInquirySubject(fields),
      text: buildInquiryText(fields),
      html: buildInquiryHtml(fields),
      // Recipient always comes from server configuration; only Reply-To is
      // taken from the visitor, and only after validation.
      replyTo: email
    });

    if (!delivery.sent) {
      console.error(
        `[CONTACT] Inquiry ${newMessage.id} saved, but the notification email was not delivered (${delivery.reason}).`
      );
    }

    return NextResponse.json({
      success: true,
      emailSent: delivery.sent,
      message: delivery.sent
        ? 'Thank you for reaching out to Miller Group. We have received your message and will respond promptly.'
        : 'Thank you for reaching out to Miller Group. Your inquiry has been received and saved. Our notification email could not be delivered, so please call us if your request is urgent.',
      data: newMessage
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
