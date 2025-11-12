# 🚀 Deploy to Vercel - Step by Step

## Your Database is Ready! ✅
Connection string configured in `.env.local`

---

## Quick Deployment Steps (10 minutes)

### Step 1: Initialize Git & Push to GitHub (3 minutes)

Run these commands in your terminal:

```bash
# Navigate to your project
cd /home/shivam/check-in

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "EventPass: Complete ticketing system with QR check-in"

# Create GitHub repository (you'll need to do this manually)
# Go to: https://github.com/new
# Repository name: eventpass-ticketing
# Make it PUBLIC (required for free Vercel)
# Don't initialize with README
# Click "Create repository"

# After creating on GitHub, run these commands:
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/eventpass-ticketing.git
git branch -M main
git push -u origin main
```

**Important:** Replace `YOUR_USERNAME` with your actual GitHub username!

---

### Step 2: Deploy on Vercel (5 minutes)

#### 2.1 Sign Up / Login to Vercel
1. Go to: **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Authorize Vercel

#### 2.2 Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find **"eventpass-ticketing"** in the list
3. Click **"Import"**

#### 2.3 Add Environment Variables

**IMPORTANT:** Before clicking Deploy, scroll down to "Environment Variables" and add these:

**Copy and paste these one by one:**

1. **DATABASE_URL**
   ```
   postgresql://neondb_owner:npg_1cQVHWNIrw3x@ep-still-resonance-a1rz60im-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
   Environment: Production, Preview, Development ✓

2. **JWT_SECRET**
   ```
   Jz+xQuXn0Sbvynzf1myV5ulWG/kgek/uvEq5pCzmdLI=
   ```
   Environment: Production, Preview, Development ✓

3. **ADMIN_PASS**
   ```
   admin123
   ```
   Environment: Production, Preview, Development ✓

4. **RAZORPAY_KEY_ID** (get from https://dashboard.razorpay.com)
   ```
   rzp_test_YOUR_KEY_HERE
   ```
   Environment: Production, Preview, Development ✓

5. **RAZORPAY_KEY_SECRET**
   ```
   YOUR_SECRET_HERE
   ```
   Environment: Production, Preview, Development ✓

6. **NEXT_PUBLIC_RAZORPAY_KEY_ID**
   ```
   rzp_test_YOUR_KEY_HERE (same as #4)
   ```
   Environment: Production, Preview, Development ✓

7. **NEXT_PUBLIC_BASE_URL**
   ```
   (leave empty for now, we'll update after deployment)
   ```

#### 2.4 Deploy!
1. Click **"Deploy"**
2. Wait 1-2 minutes
3. You'll see "Congratulations!"

---

### Step 3: Update Base URL (1 minute)

1. Copy your deployment URL (e.g., `eventpass-ticketing.vercel.app`)
2. In Vercel dashboard → **Settings** → **Environment Variables**
3. Find **NEXT_PUBLIC_BASE_URL**
4. Edit and set to: `https://eventpass-ticketing.vercel.app`
5. Go to **Deployments** → Click **⋮** → **Redeploy**

---

### Step 4: Run Database Schema (1 minute)

You need to add the Comedy Night event to your Neon database:

1. Go to: **https://console.neon.tech**
2. Select your project
3. Click **"SQL Editor"** (left sidebar)
4. Copy and paste this SQL:

```sql
-- EventPass Database Schema
-- Run this script on your Neon.tech PostgreSQL database

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  venue TEXT NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  amount INTEGER NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  qr_token TEXT UNIQUE NOT NULL,
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMP,
  checked_in_by TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_event_id ON orders(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_order_id ON tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_tickets_qr_token ON tickets(qr_token);
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON tickets(event_id);

-- Sample seed data - Comedy Show
INSERT INTO events (name, description, date, venue, price, image_url) VALUES
  ('Comedy Night Live', 'An evening of laughter with top stand-up comedians. Get ready for non-stop entertainment!', '2025-12-20 20:00:00', 'The Laugh Factory, Mumbai', 200, 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800')
ON CONFLICT DO NOTHING;
```

5. Click **"Run"**
6. You should see success message ✅

---

## 🎉 You're Live!

Visit your deployment URL: `https://your-app.vercel.app`

### What You Should See:

1. **Homepage** (`/`)
   - Comedy Night Live event (₹200)
   - Click to book

2. **Event Page** (`/event/[id]`)
   - Simple booking form
   - Name, Email, Phone fields
   - "Buy Ticket - ₹200" button

3. **After Payment:**
   - QR code ticket displayed
   - Ticket ID and event details
   - QR code can be scanned

4. **Check-In Page** (`/checkin`)
   - Admin login: `admin123`
   - Camera scanner for QR codes
   - Manual token entry option

5. **Admin Dashboard** (`/admin`)
   - Admin login: `admin123`
   - View sales statistics
   - See total orders and revenue

---

## 🧪 Test Your Deployment

### Test Event Booking:
1. Visit your Vercel URL
2. Click "Comedy Night Live"
3. Fill in the form
4. Click "Buy Ticket"
5. **Use Razorpay test card:**
   - Card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date
6. Complete payment
7. See QR code ticket! ✅

### Test Check-In:
1. Go to `/checkin` on your URL
2. Login: `admin123`
3. Click "Start Scanning"
4. Scan the QR code from above
5. See "Check-In Successful!" ✅

---

## 🔑 Quick Reference

**Your Deployment URL:** `https://[your-app].vercel.app`

**Admin Password:** `admin123`

**Test Payment Card:** `4111 1111 1111 1111`

**Database:** Neon.tech (already connected)

---

## 📱 Features Working:

✅ Event display (Comedy Night Live - ₹200)
✅ Booking form
✅ Razorpay payment integration
✅ QR code generation
✅ Email ticket delivery (if EMAIL_USER/PASS configured)
✅ Check-in scanner with camera
✅ Manual token check-in
✅ Admin dashboard with statistics
✅ Login persistence (stays logged in)

---

## 🐛 Troubleshooting

### "No events available"?
- Make sure you ran the SQL schema in Neon SQL Editor
- Check DATABASE_URL is correct in Vercel environment variables
- Redeploy after adding variables

### Payment not working?
- Get Razorpay keys from https://dashboard.razorpay.com/app/keys
- Add both RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
- Add NEXT_PUBLIC_RAZORPAY_KEY_ID (same as key ID)
- Redeploy

### Can't login to admin?
- Password is `admin123`
- Change it by updating ADMIN_PASS in Vercel environment variables

---

## 🎓 What You've Deployed

✨ A complete event ticketing system with:
- Event browsing
- Secure payment processing
- QR code ticket generation
- Mobile-friendly check-in scanner
- Admin dashboard
- Database-backed
- Production-ready
- Hosted on Vercel's global CDN

**Congratulations! Your app is live! 🎉**

---

## 📞 Need Help?

- Vercel Dashboard: https://vercel.com/dashboard
- Neon Dashboard: https://console.neon.tech
- Razorpay Dashboard: https://dashboard.razorpay.com

**Your app will auto-deploy every time you push to GitHub!** Just commit and push changes. ✨
