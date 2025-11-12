# 📸 Visual Guide: Getting Razorpay Credentials

## Step-by-Step with Screenshots Reference

### 🔐 Step 1: Login to Razorpay Dashboard

**URL**: https://dashboard.razorpay.com/

**What you'll see**:
- Dashboard homepage
- Sidebar with menu options
- Test/Live mode toggle at top right

---

### 🔑 Step 2: Navigate to API Keys

**Location**: Left Sidebar → Settings (gear icon) → API Keys

**Path**:
```
Dashboard → Settings → Configuration → API Keys
```

**What to look for**:
- Settings section in sidebar
- "API Keys" under "Configuration"
- Click on "API Keys"

---

### 🎯 Step 3: Choose Test Mode

**Toggle Location**: Top right corner of the page

**Important**:
- ⚠️ Make sure you're in **TEST MODE** (not Live Mode)
- Test mode toggle should be **ON** (blue/green)
- You'll see "Test Mode" label
- Test keys start with `rzp_test_`

---

### 🔨 Step 4: Generate Test Key (if needed)

**Button Location**: Center of the page

**What you'll see**:
- If you don't have keys yet: "Generate Test Key" button
- If you have keys: They'll be displayed

**Click**: "Generate Test Key" button

---

### 📋 Step 5: Copy Your Credentials

**You'll see two keys**:

#### 1. Key ID (Public)
```
Format: rzp_test_XXXXXXXXXXXX
Example: rzp_test_1DP5mmOlF5G5ag
```
- ✅ This is public and safe to use in frontend
- Shows immediately
- Can be regenerated

#### 2. Key Secret (Private)
```
Format: XXXXXXXXXXXXXXXXXXXXXXXX
Example: ThisIsYourSecretKey12345
```
- ⚠️ This is SECRET - never share or commit to git
- ⚠️ Only shown ONCE when generated
- Store it safely immediately!

---

### 💾 Step 6: Copy Both Keys

**What to copy**:

1. **Click the "Copy" button** next to Key ID
2. **Click "Show" then "Copy"** for Key Secret
3. ⚠️ **Save Key Secret immediately** - you won't see it again!

---

### 📝 Step 7: Add to .env.local

**Open file**: `/home/shivam/check-in/.env.local`

**Add these lines**:
```bash
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
```

**Replace**:
- `rzp_test_XXXXXXXXXXXX` with your actual Key ID
- `XXXXXXXXXXXXXXXXXXXXXXXX` with your actual Key Secret

---

## 🎨 Visual Checklist

When you're on the correct page, you should see:

```
┌─────────────────────────────────────────────────┐
│  Razorpay Dashboard          [Test Mode] [▼]   │
├─────────────────────────────────────────────────┤
│  ☰ Menu                                         │
│                                                 │
│  📊 Dashboard                                   │
│  💳 Payments                                    │
│  📦 Orders                                      │
│  🏦 Settlements                                 │
│  👥 Customers                                   │
│  ⚙️  Settings                                    │
│     └─ Configuration                            │
│        └─ API Keys        ← YOU ARE HERE       │
│                                                 │
└─────────────────────────────────────────────────┘
```

On the API Keys page:

```
┌─────────────────────────────────────────────────┐
│  API Keys                        [Test Mode]    │
├─────────────────────────────────────────────────┤
│                                                 │
│  🔑 Key ID                                      │
│  ┌──────────────────────────────────────────┐  │
│  │ rzp_test_XXXXXXXXXXXX         [Copy]    │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  🔐 Key Secret                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ ************************     [Show][Copy]│  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ⚠️  Keep your key secret secure               │
│  Never share it or commit it to version control│
│                                                 │
│  📚 View API Documentation                      │
│  🔄 Regenerate Keys                             │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Quick Navigation Guide

### From Dashboard Homepage:

**Option 1 (Fastest)**:
```
Click gear icon (⚙️) → API Keys
```

**Option 2 (Full Path)**:
```
Click Settings → Configuration → API Keys
```

**Option 3 (Direct URL)**:
```
https://dashboard.razorpay.com/app/keys
```

---

## ⚡ Quick Tips

### ✅ DO:
- ✅ Use **Test Mode** for development
- ✅ Copy both keys immediately
- ✅ Store Key Secret safely
- ✅ Add to `.env.local` file
- ✅ Keep `.env.local` in `.gitignore`

### ❌ DON'T:
- ❌ Use Live Mode for testing
- ❌ Share Key Secret publicly
- ❌ Commit keys to git
- ❌ Use test keys in production
- ❌ Forget to copy Key Secret (shown only once!)

---

## 🔍 What Each Section Looks Like

### Settings Sidebar:
```
⚙️ Settings
├─ 📋 Account & Settings
├─ 👥 Team & Access
├─ 🔧 Configuration
│  ├─ 🔑 API Keys         ← Click here!
│  ├─ 🔗 Webhooks
│  └─ 🌐 Checkout
└─ 💰 Pricing
```

### Test Mode Toggle:
```
┌──────────────────┐
│ [●] Test Mode    │  ← Should be ON (blue/green)
│ [ ] Live Mode    │  ← Should be OFF
└──────────────────┘
```

---

## 📱 Mobile View Note

If you're on mobile:
1. Tap the menu icon (☰)
2. Scroll to Settings
3. Tap Configuration
4. Tap API Keys
5. Make sure Test Mode is selected

---

## 🆘 Can't Find It?

### Search Method:
1. Look for a **search bar** at the top
2. Type: "API Keys"
3. Click on the result

### Help Button:
1. Click the **Help** or **Support** button
2. Search for "API Keys"
3. Follow the guide

### Direct URL:
```
https://dashboard.razorpay.com/app/keys
```
Just paste this URL in your browser!

---

## ✅ Verification

### How to know you did it right:

1. Your `.env.local` should have:
   ```bash
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   ```

2. Key ID should start with `rzp_test_`
3. Key Secret is a long alphanumeric string
4. Both should be on separate lines
5. No quotes needed around values

---

## 🎉 Done!

Once you've added both keys to `.env.local`:
```bash
npm run dev
```

Your Razorpay integration is now live! 🚀

---

## 📞 Need Help?

- **Razorpay Support**: https://razorpay.com/support/
- **Docs**: https://razorpay.com/docs/
- **Contact**: support@razorpay.com

---

**Pro Tip**: Take a screenshot of your Key Secret right after generating it, store it securely, then delete the screenshot after adding to `.env.local`!
