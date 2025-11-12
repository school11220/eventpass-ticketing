# 🎯 Getting Started - Complete Step-by-Step Guide

Welcome! This guide will walk you through setting up EventPass from scratch to deployment.

---

## 📝 What You're About to Build

**EventPass** is a full-featured event ticketing system with:
- 🎟️ Event browsing and booking
- 💳 Razorpay payment integration
- 📱 QR code ticket generation
- 📧 Email ticket delivery
- 📸 Camera-based check-in scanner
- 👨‍💼 Admin dashboard
- 🔒 Secure authentication and payments

**Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, PostgreSQL, Razorpay

**Deployment**: Vercel (Free tier)

---

## ⏱️ Time Required

- **Setup**: 30-45 minutes
- **Local Testing**: 15-30 minutes
- **Deployment**: 15-30 minutes
- **Total**: ~1.5-2 hours

---

## 📋 Prerequisites

Before starting, ensure you have:

### 1. Required Software
```bash
# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version

# Check git version
git --version
```

If any are missing:
- **Node.js**: Download from [nodejs.org](https://nodejs.org) (LTS version)
- **Git**: Download from [git-scm.com](https://git-scm.com)

### 2. Required Accounts (All Free)
- [ ] GitHub account ([github.com](https://github.com))
- [ ] Vercel account ([vercel.com](https://vercel.com))
- [ ] Neon account ([neon.tech](https://neon.tech))
- [ ] Razorpay account ([razorpay.com](https://razorpay.com))

---

## 🚀 Part 1: Initial Setup (10 minutes)

### Step 1: Install Dependencies

```bash
# You're already in the /home/shivam/check-in directory
cd /home/shivam/check-in

# Install all packages
npm install
```

**Expected Output**: You'll see packages being installed. Should complete without errors.

**If it fails**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#npm-install-fails)

---

## 🗄️ Part 2: Database Setup (15 minutes)

### Step 1: Create Neon Database

1. **Go to** [console.neon.tech](https://console.neon.tech)
2. **Click** "Sign Up" (use GitHub to sign in quickly)
3. **Click** "New Project"
4. **Enter**:
   - Name: `eventpass-db`
   - Region: Choose closest to you
   - PostgreSQL version: Leave default
5. **Click** "Create Project"

### Step 2: Get Connection String

1. In your new project, you'll see a connection string
2. **Click** "Copy" next to the connection string
3. It looks like:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
4. **Save this** - you'll need it in the next section

### Step 3: Create Database Tables

1. **Click** "SQL Editor" in the left sidebar
2. **Open** the `schema.sql` file in your project
3. **Copy** all the contents (Ctrl+A, Ctrl+C)
4. **Paste** into the SQL Editor
5. **Click** "Run" button
6. **You should see**: ✅ Query executed successfully
7. **Verify**: Click "Tables" in sidebar - you should see:
   - events
   - orders
   - tickets

**What this does**: Creates the database structure and adds 5 sample events.

---

## 🔑 Part 3: Razorpay Setup (10 minutes)

### Step 1: Create Account

1. **Go to** [razorpay.com](https://razorpay.com)
2. **Click** "Sign Up"
3. **Fill** basic details (you can use test mode without completing KYC)
4. **Verify** your email

### Step 2: Get API Keys

1. **After login**, you'll be in the dashboard
2. **Click** on "Account & Settings" → "API Keys"
3. **You'll see** "Test Mode" section (we'll use this for development)
4. **Click** "Generate Test Key" if not already visible
5. **You'll see**:
   - **Key ID**: `rzp_test_xxxxxxxxxx`
   - **Key Secret**: Click "Show" to reveal
6. **Copy both** - you'll need them next

**Important**: Keep the secret key secure! Don't share it.

---

## ⚙️ Part 4: Configure Environment (10 minutes)

### Step 1: Create Environment File

```bash
# Copy the example file
cp .env.example .env.local
```

### Step 2: Fill in Values

Open `.env.local` in your editor:

```bash
# Using VS Code
code .env.local

# Or use any text editor
nano .env.local
```

### Step 3: Add Your Values

Replace the placeholder values:

```env
# Paste your Neon connection string from Part 2, Step 2
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require

# Paste your Razorpay keys from Part 3, Step 2
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx

# Generate a random secret (run the command below)
JWT_SECRET=your_random_secret_here

# For local development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Choose a strong password for admin access
ADMIN_PASS=MySecurePassword123

# Email is optional - skip for now
# EMAIL_USER=
# EMAIL_PASS=
```

### Step 4: Generate JWT Secret

Run this command to generate a secure random string:

**Linux/Mac**:
```bash
openssl rand -base64 32
```

**Windows PowerShell**:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copy the output and paste it as your `JWT_SECRET` value.

### Step 5: Save the File

Save `.env.local` (Ctrl+S)

---

## 🎮 Part 5: Test Locally (20 minutes)

### Step 1: Start Development Server

```bash
npm run dev
```

**Expected Output**:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in 2.3s
```

**If it shows errors**: Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Step 2: Test Homepage

1. **Open browser**: [http://localhost:3000](http://localhost:3000)
2. **You should see**:
   - EventPass logo and navigation
   - 5 sample events with images
   - Event cards with prices and details

**If you see errors**: Most likely database connection issue. Check your `DATABASE_URL`.

### Step 3: Test Event Detail

1. **Click** on any event card
2. **You should see**:
   - Event details (name, date, venue, price)
   - Booking form (name, email, phone)
   - "Proceed to Payment" button

### Step 4: Test Payment (Important!)

1. **Fill in** the booking form:
   - Name: Your Name
   - Email: your@email.com
   - Phone: 1234567890
2. **Click** "Proceed to Payment"
3. **Razorpay popup should open**
4. **Use test card**:
   - Card: `4111 1111 1111 1111`
   - Expiry: Any future date (e.g., `12/25`)
   - CVV: Any 3 digits (e.g., `123`)
   - Name: Your Name
5. **Click** "Pay"
6. **You should be redirected** to ticket page with QR code

**If Razorpay doesn't open**: Check browser console (F12) for errors. Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set.

### Step 5: Test Check-In Scanner

1. **Go to**: [http://localhost:3000/checkin](http://localhost:3000/checkin)
2. **Click** "Start Scanning"
3. **Allow camera access** when prompted
4. **Point camera** at the QR code from your ticket
5. **You should see**: ✅ "Check-In Successful!" message

**If camera doesn't start**: Check browser permissions or use manual token entry.

### Step 6: Test Admin Dashboard

1. **Go to**: [http://localhost:3000/admin](http://localhost:3000/admin)
2. **Enter** your `ADMIN_PASS` password
3. **Click** "Login"
4. **You should see**:
   - Total orders count
   - Successful sales
   - Total revenue
   - Event statistics table

---

## 🌐 Part 6: Deploy to Vercel (30 minutes)

### Step 1: Push to GitHub

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: EventPass application"
```

### Step 2: Create GitHub Repository

1. **Go to**: [github.com/new](https://github.com/new)
2. **Repository name**: `eventpass`
3. **Visibility**: Public or Private (your choice)
4. **Don't** initialize with README (we already have files)
5. **Click** "Create repository"

### Step 3: Push Code

Copy the commands from GitHub (looks like this):

```bash
git remote add origin https://github.com/YOUR_USERNAME/eventpass.git
git branch -M main
git push -u origin main
```

### Step 4: Connect to Vercel

1. **Go to**: [vercel.com](https://vercel.com)
2. **Click** "Sign Up" or "Log In" (use GitHub to connect)
3. **Click** "Add New" → "Project"
4. **Click** "Import" next to your `eventpass` repository
5. **Click** "Import"

### Step 5: Configure Project

1. **Framework Preset**: Should auto-detect "Next.js"
2. **Root Directory**: Leave as `./`
3. **Build Command**: Leave as `npm run build`
4. **Output Directory**: Leave as `.next`

### Step 6: Add Environment Variables

**This is crucial!** Click "Environment Variables" and add each one:

For each variable, click "Add" and fill:

1. **DATABASE_URL**
   - Value: Your Neon connection string
   - Environment: Production, Preview, Development (select all)

2. **RAZORPAY_KEY_ID**
   - Value: `rzp_test_xxxxxxxxxx`
   - Environment: All

3. **RAZORPAY_KEY_SECRET**
   - Value: Your secret
   - Environment: All

4. **NEXT_PUBLIC_RAZORPAY_KEY_ID**
   - Value: `rzp_test_xxxxxxxxxx` (same as RAZORPAY_KEY_ID)
   - Environment: All

5. **JWT_SECRET**
   - Value: Your generated secret
   - Environment: All

6. **ADMIN_PASS**
   - Value: Your admin password
   - Environment: All

**Skip** `NEXT_PUBLIC_BASE_URL` for now (we'll add it after deployment).

### Step 7: Deploy

1. **Click** "Deploy"
2. **Wait** 2-3 minutes for build
3. **You'll see**: 🎉 Congratulations! with confetti
4. **Click** "Visit" to see your live site

### Step 8: Update Base URL

1. **Copy** your Vercel URL (e.g., `https://eventpass-xxx.vercel.app`)
2. **Go back** to Vercel project settings
3. **Click** "Settings" → "Environment Variables"
4. **Add new variable**:
   - Name: `NEXT_PUBLIC_BASE_URL`
   - Value: `https://eventpass-xxx.vercel.app` (your URL)
   - Environment: All
5. **Click** "Save"
6. **Go to** "Deployments" tab
7. **Click** "..." on latest deployment → "Redeploy"
8. **Uncheck** "Use existing Build Cache"
9. **Click** "Redeploy"

---

## ✅ Part 7: Test Production (15 minutes)

### Test Everything on Production

1. **Visit** your Vercel URL
2. **Test payment** with test card
3. **Test check-in scanner** (works on mobile too!)
4. **Test admin dashboard**

### Test on Mobile

1. **Open** your Vercel URL on your phone
2. **Complete** a ticket purchase
3. **Go to** `/checkin` on mobile
4. **Scan** the QR code from desktop

---

## 🎉 Congratulations!

You've successfully built and deployed EventPass!

### What You've Accomplished

✅ Set up a Next.js 14 application
✅ Integrated PostgreSQL database (Neon)
✅ Integrated Razorpay payments
✅ Implemented QR code ticketing
✅ Built a check-in scanner
✅ Created an admin dashboard
✅ Deployed to Vercel

### Your Live URLs

- **Production Site**: `https://your-app.vercel.app`
- **Admin Panel**: `https://your-app.vercel.app/admin`
- **Check-in**: `https://your-app.vercel.app/checkin`

---

## 📚 Next Steps

### Immediate Tasks

1. **Bookmark** your admin URL
2. **Share** your site with friends to test
3. **Try** creating test events in your database

### Customization Ideas

1. **Add Your Events**: Update database with real events
2. **Change Branding**: Update colors in `tailwind.config.ts`
3. **Add Logo**: Replace logo in navbar
4. **Customize Emails**: Edit email template in `send-email/route.ts`

### Production Readiness

When you're ready to go live:

1. **Complete Razorpay KYC** verification
2. **Switch to live keys** (from test keys)
3. **Set up email** (Gmail or Resend)
4. **Add custom domain** (optional)
5. **Configure backup** strategy for database

---

## 🆘 Need Help?

### Resources

- **README.md**: Full documentation
- **TROUBLESHOOTING.md**: Common issues and solutions
- **QUICK_REFERENCE.md**: Quick command reference
- **PROJECT_STRUCTURE.md**: Architecture overview

### Common Issues

Most problems are due to:
1. ❌ Missing environment variables
2. ❌ Wrong database connection string
3. ❌ Mismatched Razorpay keys

**Always check environment variables first!**

### Still Stuck?

1. Check browser console (F12 → Console tab)
2. Check Vercel logs (Deployments → View Function Logs)
3. Check Neon logs (Monitoring tab)
4. Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 🎯 Success Checklist

Before considering yourself done, verify:

- [ ] Homepage loads and shows events
- [ ] Event detail page loads
- [ ] Payment completes successfully
- [ ] Ticket displays with QR code
- [ ] Check-in scanner opens camera
- [ ] QR code scan works
- [ ] Admin login works
- [ ] Admin dashboard shows stats
- [ ] Site is accessible on mobile
- [ ] Site is live on Vercel

---

**You're all set! Happy event managing! 🎊**

For detailed information, see the other guides:
- [README.md](./README.md) - Complete documentation
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Detailed deployment
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Problem solving
