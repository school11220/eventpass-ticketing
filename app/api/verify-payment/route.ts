import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateOrderPayment, createTicket } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      email,
    } = body;

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Update order status
    const order = await updateOrderPayment(razorpay_order_id, {
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: 'success',
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Generate JWT token for QR code (7-day expiry)
    const qrToken = jwt.sign(
      {
        orderId: order.id,
        eventId: order.event_id,
        email: order.email,
        paymentId: razorpay_payment_id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Create ticket
    const ticket = await createTicket({
      orderId: order.id,
      eventId: order.event_id,
      qrToken,
    });

    // Send confirmation email (call send-email API)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: order.email,
          name: order.name,
          eventId: order.event_id,
          ticketId: ticket.id,
          qrToken,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the entire transaction if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      ticketId: ticket.id,
      qrToken,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
