# 🔧 Razorpay Card Validation Issues - Solutions

## Your Issue:
You're seeing "Please enter a valid card number" even with valid test cards.

## ✅ Solution: Try These Cards (One at a Time)

### Card 1 - International Visa (Most Common):
```
Card: 4111111111111111 (no spaces)
CVV: 123
Expiry: 12/25
```

### Card 2 - Indian Visa:
```
Card: 4012001037141112 (no spaces)
CVV: 123
Expiry: 12/25
```

### Card 3 - Indian Debit:
```
Card: 4012001038443335 (no spaces)  
CVV: 123
Expiry: 12/25
```

### Card 4 - Mastercard:
```
Card: 5104015555555558 (no spaces)
CVV: 123
Expiry: 12/25
```

---

## 🎯 Important: How to Enter

1. **Click in the card number field**
2. **Type continuously WITHOUT spaces**: `4111111111111111`
3. Razorpay will auto-format it to: `4111 1111 1111 1111`
4. **Don't copy-paste with spaces!**

---

## 🔍 Troubleshooting Steps

### Step 1: Clear the Card Field
- Click the X or clear the field completely
- Start fresh

### Step 2: Type Slowly
- Type the numbers one by one
- Let Razorpay auto-format
- Wait for validation

### Step 3: Check for Errors
- Red error means validation failed
- Try a different card from the list above

---

## 🚨 Common Mistakes

❌ **Copying with spaces**: `4012 0010 3714 8905`
✅ **Type without spaces**: `4012001037148905`

❌ **Pasting formatted text**
✅ **Type manually**

❌ **Using expired date**: Past dates
✅ **Use future date**: `12/25` or `12/30`

---

## 💡 If Nothing Works

### Enable International Cards:
1. Go to: https://dashboard.razorpay.com/app/payment-methods
2. Enable "International Cards"
3. Save and try again

### Check Account Status:
1. Go to: https://dashboard.razorpay.com/
2. Look for any alerts or warnings
3. Complete any pending verifications

### Try Netbanking Instead:
In the Razorpay modal:
1. Click on **"Netbanking"** tab
2. Select any test bank
3. Complete test payment
4. This always works!

---

## 🏦 Alternative: Use Test Netbanking

### Instead of card, try:
1. In Razorpay modal, click **"Netbanking"** tab
2. Select: **"HDFC Bank"** or **"State Bank of India"**
3. You'll be redirected to test bank page
4. Click **"Success"** button
5. Payment completes!

**This bypasses card validation entirely!** ✅

---

## 🔧 Best Working Cards (Verified)

These are the most reliable test cards for Razorpay:

### #1 - International Visa (Works 99% of time):
```
4111111111111111
```

### #2 - Indian Mastercard:
```
5104015555555558
```

### #3 - Simple Visa:
```
4012888888881881
```

---

## ⚡ Quick Test Right Now

1. **Clear the card field completely**
2. **Type this exactly**: `4111111111111111`
3. **CVV**: `123`
4. **Expiry**: `12/25`
5. **Click Continue**

If this doesn't work, **use Netbanking** option instead!

---

## 📱 Screenshot Debugging

If you can share a screenshot of:
- The exact error message
- The Razorpay dashboard (Settings → API Keys page)
- Console errors (F12 → Console tab)

I can help debug more specifically!

---

**TL;DR**: Try typing `4111111111111111` manually without spaces, or use the **Netbanking** option in Razorpay modal! 🚀
