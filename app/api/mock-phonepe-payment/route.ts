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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .payment-card {
      background: white;
      border-radius: 24px;
      padding: 48px 40px;
      max-width: 450px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideUp 0.4s ease-out;
    }
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .logo {
      text-align: center;
      margin-bottom: 24px;
    }
    .logo-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      margin-bottom: 12px;
    }
    h1 {
      color: #5f3dc4;
      margin: 0 0 8px 0;
      font-size: 26px;
      font-weight: 700;
      text-align: center;
    }
    .subtitle {
      color: #868e96;
      font-size: 14px;
      text-align: center;
      margin-bottom: 32px;
    }
    .amount {
      font-size: 48px;
      font-weight: 800;
      color: #212529;
      text-align: center;
      margin: 24px 0;
      letter-spacing: -1px;
    }
    .info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 12px;
      margin: 24px 0;
    }
    .info-label {
      font-size: 12px;
      color: #868e96;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .info-value {
      font-size: 13px;
      color: #495057;
      font-family: 'Courier New', monospace;
      word-break: break-all;
      line-height: 1.6;
    }
    .notice {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 16px;
      border-radius: 8px;
      margin: 24px 0;
      font-size: 14px;
      color: #856404;
      line-height: 1.5;
    }
    button {
      width: 100%;
      padding: 18px;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      margin: 12px 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    button::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }
    button:active::before {
      width: 300px;
      height: 300px;
    }
    .success-btn {
      background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(64, 192, 87, 0.3);
    }
    .success-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(64, 192, 87, 0.4);
    }
    .success-btn:active {
      transform: translateY(0);
    }
    .fail-btn {
      background: linear-gradient(135deg, #ff6b6b 0%, #fa5252 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(250, 82, 82, 0.3);
    }
    .fail-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(250, 82, 82, 0.4);
    }
    .fail-btn:active {
      transform: translateY(0);
    }
    .demo-badge {
      background: linear-gradient(135deg, #ffd43b 0%, #fab005 100%);
      color: #212529;
      padding: 8px 20px;
      border-radius: 24px;
      font-size: 13px;
      font-weight: 700;
      display: inline-block;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(255, 212, 59, 0.3);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .loading {
      display: none;
      text-align: center;
      color: #868e96;
      margin-top: 16px;
    }
    .spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      animation: spin 1s linear infinite;
      display: inline-block;
      margin-right: 8px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @media (max-width: 480px) {
      .payment-card {
        padding: 32px 24px;
      }
      .amount {
        font-size: 40px;
      }
    }
  </style>
</head>
<body>
  <div class="payment-card">
    <div class="logo">
      <div class="logo-icon">💳</div>
      <div class="demo-badge">🧪 DEMO MODE</div>
    </div>
    
    <h1>PhonePe Payment Gateway</h1>
    <p class="subtitle">Mock Payment for Testing</p>
    
    <div class="amount">₹${parseInt(amount || '0') / 100}</div>
    
    <div class="info">
      <div class="info-label">Transaction ID</div>
      <div class="info-value">${transactionId}</div>
    </div>
    
    <div class="notice">
      <strong>ℹ️ Testing Mode</strong><br>
      This is a mock payment page for local development. No real money will be charged. Choose an option below to simulate the payment outcome.
    </div>
    
    <button class="success-btn" onclick="handlePayment('success')" id="successBtn">
      ✓ Simulate Successful Payment
    </button>
    
    <button class="fail-btn" onclick="handlePayment('failed')" id="failBtn">
      ✗ Simulate Failed Payment
    </button>

    <div class="loading" id="loading">
      <div class="spinner"></div>
      Processing payment...
    </div>
  </div>

  <script>
    function handlePayment(status) {
      // Show loading
      document.getElementById('loading').style.display = 'block';
      document.getElementById('successBtn').disabled = true;
      document.getElementById('failBtn').disabled = true;
      
      const orderId = '${orderId}';
      const transactionId = '${transactionId}';
      
      // Simulate network delay
      setTimeout(() => {
        // Redirect to callback URL with payment status
        const callbackUrl = '/api/phonepe-callback?merchantTransactionId=' + transactionId + 
                           '&transactionId=' + transactionId +
                           '&amount=${amount}' +
                           '&code=' + (status === 'success' ? 'PAYMENT_SUCCESS' : 'PAYMENT_DECLINED') +
                           '&providerReferenceId=MOCK_' + Date.now();
        
        window.location.href = callbackUrl;
      }, 800);
    }
  </script>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
