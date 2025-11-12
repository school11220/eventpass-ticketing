# 🚨 Fix: International Cards Not Allowed

## The Problem
You're seeing: **"International cards are not allowed"**

This is a Razorpay account setting that needs to be enabled.

---

## ✅ Solution 1: Enable International Cards (Recommended)

### Step 1: Go to Payment Methods Settings
**URL**: https://dashboard.razorpay.com/app/payment-methods

### Step 2: Find International Cards Section
1. Look for **"International Cards"** section
2. Or search for "International" on the page

### Step 3: Enable International Cards
1. Toggle **ON** the International Cards option
2. You might see options for:
   - American Express
   - Visa
   - Mastercard
   - Other international cards

### Step 4: Save Changes
1. Click **"Save"** or **"Update"**
2. Changes take effect immediately

---

## ✅ Solution 2: Use Indian Test Cards (Quick Workaround)

If you can't enable international cards in test mode, use these **Indian test cards**:

### Successful Payment - Indian Debit Card:
```
Card Number: 4012 0010 3714 8905
CVV: 123
Expiry: 12/25
Card Type: Visa (India)
```

### Successful Payment - RuPay Card:
```
Card Number: 6521 5900 3131 3131
CVV: 123
Expiry: 12/25
Card Type: RuPay (India)
```

### Failed Payment Test:
```
Card Number: 4000 0000 0000 0002
CVV: 123
Expiry: 12/25
```

---

## ✅ Solution 3: Check Razorpay Dashboard Settings

### Navigate to Settings:
1. **Dashboard** → **Settings** (⚙️ icon)
2. **Payment Methods** → **Cards**
3. Look for these toggles:

```
☑️ Domestic Cards
☑️ International Cards    ← Make sure this is checked
☑️ Credit Cards
☑️ Debit Cards
```

---

## 🎯 Quick Navigation Path

### Option A - Direct URL:
```
https://dashboard.razorpay.com/app/payment-methods
```

### Option B - Dashboard Navigation:
```
Dashboard → Settings → Payment Methods → Cards
```

### Option C - Search:
1. Use search bar at top
2. Type: "payment methods"
3. Click on "Payment Methods" result

---

## 📱 What You'll See

### Current State (International Disabled):
```
┌─────────────────────────────────────┐
│  Payment Methods                     │
├─────────────────────────────────────┤
│  💳 Cards                            │
│     ☑️ Domestic Cards      Enabled  │
│     ☐ International Cards  Disabled │ ← This is OFF
│     ☑️ Credit Cards        Enabled  │
│     ☑️ Debit Cards         Enabled  │
└─────────────────────────────────────┘
```

### After Enabling:
```
┌─────────────────────────────────────┐
│  Payment Methods                     │
├─────────────────────────────────────┤
│  💳 Cards                            │
│     ☑️ Domestic Cards      Enabled  │
│     ☑️ International Cards Enabled  │ ← Now ON
│     ☑️ Credit Cards        Enabled  │
│     ☑️ Debit Cards         Enabled  │
└─────────────────────────────────────┘
```

---

## 🔍 Common Issues

### Issue: "Can't find International Cards option"
**Reason**: Test mode might have restrictions
**Solution**: Use Indian test cards from Solution 2 above

### Issue: "Toggle is grayed out"
**Reason**: Account verification needed
**Solution**: 
- Complete basic KYC (even for test mode)
- Or use Indian test cards

### Issue: "Changes not taking effect"
**Solution**: 
1. Clear browser cache
2. Wait 1-2 minutes
3. Try payment again

---

## 🧪 Testing After Enabling

### Test with International Card:
```
Card: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
```

### Should work now! ✅

If still not working, use Indian test cards.

---

## 💡 Important Notes

1. **Test Mode Limitations**: Some payment methods may be restricted in test mode
2. **Live Mode**: All payment methods work after KYC completion
3. **Indian Test Cards**: Always work in test mode
4. **No Real Money**: Test mode never charges real money

---

## 🚀 Recommended Testing Flow

### For Development (Right Now):
1. Use **Indian test cards** (always work)
2. Card: `4012 0010 3714 8905`
3. Test all flows
4. No settings changes needed

### For Production (Later):
1. Complete full KYC on Razorpay
2. Get live credentials
3. All card types will work automatically
4. International cards enabled by default in live mode

---

## ✅ Quick Fix Summary

**Fastest Solution**: Use this Indian test card right now:

```bash
Card Number: 4012 0010 3714 8905
CVV: 123
Expiry: 12/25
Name: Any name
```

**No settings change needed!** This will work immediately. 🎉

---

## 📞 Still Not Working?

Try these in order:

1. ✅ Use Indian test card: `4012 0010 3714 8905`
2. ✅ Clear browser cache and cookies
3. ✅ Try in incognito/private mode
4. ✅ Check Razorpay dashboard for any error messages
5. ✅ Verify your credentials are correct in `.env.local`
6. ✅ Restart your dev server: `npm run dev`

---

**TL;DR**: Use card `4012 0010 3714 8905` - it works in all Razorpay test modes! 🚀
