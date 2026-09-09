import { NextRequest, NextResponse } from 'next/server';
import { getContactMessages, createContactMessage } from '@/lib/db/db';
import { checkAdminAuthRequest } from '@/lib/auth/auth';
import { sendEmailNotification } from '@/lib/email/email';

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

    const newMessage = await createContactMessage({
      name,
      email,
      phone,
      service: service || 'General Inquiry',
      preferredDate,
      message
    });

    sendEmailNotification({
      subject: `New Inquiry from ${name} [${service || 'General'}]`,
      text: `A new contact message was received:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service || 'General'}\nPreferred Date: ${preferredDate || 'N/A'}\nMessage:\n${message}`
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out to Miller Group. We have received your message and will respond promptly.',
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
