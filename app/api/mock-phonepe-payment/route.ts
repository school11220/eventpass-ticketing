import { NextRequest, NextResponse } from 'next/server';
import { updateOrderPayment } from '@/lib/db';

// Mock PhonePe payment page for local testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const transactionId = searchParams.get('transactionId');
  const amount = searchParams.get('amount');
  const orderId = searchParams.get('orderId');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Mock PhonePe Payment</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .payment-card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 {
      color: #5f3dc4;
      margin: 0 0 10px 0;
      font-size: 24px;
    }
    .amount {
      font-size: 36px;
      font-weight: bold;
      color: #333;
      margin: 20px 0;
    }
    .info {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 10px;
      margin: 20px 0;
      font-size: 14px;
      color: #666;
    }
    button {
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin: 10px 0;
      transition: all 0.3s;
    }
    .success-btn {
      background: #51cf66;
      color: white;
    }
    .success-btn:hover {
      background: #40c057;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(64, 192, 87, 0.4);
    }
    .fail-btn {
      background: #ff6b6b;
      color: white;
    }
    .fail-btn:hover {
      background: #fa5252;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(250, 82, 82, 0.4);
    }
    .demo-badge {
      background: #ffd43b;
      color: #333;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="payment-card">
    <div class="demo-badge">🧪 DEMO MODE</div>
    <h1>PhonePe Payment Gateway</h1>
    <p style="color: #666; margin: 5px 0 0 0;">Mock Payment for Testing</p>
    
    <div class="amount">₹${parseInt(amount || '0') / 100}</div>
    
    <div class="info">
      <strong>Transaction ID:</strong><br>
      <code style="font-size: 11px;">${transactionId}</code>
    </div>
    
    <p style="color: #666; font-size: 14px; margin: 20px 0;">
      This is a mock payment page for local testing. Click below to simulate payment success or failure.
    </p>
    
    <button class="success-btn" onclick="handlePayment('success')">
      ✓ Simulate Successful Payment
    </button>
    
    <button class="fail-btn" onclick="handlePayment('failed')">
      ✗ Simulate Failed Payment
    </button>
  </div>

  <script>
    function handlePayment(status) {
      const orderId = '${orderId}';
      const transactionId = '${transactionId}';
      
      // Redirect to callback URL with payment status
      const callbackUrl = '/api/phonepe-callback?merchantTransactionId=' + transactionId + 
                         '&transactionId=' + transactionId +
                         '&amount=${amount}' +
                         '&code=' + (status === 'success' ? 'PAYMENT_SUCCESS' : 'PAYMENT_DECLINED') +
                         '&providerReferenceId=MOCK_' + Date.now();
      
      window.location.href = callbackUrl;
    }
  </script>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
