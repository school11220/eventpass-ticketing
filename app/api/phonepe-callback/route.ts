import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateOrderPayment, createTicket } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const saltKey = process.env.PHONEPE_SALT_KEY!;
    const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
    
    // Get the response from PhonePe
    const { response } = body;
    
    // Decode the base64 response
    const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString('utf-8'));
    
    // Verify checksum
    const receivedChecksum = request.headers.get('X-VERIFY');
    const checksumString = response + saltKey;
    const calculatedChecksum = crypto.createHash('sha256').update(checksumString).digest('hex') + '###' + saltIndex;
    
    if (receivedChecksum !== calculatedChecksum) {
      return NextResponse.json(
        { error: 'Invalid checksum' },
        { status: 400 }
      );
    }

    // Check payment status
    if (decodedResponse.code === 'PAYMENT_SUCCESS') {
      const transactionId = decodedResponse.data.merchantTransactionId;
      const paymentId = decodedResponse.data.transactionId;
      
      // Update order in database
      await updateOrderPayment(transactionId, {
        paymentId: paymentId,
        signature: receivedChecksum || '',
        status: 'completed'
      });

      return NextResponse.json({
        success: true,
        message: 'Payment successful'
      });
    } else {
      return NextResponse.json(
        { error: 'Payment failed or pending' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error processing PhonePe callback:', error);
    return NextResponse.json(
      { error: 'Failed to process callback' },
      { status: 500 }
    );
  }
}

// Handle GET request for redirect
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const transactionId = searchParams.get('transactionId');
  
  if (transactionId) {
    // Redirect to success page
    return NextResponse.redirect(new URL(`/payment-success?transactionId=${transactionId}`, request.url));
  }
  
  return NextResponse.redirect(new URL('/payment-failed', request.url));
}
