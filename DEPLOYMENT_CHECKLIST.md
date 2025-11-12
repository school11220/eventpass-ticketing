# ✅ Deployment Checklist

## Local Setup - DONE ✓

- ✅ Database connection configured
- ✅ JWT secret generated  
- ✅ Git initialized
- ✅ Initial commit created
- ✅ 48 files ready to deploy

---

## Next: Deploy to Vercel

### Step 1: GitHub Repository
- [ ] Go to https://github.com/new
- [ ] Name: `eventpass-ticketing`
- [ ] Make it PUBLIC
- [ ] Create repository
- [ ] Copy your GitHub username

### Step 2: Push Code
Run this (replace YOUR_USERNAME):
```bash
git remote add origin https://github.com/YOUR_USERNAME/eventpass-ticketing.git
git branch -M main
git push -u origin main
```

### Step 3: Vercel Deployment
- [ ] Go to https://vercel.com/signup
- [ ] Continue with GitHub
- [ ] Import `eventpass-ticketing` repo
- [ ] Add environment variables (see below)
- [ ] Click Deploy

### Environment Variables to Add:
```
✓ DATABASE_URL (your Neon connection string - ready!)
✓ JWT_SECRET (already generated - ready!)
✓ ADMIN_PASS (admin123)
✓ RAZORPAY_KEY_ID (optional - get from razorpay.com)
✓ RAZORPAY_KEY_SECRET (optional)
✓ NEXT_PUBLIC_RAZORPAY_KEY_ID (optional - same as key ID)
```

### Step 4: Database Schema
- [ ] Go to https://console.neon.tech
- [ ] Click SQL Editor
- [ ] Copy entire `schema.sql` file
- [ ] Paste and run
- [ ] Verify "Comedy Night Live" event created

---

## Testing Your Deployment

### Test 1: Homepage
- [ ] Visit your Vercel URL
- [ ] See "Comedy Night Live" event
- [ ] Price shows ₹200
- [ ] Event is clickable

### Test 2: Booking Form
- [ ] Click event
- [ ] See simple form (Name, Email, Phone)
- [ ] Fill in details
- [ ] Click "Buy Ticket - ₹200"

### Test 3: Check-In (Admin)
- [ ] Visit `/checkin`
- [ ] Login with `admin123`
- [ ] See scanner interface
- [ ] Try "Start Scanning" button

### Test 4: Admin Dashboard
- [ ] Visit `/admin`
- [ ] Login with `admin123`
- [ ] See statistics dashboard
- [ ] View event data

---

## 🎯 Your Database Info

**Connection String:** 
```
postgresql://neondb_owner:npg_1cQVHWNIrw3x@ep-still-resonance-a1rz60im-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

**JWT Secret:**
```
Jz+xQuXn0Sbvynzf1myV5ulWG/kgek/uvEq5pCzmdLI=
```

**Admin Password:**
```
admin123
```

---

## 📁 Files to Copy for Deployment

**For Vercel Environment Variables:**
- Copy DATABASE_URL from above
- Copy JWT_SECRET from above
- Copy ADMIN_PASS from above

**For Neon SQL Editor:**
- Copy entire `schema.sql` file from your project

---

## ⏱️ Estimated Time

- GitHub setup: 2 minutes
- Push code: 30 seconds
- Vercel import: 3 minutes
- Add env variables: 2 minutes
- Database setup: 2 minutes
- **Total: ~10 minutes**

---

## 🎉 What You'll Have

After deployment:
- ✅ Live URL on Vercel
- ✅ Automatic HTTPS
- ✅ Event listing page
- ✅ Booking system
- ✅ QR code generation
- ✅ Check-in scanner
- ✅ Admin dashboard
- ✅ Database connected
- ✅ Auto-deploys on git push

---

## 📞 Need Help?

**Stuck on GitHub?** 
- Make sure repo is PUBLIC
- Copy the HTTPS URL (not SSH)

**Vercel not deploying?**
- Check all environment variables are added
- Make sure they're enabled for Production, Preview, Development

**Database not working?**
- Verify connection string has no extra spaces
- Make sure you ran schema.sql in Neon
- Check DATABASE_URL in Vercel matches exactly

---

## 🚀 Ready to Deploy?

**Start here:** Open `DEPLOY_QUICK.md` for step-by-step commands!

Everything is configured and ready to go! 🎯
