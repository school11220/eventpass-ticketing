# ✅ Setup Checklist

Use this checklist to track your progress setting up EventPass.

---

## 📋 Phase 1: Prerequisites (5 minutes)

### Software Installation
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Code editor ready (VS Code recommended)

### Account Creation
- [ ] GitHub account created
- [ ] Vercel account created (link with GitHub)
- [ ] Neon.tech account created
- [ ] Razorpay account created

---

## 📦 Phase 2: Project Setup (10 minutes)

### Installation
- [ ] Navigated to project directory (`cd /home/shivam/check-in`)
- [ ] Ran `npm install` successfully
- [ ] No error messages during install
- [ ] `node_modules` folder created

### Files Verification
- [ ] All 28 files present in project
- [ ] `.env.example` file exists
- [ ] `schema.sql` file exists
- [ ] Documentation files present

---

## 🗄️ Phase 3: Database Setup (15 minutes)

### Neon Database
- [ ] Logged into console.neon.tech
- [ ] Created new project named "eventpass-db"
- [ ] Copied connection string
- [ ] Connection string saved somewhere safe

### Database Schema
- [ ] Opened SQL Editor in Neon
- [ ] Copied contents of `schema.sql`
- [ ] Executed SQL successfully
- [ ] Verified 3 tables created:
  - [ ] events table exists
  - [ ] orders table exists
  - [ ] tickets table exists
- [ ] Verified 5 sample events loaded
- [ ] Ran query: `SELECT COUNT(*) FROM events;` (should return 5)

---

## 💳 Phase 4: Razorpay Setup (10 minutes)

### Account Setup
- [ ] Logged into dashboard.razorpay.com
- [ ] Email verified
- [ ] In "Test Mode" (not Live mode)

### API Keys
- [ ] Navigated to API Keys section
- [ ] Found Test Mode keys
- [ ] Copied Key ID (starts with `rzp_test_`)
- [ ] Revealed and copied Key Secret
- [ ] Keys saved somewhere safe

---

## ⚙️ Phase 5: Environment Configuration (10 minutes)

### File Creation
- [ ] Ran `cp .env.example .env.local`
- [ ] Opened `.env.local` in editor
- [ ] File is NOT tracked by git (in .gitignore)

### Environment Variables
- [ ] `DATABASE_URL` - Pasted Neon connection string
- [ ] `RAZORPAY_KEY_ID` - Pasted from Razorpay
- [ ] `RAZORPAY_KEY_SECRET` - Pasted from Razorpay
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Same as RAZORPAY_KEY_ID
- [ ] `JWT_SECRET` - Generated using `openssl rand -base64 32`
- [ ] `NEXT_PUBLIC_BASE_URL` - Set to `http://localhost:3000`
- [ ] `ADMIN_PASS` - Set strong password
- [ ] Saved `.env.local` file

### Verification
- [ ] All values filled (no placeholders remaining)
- [ ] No extra spaces in values
- [ ] CONNECTION_URL includes `?sslmode=require`
- [ ] JWT_SECRET is at least 32 characters

---

## 🧪 Phase 6: Local Testing (20 minutes)

### Start Server
- [ ] Ran `npm run dev`
- [ ] No error messages
- [ ] Saw "Ready in X.Xs" message
- [ ] Server running on http://localhost:3000

### Test Homepage
- [ ] Opened http://localhost:3000
- [ ] Page loaded without errors
- [ ] Saw 5 event cards
- [ ] Events show images, prices, details
- [ ] Navigation bar visible
- [ ] Footer visible

### Test Event Detail
- [ ] Clicked on an event card
- [ ] Event detail page loaded
- [ ] Saw event information
- [ ] Booking form visible
- [ ] Price displayed correctly

### Test Payment Flow
- [ ] Filled booking form:
  - [ ] Name entered
  - [ ] Email entered
  - [ ] Phone entered (optional)
- [ ] Clicked "Proceed to Payment"
- [ ] Razorpay popup opened
- [ ] Used test card: `4111 1111 1111 1111`
- [ ] Payment succeeded
- [ ] Redirected to ticket page
- [ ] QR code displayed
- [ ] Ticket details shown

### Test Check-In Scanner
- [ ] Went to http://localhost:3000/checkin
- [ ] Page loaded successfully
- [ ] Clicked "Start Scanning"
- [ ] Camera permission granted
- [ ] Camera feed visible
- [ ] Scanned QR code from ticket
- [ ] Saw success message
- [ ] Ticket details displayed

### Test Manual Entry
- [ ] On check-in page
- [ ] Tried manual token entry
- [ ] Pasted ticket token
- [ ] Clicked "Check Ticket"
- [ ] Saw validation result

### Test Duplicate Check-In
- [ ] Scanned same QR code again
- [ ] Saw "Already checked in" error
- [ ] Error message includes timestamp

