# 🚀 Razorpay Payment Integration Guide

## ✅ What We've Done

I've successfully switched your ROBOFIESTA app from PhonePe mock payments to **real Razorpay payment gateway**! Here's what changed:

### Changes Made:

1. **Installed Razorpay SDK** (`npm install razorpay`)
2. **Updated `/app/api/create-order/route.ts`** - Now uses Razorpay API to create orders
3. **Created `/app/api/razorpay-callback/route.ts`** - Handles payment verification
4. **Updated `/app/event/[id]/page.tsx`** - Uses Razorpay Checkout modal
5. **Updated `.env.example`** - Shows required Razorpay credentials

---

## 📝 How to Get Razorpay Credentials

### Step 1: Access Razorpay Dashboard
Go to: **https://dashboard.razorpay.com/**

### Step 2: Get API Keys
1. Click on **"Settings"** in the left sidebar
2. Click on **"API Keys"** under "Configuration"
3. You'll see two modes:
   - **Test Mode** (for development) - Use this first!
   - **Live Mode** (for production) - Use this when ready to go live

### Step 3: Generate Test Keys (Development)
1. Make sure you're in **Test Mode** (toggle at top)
2. Click **"Generate Test Key"** if you don't have one
3. You'll get two keys:
   ```
   Key ID: rzp_test_XXXXXXXXXXXX
   Key Secret: XXXXXXXXXXXXXXXXXXXXXXXX
   ```
4. **Important**: Copy the Key Secret immediately - it won't be shown again!

### Step 4: Add to Your `.env.local`

Open your `.env.local` file and add these lines:

```bash
# Razorpay Test Credentials (for development)
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
```

Replace the X's with your actual keys from the dashboard.

---

## 🧪 Testing the Integration

### Test Cards (Razorpay Test Mode)
When using test credentials, you can use these cards:

**✅ RECOMMENDED - Indian Test Card (Always Works):**
- Card Number: `4012 0010 3714 8905`
- CVV: `123`
- Expiry: `12/25`
- Card Type: Visa India
- ⭐ Use this first - works in all test modes!

**International Card (May need to enable in dashboard):**
- Card Number: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: `12/25`
- Card Type: International Visa
- ⚠️ If you get "international cards not allowed", use Indian card above

**Failed Payment Test:**
- Card Number: `4000 0000 0000 0002`
- CVV: `123`
- Expiry: `12/25`

### Testing Steps:
1. Restart your development server: `npm run dev`
2. Go to your event page: `http://localhost:3000/event/YOUR_EVENT_ID`
3. Fill in the booking form
4. Click "Buy Ticket"
5. Razorpay checkout modal will open
6. Use test card details above
7. Complete payment
8. You should be redirected to success page with ticket!

---

## 🎯 How It Works

### Payment Flow:

```
User clicks "Buy Ticket"
    ↓
Frontend calls /api/create-order
    ↓
Backend creates Razorpay order
    ↓
Razorpay Checkout modal opens
    ↓
User pays using Razorpay
    ↓
Razorpay sends payment details to frontend
    ↓
Frontend calls /api/razorpay-callback
    ↓
Backend verifies signature
    ↓
Creates ticket with QR code
    ↓
User redirected to success page
```

### Security Features:
- ✅ Signature verification (prevents tampering)
- ✅ Server-side order creation (prevents price manipulation)
- ✅ Secure webhook handling
- ✅ Test mode for safe development

---

## 🔄 Mock Payment vs Real Payment

### The app automatically detects:

**Mock Payment** (when credentials are missing):
- Shows fake payment page
- Instant approval/rejection
- For localhost testing without credentials

**Real Razorpay** (when credentials are present):
- Opens actual Razorpay checkout
- Real payment processing
- Secure signature verification

---

## 🚀 Going Live (Production)

### When you're ready for real payments:

1. **Complete KYC** on Razorpay Dashboard
2. **Enable Live Mode** in Settings
3. **Generate Live Keys**:
   - Go to Settings → API Keys
   - Switch to **Live Mode**
   - Generate live keys (starts with `rzp_live_`)
4. **Update `.env.local`**:
   ```bash
   RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
   ```
5. **Update BASE_URL** for production:
   ```bash
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   ```

---

## 🔍 Troubleshooting

### "Razorpay SDK not loaded"
**Solution**: Check your internet connection. The SDK loads from Razorpay's CDN.

### Mock payment page shows instead of Razorpay
**Solution**: Make sure your `.env.local` has valid Razorpay credentials and restart the server.

### Payment successful but verification failed
**Solution**: Check that your `RAZORPAY_KEY_SECRET` is correct in `.env.local`.

### Console logs to watch:
- ✅ `Razorpay SDK loaded` - SDK ready
- 💳 `Creating Razorpay order...` - Order being created
- ✅ `Razorpay order created: order_XXX` - Success
- ✅ `Payment successful:` - Payment completed
- 🎫 `Ticket created:` - Ticket generated

---

## 📊 Razorpay Dashboard Features

After payments, you can check:
- **Transactions** - All payments received
- **Orders** - All orders created
- **Settlements** - When money hits your bank
- **Analytics** - Payment success rates, trends

---

## 💡 Important Notes

1. **Test Mode is FREE** - No real money is charged
2. **Key Secret is sensitive** - Never commit to git or share publicly
3. **Signature verification** - Always happens server-side for security
4. **Webhook setup** - Not required for basic integration (we use callback)
5. **Settlement** - In live mode, money settles to your bank in 2-3 days

---

## 🎉 You're All Set!

Just add your Razorpay test credentials to `.env.local` and restart the server. Your payment integration will work instantly!

Questions? Check the Razorpay docs: https://razorpay.com/docs/
