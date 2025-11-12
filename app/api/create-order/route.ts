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

    const merchantId = process.env.PHONEPE_MERCHANT_ID || 'DEMO_MERCHANT';
    const saltKey = process.env.PHONEPE_SALT_KEY || 'demo_salt_key_12345';
    const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
    const apiUrl = process.env.PHONEPE_API_URL || 'https://api.phonepe.com/apis/hermes';

    // Generate unique transaction ID
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

    // Check if using real PhonePe credentials or demo mode
    const isDemoMode = merchantId === 'DEMO_MERCHANT' || merchantId === 'your_merchant_id';

    if (isDemoMode) {
      // Demo mode: Return mock payment page URL
      return NextResponse.json({
        orderId: transactionId,
        amount: amount * 100,
        currency: 'INR',
        dbOrderId: order.id,
        paymentUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mock-payment`,
        isDemoMode: true,
        base64Payload: Buffer.from(JSON.stringify({
          transactionId,
          dbOrderId: order.id,
          amount,
          email,
          name
        })).toString('base64'),
        checksum: 'DEMO_CHECKSUM',
        merchantId: merchantId
      });
    }

    // Real PhonePe mode
    const paymentPayload = {
      merchantId: merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: `USER_${Date.now()}`,
      amount: amount * 100,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe-callback`,
      redirectMode: 'POST',
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe-callback`,
      mobileNumber: phone || '',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
    const checksumString = base64Payload + '/pg/v1/pay' + saltKey;
    const checksum = crypto.createHash('sha256').update(checksumString).digest('hex') + '###' + saltIndex;

    return NextResponse.json({
      orderId: transactionId,
      amount: amount * 100,
      currency: 'INR',
      dbOrderId: order.id,
      paymentUrl: `${apiUrl}/pg/v1/pay`,
      isDemoMode: false,
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
