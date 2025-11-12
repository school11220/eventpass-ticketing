import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentUrl, base64Payload, checksum } = body;

    console.log('=== PhonePe Payment Initiation ===');
    console.log('Payment URL:', paymentUrl);
    console.log('Checksum:', checksum);
    console.log('Payload (first 100 chars):', base64Payload.substring(0, 100));

    // Make request to PhonePe API
    const response = await fetch(paymentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'accept': 'application/json',
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    });

    const result = await response.json();
    
    console.log('PhonePe Response Status:', response.status);
    console.log('PhonePe Response:', JSON.stringify(result, null, 2));

    if (!response.ok) {
      console.error('PhonePe API Error:', result);
      return NextResponse.json(
        { 
          success: false, 
          error: result.message || 'Payment initialization failed',
          details: result 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to initiate payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
