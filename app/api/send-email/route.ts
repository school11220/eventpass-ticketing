import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { getEventById } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, eventId, ticketId, qrToken } = body;

    if (!email || !qrToken || !eventId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get event details
    const event = await getEventById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Generate QR code image
    const qrCodeBuffer = await QRCode.toBuffer(qrToken, {
      width: 400,
      margin: 2,
    });

    // Create email transporter
    // Using Gmail as fallback (you can configure Resend if you have API key)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
      },
    });

    // Format event date
    const eventDate = new Date(event.date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Email HTML template
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .ticket-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #0ea5e9; }
    .qr-code { text-align: center; margin: 20px 0; }
    .qr-code img { max-width: 300px; border: 2px solid #e5e7eb; border-radius: 8px; }
    .event-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-label { font-weight: bold; color: #6b7280; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
    .button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Your Ticket is Confirmed!</h1>
      <p>EventPass - Your Gateway to Amazing Events</p>
    </div>
    
    <div class="content">
      <h2>Hello ${name || 'Guest'}!</h2>
      <p>Thank you for your purchase. Your ticket for <strong>${event.name}</strong> is ready!</p>
      
      <div class="ticket-box">
        <h3 style="color: #0ea5e9; margin-top: 0;">📋 Event Details</h3>
        <div class="event-details">
          <div class="detail-row">
            <span class="detail-label">Event:</span>
            <span>${event.name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date & Time:</span>
            <span>${eventDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Venue:</span>
            <span>${event.venue}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Ticket ID:</span>
            <span>${ticketId}</span>
          </div>
        </div>
        
        <div class="qr-code">
          <h3 style="color: #0ea5e9;">Your Entry QR Code</h3>
          <p style="color: #6b7280; font-size: 14px;">Show this QR code at the venue entrance</p>
          <img src="cid:qrcode" alt="QR Code" />
        </div>
        
        <p style="text-align: center; margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/ticket/${ticketId}" class="button">View Ticket Online</a>
        </p>
      </div>
      
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
        <strong>⚠️ Important:</strong>
        <ul style="margin: 10px 0;">
          <li>Save this email and present the QR code at the venue</li>
          <li>QR code is valid for 7 days from purchase</li>
          <li>Each ticket can only be used once</li>
          <li>Arrive 15 minutes early for smooth check-in</li>
        </ul>
      </div>
      
      <p>If you have any questions, please contact us at support@eventpass.com</p>
      <p>See you at the event! 🎊</p>
    </div>
    
    <div class="footer">
      <p>Powered by EventPass | Built with ❤️ using Next.js & Razorpay</p>
      <p>&copy; 2025 EventPass. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@eventpass.com',
      to: email,
      subject: `Your Ticket for ${event.name} - EventPass`,
      html: emailHtml,
      attachments: [
        {
          filename: 'ticket-qr.png',
          content: qrCodeBuffer,
          cid: 'qrcode',
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Don't fail completely - log error but return success
    // This allows the payment to complete even if email fails
    return NextResponse.json({
      success: false,
      warning: 'Email delivery failed, but ticket is valid',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
