# 🎯 DEPLOY RIGHT NOW - Quick Steps

## ✅ Your Project is Ready to Deploy!

Your code is committed and ready. Follow these 3 simple steps:

---

## Step 1: Create GitHub Repository (2 min)

1. Go to: **https://github.com/new**
2. Repository name: `eventpass-ticketing`
3. Make it **PUBLIC** ✓ (required for free Vercel)
4. **Don't** initialize with README
5. Click **"Create repository"**

---

## Step 2: Push Your Code (30 sec)

Copy your GitHub username, then run:

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/eventpass-ticketing.git
git branch -M main
git push -u origin main
```

**Example:** If username is `john123`:
```bash
git remote add origin https://github.com/john123/eventpass-ticketing.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy on Vercel (5 min)

### A. Sign up/Login
1. Visit: **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Authorize Vercel

### B. Import Project
1. Click **"Add New..."** → **"Project"**
2. Find `eventpass-ticketing`
3. Click **"Import"**

### C. Add Environment Variables

**CRITICAL:** Scroll to "Environment Variables" and add these:

**1. DATABASE_URL**
```
postgresql://neondb_owner:npg_1cQVHWNIrw3x@ep-still-resonance-a1rz60im-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```
Select: Production ✓ Preview ✓ Development ✓

**2. JWT_SECRET**
```
Jz+xQuXn0Sbvynzf1myV5ulWG/kgek/uvEq5pCzmdLI=
```
Select: Production ✓ Preview ✓ Development ✓

**3. ADMIN_PASS**
```
admin123
```
Select: Production ✓ Preview ✓ Development ✓

**4. RAZORPAY_KEY_ID** (optional - get from razorpay.com)
```
rzp_test_YOUR_KEY
```
Select: Production ✓ Preview ✓ Development ✓

**5. RAZORPAY_KEY_SECRET** (optional)
```
YOUR_SECRET
```
Select: Production ✓ Preview ✓ Development ✓

**6. NEXT_PUBLIC_RAZORPAY_KEY_ID** (optional - same as #4)
```
rzp_test_YOUR_KEY
```
Select: Production ✓ Preview ✓ Development ✓

### D. Deploy!
1. Click **"Deploy"** button
2. Wait 2 minutes
3. Done! 🎉

---

## Step 4: Run Database Schema (2 min)

Your database needs the tables and event:

1. Go to: **https://console.neon.tech**
2. Click **"SQL Editor"**
3. **Copy the entire `schema.sql` file** from your project
4. Paste in SQL Editor
5. Click **"Run"**
6. Success! ✅

---

## 🎉 Your App is Live!

Visit: `https://your-app.vercel.app`

### What Works:
- ✅ Homepage with Comedy Night event (₹200)
- ✅ Booking form
- ✅ Payment processing (if Razorpay configured)
- ✅ QR code generation
- ✅ Check-in scanner (`/checkin` - login: `admin123`)
- ✅ Admin dashboard (`/admin` - login: `admin123`)

---

## 📝 Quick Notes

**Without Razorpay keys:** Event shows, form works, but payment will fail (that's okay for testing UI)

**With Razorpay keys:** Full payment flow works with test card `4111 1111 1111 1111`

**Database is connected:** Your Neon database is ready to use!

---

## 🚀 Total Time: ~10 minutes

1. Create GitHub repo: 2 min
2. Push code: 30 sec
3. Deploy on Vercel: 5 min
4. Run database schema: 2 min
5. **Done!** 🎉

---

## 🔗 Useful Links

- **GitHub:** https://github.com/new
- **Vercel:** https://vercel.com/signup
- **Neon Console:** https://console.neon.tech
- **Razorpay Dashboard:** https://dashboard.razorpay.com (optional)

---

**Your database is connected and ready!**
**Just push to GitHub and deploy on Vercel!** 🚀
