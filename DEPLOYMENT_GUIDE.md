# 🚀 Complete Deployment Guide - Deploy to Vercel (Free)

This guide will walk you through deploying your EventPass application to Vercel's free tier in **15-20 minutes**.

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ GitHub account (free)
- ✅ Vercel account (free - we'll create during deployment)
- ✅ Neon database set up (follow `DATABASE_SETUP_GUIDE.md`)
- ✅ Razorpay account (optional, for payments)

---

## 🎯 Deployment Steps

### Step 1: Push Your Code to GitHub (5 minutes)

#### 1.1 Create a GitHub Repository

1. Go to **https://github.com/new**
2. Repository name: `eventpass-ticketing`
3. Description: "Event ticketing system with QR check-in"
4. **Select "Public"** (required for Vercel free tier)
5. **Do NOT initialize** with README, .gitignore, or license
6. Click **"Create repository"**

#### 1.2 Initialize Git and Push Code

Open terminal in your project folder and run:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: EventPass ticketing system"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/eventpass-ticketing.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Important:** Replace `YOUR_USERNAME` with your actual GitHub username!

✅ **Verify:** Refresh your GitHub repository page - you should see all your code.

---

### Step 2: Create Vercel Account (2 minutes)

1. Go to **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. Complete the setup (name, team name optional)

✅ **You're now logged into Vercel!**

---

### Step 3: Deploy to Vercel (3 minutes)

#### 3.1 Import Your Repository

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see "Import Git Repository"
3. Find `eventpass-ticketing` in the list
4. Click **"Import"**

#### 3.2 Configure Project

1. **Project Name:** `eventpass` (or keep default)
2. **Framework Preset:** Next.js (auto-detected)
3. **Root Directory:** `./` (keep default)
4. **Build Command:** `npm run build` (auto-filled)
5. **Output Directory:** `.next` (auto-filled)
6. **Install Command:** `npm install` (auto-filled)

**Don't deploy yet!** We need to add environment variables first.

---

### Step 4: Add Environment Variables (5 minutes)

In the Vercel project configuration screen, scroll to **"Environment Variables"** section.

#### 4.1 Add All Environment Variables

Add these one by one (click "Add" after each):

**1. DATABASE_URL**
```
Name: DATABASE_URL
Value: your-neon-connection-string
Environment: Production, Preview, Development (select all 3)
```

**2. RAZORPAY_KEY_ID**
```
Name: RAZORPAY_KEY_ID
Value: rzp_test_YOUR_KEY_ID
Environment: Production, Preview, Development
```

**3. RAZORPAY_KEY_SECRET**
```
Name: RAZORPAY_KEY_SECRET
Value: YOUR_SECRET_KEY
Environment: Production, Preview, Development
```

**4. NEXT_PUBLIC_RAZORPAY_KEY_ID**
```
Name: NEXT_PUBLIC_RAZORPAY_KEY_ID
Value: rzp_test_YOUR_KEY_ID (same as #2)
Environment: Production, Preview, Development
```

**5. JWT_SECRET**
```
Name: JWT_SECRET
Value: (generate with: openssl rand -base64 32)
Environment: Production, Preview, Development
```

**6. NEXT_PUBLIC_BASE_URL**
```
Name: NEXT_PUBLIC_BASE_URL
Value: (leave empty for now, we'll add after deployment)
Environment: Production, Preview, Development
```

**7. ADMIN_PASS**
```
Name: ADMIN_PASS
Value: admin123
Environment: Production, Preview, Development
```

**8. EMAIL_USER** (Optional)
```
Name: EMAIL_USER
Value: your-email@gmail.com
Environment: Production, Preview, Development
```

**9. EMAIL_PASS** (Optional)
```
Name: EMAIL_PASS
Value: your-gmail-app-password
Environment: Production, Preview, Development
```

#### 4.2 Where to Get These Values

- **DATABASE_URL:** From Neon.tech dashboard (see `DATABASE_SETUP_GUIDE.md`)
- **Razorpay keys:** From https://dashboard.razorpay.com/app/keys
- **JWT_SECRET:** Run `openssl rand -base64 32` in terminal
- **Admin password:** Use `admin123` or set your own

---

### Step 5: Deploy! (2 minutes)

1. After adding all environment variables, click **"Deploy"**
2. Vercel will start building your app
3. Wait 1-2 minutes for build to complete
4. You'll see **"Congratulations! Your project has been deployed."**

✅ **Your app is now live!**

---

### Step 6: Update Base URL (1 minute)

1. Copy your deployment URL (e.g., `eventpass.vercel.app`)
2. In Vercel dashboard:
   - Go to **Settings** → **Environment Variables**
   - Find `NEXT_PUBLIC_BASE_URL`
   - Click **Edit**
   - Value: `https://eventpass.vercel.app` (your actual URL)
   - Save
3. Go to **Deployments** tab
4. Click **⋮** (three dots) on latest deployment
5. Click **"Redeploy"**

---

### Step 7: Test Your Deployment (5 minutes)

#### 7.1 Visit Your Live Site

Open your deployment URL (e.g., `https://eventpass.vercel.app`)

**You should see:**
- ✅ Comedy Night Live event displayed
- ✅ Clean navigation bar
- ✅ Footer with policy links

#### 7.2 Test Booking Flow

1. Click on the comedy event
2. Fill in booking form
3. Click "Buy Ticket"
4. Razorpay payment popup should appear
5. Use test card: `4111 1111 1111 1111`
6. Complete payment
7. You should receive QR code ticket

#### 7.3 Test Admin Check-In

1. Go to `/checkin` on your live URL
2. Login with `admin123`
3. Click "Start Scanning"
4. Allow camera access
5. Scan the QR code from step 7.2

#### 7.4 Test Admin Dashboard

1. Go to `/admin` on your live URL
2. Login with `admin123`
3. View statistics

---

## 🔧 Post-Deployment Configuration

### Update Razorpay Webhook URL (Optional)

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-domain.vercel.app/api/webhook`
3. Enable events: `payment.captured`, `payment.failed`

### Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Click "Add"
3. Enter your custom domain
4. Follow DNS configuration steps

---

## 🎉 You're Done!

Your EventPass application is now live on Vercel!

**Live URLs:**
- Homepage: `https://your-app.vercel.app`
- Check-in: `https://your-app.vercel.app/checkin`
- Admin: `https://your-app.vercel.app/admin`

---

## 📊 Vercel Free Tier Limits

Perfect for your use case:
- ✅ **100 GB bandwidth/month** (plenty for ticket sales)
- ✅ **Unlimited deployments**
- ✅ **Automatic HTTPS**
- ✅ **Serverless functions** (your API routes)
- ✅ **Edge network** (fast worldwide)
- ✅ **Automatic preview deployments** (for each git push)

---

## 🔄 How to Update Your App

After making changes to your code:

```bash
# Make your changes, then:
git add .
git commit -m "Your update message"
git push
```

**Vercel automatically deploys every push to main branch!** ✨

Check deployment status at: https://vercel.com/dashboard

---

## 🐛 Troubleshooting

### Build Failed?

**Check build logs in Vercel:**
1. Go to Deployments tab
2. Click on failed deployment
3. Read error logs

**Common issues:**
- Missing environment variables → Add them in Settings
- TypeScript errors → Run `npm run build` locally first
- Missing dependencies → Check `package.json`

### App Shows Errors?

**Check function logs:**
1. Vercel dashboard → Your project
2. Click "View Function Logs"
3. See runtime errors

**Common issues:**
- Database connection → Verify `DATABASE_URL`
- API routes failing → Check environment variables
- Payment issues → Verify Razorpay keys

### Database Connection Issues?

1. Test connection string in Neon dashboard
2. Make sure it ends with `?sslmode=require`
3. Verify it's added in Vercel environment variables
4. Redeploy after adding variables

---

## 🎓 What You've Learned

- ✅ Deploying Next.js apps to Vercel
- ✅ Setting up environment variables
- ✅ Connecting to cloud PostgreSQL (Neon)
- ✅ Managing production deployments
- ✅ CI/CD with GitHub + Vercel

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Neon Docs:** https://neon.tech/docs

---

## 🚀 Advanced: Custom Deployment Options

### Deploy to Other Platforms

Your app can also deploy to:
- **Netlify:** Similar to Vercel
- **Railway:** Includes database hosting
- **Render:** Free tier with PostgreSQL
- **DigitalOcean App Platform:** More control

Just push to GitHub and connect the platform!

---

**Congratulations! Your event ticketing system is now live and accessible worldwide! 🎉**
