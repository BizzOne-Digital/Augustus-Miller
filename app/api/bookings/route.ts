import { NextRequest, NextResponse } from 'next/server';
import { getBookings, createBooking } from '@/lib/db/db';
import { checkAdminAuthRequest } from '@/lib/auth/auth';
import { sendEmailNotification } from '@/lib/email/email';

export async function GET(req: NextRequest) {
  const session = checkAdminAuthRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bookings = await getBookings();
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      email,
      phone,
      serviceId,
      serviceName,
      preferredDate,
      preferredTime,
      address,
      message,
      attachmentUrls
    } = body;

    if (!customerName || !email || !phone || !serviceName || !preferredDate || !address) {
      return NextResponse.json(
        { error: 'Please provide all required booking fields' },
        { status: 400 }
      );
    }

    const newBooking = await createBooking({
      customerName,
      email,
      phone,
      serviceId: serviceId || 'srv-general',
      serviceName,
      preferredDate,
      preferredTime: preferredTime || 'Flexible',
      address,
      message: message || '',
      attachmentUrls: attachmentUrls || []
    });

    // Fire non-blocking email notification
    sendEmailNotification({
      subject: `New Service Request from ${customerName}: ${serviceName}`,
      text: `A new service booking request has been submitted to Miller Group of Company LLC:\n\nCustomer: ${customerName}\nPhone: ${phone}\nEmail: ${email}\nService: ${serviceName}\nPreferred Date: ${preferredDate} (${preferredTime || 'Flexible'})\nAddress: ${address}\nMessage: ${message || 'None'}\n\nPlease review and confirm in the admin dashboard.`
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Your service request has been received. A representative will review your request and contact you to confirm the appointment.',
      booking: newBooking
    });
  } catch (error) {
    console.error('Booking submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking request' },
      { status: 500 }
    );
  }
}
