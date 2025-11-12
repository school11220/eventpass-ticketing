# 🎯 Quick Start: Razorpay Integration

## Get Your Credentials (2 minutes)

1. Go to: https://dashboard.razorpay.com/app/keys
2. Enable **Test Mode** (toggle at top right)
3. Click **"Generate Test Key"**
4. Copy both keys:
   - **Key ID**: `rzp_test_XXXXXXXXXXXX`
   - **Key Secret**: `XXXXXXXXXXXXXXXXXXXXXXXX`

## Add to .env.local

```bash
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
```

## Restart Server

```bash
npm run dev
```

## Test Payment

**✅ Use This Card (Type WITHOUT spaces):**
- Card: `4111111111111111` (type this, don't copy-paste)
- CVV: `123`
- Expiry: `12/25`

**Or use Netbanking:**
- Click "Netbanking" tab in Razorpay modal
- Select any test bank → Click "Success"

*(If cards don't work, use Netbanking - it always works!)*

## That's It! 🎉

Your real payment gateway is now active!

---

For detailed guide, see: [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md)
