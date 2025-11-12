import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createOrder } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, email, name, phone, amount } = body;

    // Validate input
    if (!eventId || !email || !name || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if Razorpay credentials are configured
    if (!razorpayKeyId || !razorpayKeySecret || razorpayKeyId === 'your_razorpay_key_id') {
      console.log('⚠️ Using MOCK payment mode (Razorpay credentials not configured)');
      
      // Generate unique transaction ID for mock
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      // Save order to database
      const order = await createOrder({
        eventId,
        email,
        name,
        phone: phone || '',
        amount,
        razorpayOrderId: transactionId,
      });

      return NextResponse.json({
        orderId: transactionId,
        amount: amount * 100,
        currency: 'INR',
        dbOrderId: order.id,
        paymentUrl: `/api/mock-phonepe-payment?transactionId=${transactionId}&amount=${amount * 100}&orderId=${order.id}`,
        isDemoMode: true,
        useMock: true,
      });
    }

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    console.log('💳 Creating Razorpay order...');

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        eventId,
        email,
        name,
        phone: phone || '',
      },
    });

    console.log('✅ Razorpay order created:', razorpayOrder.id);

    // Save order to database with Razorpay order ID
    const order = await createOrder({
      eventId,
      email,
      name,
      phone: phone || '',
      amount,
      razorpayOrderId: razorpayOrder.id,
    });

    // Return order details for frontend
    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: order.id,
      keyId: razorpayKeyId, // Frontend needs this for Razorpay checkout
      isDemoMode: false,
      useMock: false,
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
