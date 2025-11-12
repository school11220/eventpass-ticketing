import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
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

    const merchantId = process.env.PHONEPE_MERCHANT_ID!;
    const saltKey = process.env.PHONEPE_SALT_KEY!;
    const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';

    // Generate unique transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Create PhonePe payment request
    const paymentPayload = {
      merchantId: merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: `USER_${Date.now()}`,
      amount: amount * 100, // Amount in paise
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe-callback`,
      redirectMode: 'POST',
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe-callback`,
      mobileNumber: phone || '',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    // Encode payload to base64
    const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
    
    // Generate checksum: base64(payload) + '/pg/v1/pay' + saltKey
    const checksumString = base64Payload + '/pg/v1/pay' + saltKey;
    const checksum = crypto.createHash('sha256').update(checksumString).digest('hex') + '###' + saltIndex;

    // Save order to database
    const order = await createOrder({
      eventId,
      email,
      name,
      phone: phone || '',
      amount,
      razorpayOrderId: transactionId, // Using same field for PhonePe transaction ID
    });

    return NextResponse.json({
      orderId: transactionId,
      amount: amount * 100,
      currency: 'INR',
      dbOrderId: order.id,
      paymentUrl: 'https://api.phonepe.com/apis/hermes/pg/v1/pay',
      base64Payload: base64Payload,
      checksum: checksum,
      merchantId: merchantId
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