### Test Admin Dashboard
- [ ] Went to http://localhost:3000/admin
- [ ] Login form appeared
- [ ] Entered ADMIN_PASS
- [ ] Successfully logged in
- [ ] Saw statistics:
  - [ ] Total orders count
  - [ ] Successful orders
  - [ ] Total revenue
  - [ ] Event list with stats
  - [ ] Check-in counts

---

## 🌐 Phase 7: Git Setup (10 minutes)

### Repository Creation
- [ ] Went to github.com/new
- [ ] Created repository named "eventpass"
- [ ] Repository created successfully

### Git Commands
- [ ] Ran `git init` (if needed)
- [ ] Ran `git add .`
- [ ] Ran `git commit -m "Initial commit"`
- [ ] Added remote: `git remote add origin ...`
- [ ] Pushed code: `git push -u origin main`
- [ ] Verified code on GitHub

---

## 🚀 Phase 8: Vercel Deployment (20 minutes)

### Project Import
- [ ] Logged into vercel.com
- [ ] Clicked "Add New" → "Project"
- [ ] Found eventpass repository
- [ ] Clicked "Import"

### Configuration
- [ ] Framework: Next.js (auto-detected)
- [ ] Root Directory: `./`
- [ ] Build Command: default
- [ ] Output Directory: `.next`

### Environment Variables
Added all variables to Vercel:
- [ ] `DATABASE_URL`
- [ ] `RAZORPAY_KEY_ID`
- [ ] `RAZORPAY_KEY_SECRET`
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- [ ] `JWT_SECRET`
- [ ] `ADMIN_PASS`

### Deployment
- [ ] Clicked "Deploy"
- [ ] Build succeeded (no errors)
- [ ] Got deployment URL
- [ ] Saved URL: _________________

### Post-Deployment
- [ ] Added `NEXT_PUBLIC_BASE_URL` with Vercel URL
- [ ] Redeployed with new env var
- [ ] Deployment successful

---

## ✅ Phase 9: Production Testing (15 minutes)

### Homepage
- [ ] Visited Vercel URL
- [ ] Homepage loaded
- [ ] Events displayed correctly

### Payment Flow
- [ ] Completed test purchase on production
- [ ] Payment succeeded
- [ ] Got ticket with QR code

### Check-In (Mobile)
- [ ] Opened `/checkin` on mobile
- [ ] Camera access granted
- [ ] Scanned QR code successfully
- [ ] Check-in recorded

### Admin Dashboard
- [ ] Accessed `/admin` on production
- [ ] Logged in successfully
- [ ] Stats displayed correctly

---

## 🎯 Phase 10: Final Verification (10 minutes)

### Functionality
- [ ] All pages load without errors
- [ ] Payment processing works
- [ ] QR codes generate correctly
- [ ] Scanner works on mobile
- [ ] Admin panel accessible
- [ ] No console errors

### Security
- [ ] `.env.local` NOT committed to git
- [ ] Environment variables secure
- [ ] HTTPS enabled on Vercel
- [ ] Admin password strong

### Documentation
- [ ] Read `README.md`
- [ ] Reviewed `GETTING_STARTED.md`
- [ ] Bookmarked `TROUBLESHOOTING.md`
- [ ] Have `QUICK_REFERENCE.md` handy

---

## 🎊 Optional: Customization (Ongoing)

### Branding
- [ ] Changed colors in `tailwind.config.ts`
- [ ] Updated site name in Navbar
- [ ] Added custom logo

### Content
- [ ] Added real events to database
- [ ] Updated event images
- [ ] Customized email template

### Production Readiness
- [ ] Completed Razorpay KYC
- [ ] Switched to live Razorpay keys
- [ ] Set up email service (Gmail/Resend)
- [ ] Added custom domain
- [ ] Set up monitoring

---

## 📊 Progress Tracker

**Total Tasks**: 150+

**Your Progress**: _____ / 150

### Completion Milestones
- [ ] 0-30: Project setup complete
- [ ] 31-60: Database & API configured
- [ ] 61-90: Local testing successful
- [ ] 91-120: Deployed to Vercel
- [ ] 121-150: Production verified

---

## 🎉 Success Indicators

You're done when:
- ✅ All phases checked off
- ✅ Site live on Vercel
- ✅ Payment flow works end-to-end
- ✅ QR scanner functional
- ✅ Admin dashboard accessible
- ✅ No critical errors

---

## 📞 Help Resources

If stuck on any step:
1. Check the specific guide for that phase
2. Review `TROUBLESHOOTING.md`
3. Check browser console for errors
4. Verify environment variables
5. Review Vercel logs

---

## ⏱️ Estimated Time

- **Prerequisites**: 5 minutes
- **Setup**: 30 minutes
- **Testing**: 35 minutes
- **Deployment**: 30 minutes
- **Verification**: 10 minutes

**Total**: ~1.5-2 hours

---

**Print this checklist and mark items as you complete them! 📝**
