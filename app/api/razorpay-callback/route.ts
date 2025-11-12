import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateOrderPayment, createTicket } from '@/lib/db';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    console.log('💳 Razorpay callback received:', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature: razorpay_signature ? '✓' : '✗'
    });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('❌ Missing required fields in Razorpay callback');
      return NextResponse.json(
        { error: 'Missing required payment details' },
        { status: 400 }
      );
    }

    // Verify Razorpay signature
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeySecret) {
      console.error('❌ Razorpay key secret not configured');
      return NextResponse.json(
        { error: 'Payment verification failed - server configuration error' },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('❌ Invalid Razorpay signature');
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    console.log('✅ Razorpay signature verified');

    // Update order in database
    await updateOrderPayment(razorpay_order_id, {
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: 'completed'
    });

    console.log('✅ Order payment updated in database');

    // Get order details to create ticket
    const order = await sql`
      SELECT * FROM orders WHERE razorpay_order_id = ${razorpay_order_id}
    `;

    if (order.rows.length === 0) {
      console.error('❌ Order not found:', razorpay_order_id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const orderData = order.rows[0];

    // Generate unique QR token for check-in
    const qrToken = crypto.randomBytes(32).toString('hex');

    // Create ticket in database
    const ticket = await createTicket({
      orderId: orderData.id,
      eventId: orderData.event_id,
      qrToken: qrToken,
    });

    console.log('🎫 Ticket created:', ticket.id);

    return NextResponse.json({
      success: true,
      message: 'Payment successful',
      ticketId: ticket.id,
      orderId: orderData.id,
      qrToken: qrToken,
    });
  } catch (error) {
    console.error('❌ Error processing Razorpay callback:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}
