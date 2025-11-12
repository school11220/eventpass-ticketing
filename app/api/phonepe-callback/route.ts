import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateOrderPayment, createTicket } from '@/lib/db';
import { sql } from '@vercel/postgres';

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

// Handle GET request for redirect (from mock payment or real PhonePe)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const merchantTransactionId = searchParams.get('merchantTransactionId') || searchParams.get('transactionId');
    const code = searchParams.get('code');
    const providerReferenceId = searchParams.get('providerReferenceId');
    
    console.log('=== PhonePe Callback GET ===');
    console.log('Transaction ID:', merchantTransactionId);
    console.log('Code:', code);
    console.log('Provider Reference:', providerReferenceId);
    
    if (!merchantTransactionId) {
      console.error('No transaction ID provided');
      return NextResponse.redirect(new URL('/payment-failed', request.url));
    }
    
    // Check if payment was successful
    if (code === 'PAYMENT_SUCCESS') {
      // Update order in database
      await updateOrderPayment(merchantTransactionId, {
        paymentId: providerReferenceId || merchantTransactionId,
        signature: code,
        status: 'completed'
      });

      // Get order details to create ticket
      const order = await sql`
        SELECT * FROM orders WHERE razorpay_order_id = ${merchantTransactionId}
      `;

      if (order.rows.length === 0) {
        console.error('Order not found:', merchantTransactionId);
        return NextResponse.redirect(new URL('/payment-failed', request.url));
      }

      const orderData = order.rows[0];
      
      // Generate QR token
      const qrToken = crypto.randomBytes(32).toString('hex');

      // Create ticket
      const ticket = await createTicket({
        orderId: orderData.id,
        eventId: orderData.event_id,
        qrToken: qrToken
      });
      
      console.log('Payment successful, ticket created:', ticket.id);
      
      // Redirect to ticket page
      return NextResponse.redirect(new URL(`/ticket/${ticket.id}`, request.url));
    } else {
      console.log('Payment failed or declined');
      await updateOrderPayment(merchantTransactionId, {
        paymentId: providerReferenceId || 'FAILED',
        signature: code || 'FAILED',
        status: 'failed'
      });
      
      return NextResponse.redirect(new URL('/payment-failed', request.url));
    }
  } catch (error) {
    console.error('Error processing callback:', error);
    return NextResponse.redirect(new URL('/payment-failed', request.url));
  }
}
