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
    const isLocalhost = process.env.NEXT_PUBLIC_BASE_URL?.includes('localhost');

    // Use mock payment for localhost (PhonePe sandbox doesn't accept localhost URLs)
    if (isDemoMode || isLocalhost) {
      console.log('Using MOCK payment mode (localhost or demo credentials)');
      return NextResponse.json({
        orderId: transactionId,
        amount: amount * 100,
        currency: 'INR',
        dbOrderId: order.id,
        paymentUrl: `/api/mock-phonepe-payment?transactionId=${transactionId}&amount=${amount * 100}&orderId=${order.id}`,
        isDemoMode: true,
        useMock: true,
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
    // Clean phone number - remove country code if present and ensure 10 digits
    let cleanPhone = phone?.replace(/\D/g, '') || '';
    if (cleanPhone.startsWith('91')) {
      cleanPhone = cleanPhone.substring(2);
    }
    cleanPhone = cleanPhone.substring(0, 10) || '9999999999';

    const paymentPayload = {
      merchantId: merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: `USER_${Date.now()}`,
      amount: amount * 100,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe-callback?orderId=${transactionId}`,
      redirectMode: 'REDIRECT',
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe-callback`,
      mobileNumber: cleanPhone,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    console.log('=== Creating PhonePe Order ===');
    console.log('Transaction ID:', transactionId);
    console.log('Amount:', amount * 100);
    console.log('Merchant ID:', merchantId);
    console.log('Mobile (cleaned):', cleanPhone);
    console.log('Redirect URL:', paymentPayload.redirectUrl);
    console.log('Payment Payload:', JSON.stringify(paymentPayload, null, 2));

    const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
    
    // Correct PhonePe checksum format: SHA256(base64Payload + endpoint + saltKey) + ### + saltIndex
    const endpoint = '/pg/v1/pay';
    const checksumString = base64Payload + endpoint + saltKey;
    const sha256Hash = crypto.createHash('sha256').update(checksumString).digest('hex');
    const checksum = sha256Hash + '###' + saltIndex;

    console.log('Base64 Payload:', base64Payload);
    console.log('Checksum Calculation:');
    console.log('  - Endpoint:', endpoint);
    console.log('  - Salt Key:', saltKey);
    console.log('  - SHA256 Hash:', sha256Hash);
    console.log('  - Final Checksum:', checksum);

    return NextResponse.json({
      orderId: transactionId,
      amount: amount * 100,
      currency: 'INR',
      dbOrderId: order.id,
      paymentUrl: `${apiUrl}${endpoint}`,
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
