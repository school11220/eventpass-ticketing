# ⚡ Quick Reference Guide

Fast reference for common tasks and commands.

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate JWT secret
openssl rand -base64 32
```

---

## 🔑 Environment Variables Quick Copy

```env
# Required for basic functionality
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
JWT_SECRET=your_32_char_random_string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADMIN_PASS=your_secure_password

# Optional for emails
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## 📋 Important URLs

### Development
- Homepage: http://localhost:3000
- Admin: http://localhost:3000/admin
- Check-in: http://localhost:3000/checkin

### External Services
- Neon Dashboard: https://console.neon.tech
- Razorpay Dashboard: https://dashboard.razorpay.com
- Vercel Dashboard: https://vercel.com/dashboard

---

## 🧪 Razorpay Test Credentials

```
Card Number: 4111 1111 1111 1111
Expiry: Any future date (e.g., 12/25)
CVV: Any 3 digits (e.g., 123)
Name: Any name
```

---

## 🗄️ Database Quick Queries

```sql
-- View all events
SELECT * FROM events;

-- View recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;

-- View recent tickets
SELECT * FROM tickets ORDER BY created_at DESC LIMIT 10;

-- Check-in statistics
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN checked_in THEN 1 ELSE 0 END) as checked_in
FROM tickets;

-- Revenue by event
SELECT 
  e.name,
  COUNT(o.id) as sales,
  SUM(o.amount) as revenue
FROM events e
LEFT JOIN orders o ON e.id = o.event_id
WHERE o.payment_status = 'success'
GROUP BY e.name;
```

---

## 📁 File Locations

### Configuration
```
/.env.local          - Environment variables
/next.config.js      - Next.js config
/tailwind.config.ts  - Tailwind config
/vercel.json         - Vercel config
```

### Pages
```
/app/page.tsx                - Homepage
/app/event/[id]/page.tsx     - Event detail
/app/checkin/page.tsx        - Check-in scanner
/app/admin/page.tsx          - Admin dashboard
/app/ticket/[id]/page.tsx    - Ticket display
```

### API Routes
```
/app/api/create-order/route.ts      - Create order
/app/api/verify-payment/route.ts    - Verify payment
/app/api/check-ticket/route.ts      - Check-in ticket
/app/api/send-email/route.ts        - Send email
/app/api/admin/stats/route.ts       - Admin stats
```

### Components
```
/components/Navbar.tsx     - Navigation
/components/Footer.tsx     - Footer
/components/EventCard.tsx  - Event card
```

---

## 🐛 Common Issues & Quick Fixes

### Issue: npm install fails
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Database connection error
```bash
# Check DATABASE_URL format
echo $DATABASE_URL
# Should include: ?sslmode=require
```

### Issue: Razorpay not loading
```bash
# Restart dev server after env changes
npm run dev
# Check browser console for errors
```

### Issue: Build fails on Vercel
```bash
# Test build locally first
npm run build
# Fix any TypeScript errors
```

---

## 🔒 Security Checklist

- [ ] Never commit `.env.local` to git
- [ ] Use strong `ADMIN_PASS` in production
- [ ] Keep `RAZORPAY_KEY_SECRET` secret
- [ ] Generate random `JWT_SECRET` (32+ chars)
- [ ] Use HTTPS in production (Vercel provides)
- [ ] Don't expose sensitive data in client components

---

## 📊 API Testing Commands

```bash
# Test event listing
curl http://localhost:3000/api/events/test-id

# Test admin stats (should return 401)
curl http://localhost:3000/api/admin/stats

# Test admin stats with auth
curl -H "Authorization: Bearer your_password" \
  http://localhost:3000/api/admin/stats
```

---

## 🎨 Tailwind Color Reference

```tsx
// Primary colors (blue)
className="bg-primary-500"    // #0ea5e9
className="text-primary-600"  // #0284c7
className="border-primary-700" // #0369a1

// Grays
className="bg-gray-50"   // Lightest
className="bg-gray-900"  // Darkest

// Status colors
className="bg-green-500"  // Success
className="bg-red-500"    // Error
className="bg-yellow-500" // Warning
```

---

## 📱 Responsive Breakpoints

```tsx
// Mobile first approach
<div className="
  text-sm          // Mobile (default)
  md:text-base     // Tablet (768px+)
  lg:text-lg       // Desktop (1024px+)
">
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## 🔄 Git Workflow

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo, then:
git remote add origin https://github.com/USERNAME/eventpass.git
git push -u origin main

# Regular updates
git add .
git commit -m "Description of changes"
git push
```

---

## 🚀 Deployment Checklist

### Before Deployment
- [ ] Test locally with `npm run build`
- [ ] Push code to GitHub
- [ ] Create Neon database
- [ ] Run `schema.sql` in Neon
- [ ] Get Razorpay test keys

### On Vercel
- [ ] Import GitHub repository
- [ ] Add all environment variables
- [ ] Deploy
- [ ] Test payment flow
- [ ] Test check-in scanner
- [ ] Test admin dashboard

### After Deployment
- [ ] Update `NEXT_PUBLIC_BASE_URL` to production URL
- [ ] Redeploy
- [ ] Test all features again
- [ ] Configure custom domain (optional)

---

## 📞 Support Resources

| Resource | Link |
|----------|------|
| Next.js Docs | https://nextjs.org/docs |
| Razorpay Docs | https://razorpay.com/docs |
| Neon Docs | https://neon.tech/docs |
| Vercel Docs | https://vercel.com/docs |
| Tailwind Docs | https://tailwindcss.com/docs |

---

## 🎯 Feature Flags

Quick enable/disable features:

```typescript
// In app/page.tsx or components
const FEATURES = {
  EMAIL_ENABLED: !!process.env.EMAIL_USER,
  ADMIN_ENABLED: true,
  CHECKIN_ENABLED: true,
  TEST_MODE: process.env.RAZORPAY_KEY_ID?.includes('test'),
};
```

---

## 📈 Performance Tips

```bash
# Optimize images (if adding custom images)
npm install sharp

# Analyze bundle size
npm run build
# Check .next/analyze output

# Enable caching in Vercel
# (automatic for static assets)
```

---

## 🔐 Password Generation

```bash
# Generate secure passwords
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Online (use with caution)
# https://passwordsgenerator.net
```

---

## 📦 Package Updates

```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

---

## 🎉 Success Indicators

### Local Development Works When:
✅ `npm run dev` starts without errors
✅ Homepage shows events from database
✅ Event detail page loads
✅ Test payment completes successfully
✅ QR code displays on ticket page
✅ Check-in scanner opens camera
✅ Admin page loads with password

### Production Works When:
✅ Vercel build succeeds
✅ Homepage accessible via Vercel URL
✅ Payment flow works end-to-end
✅ Email delivery successful
✅ QR scanner works on mobile
✅ Admin dashboard accessible

---

**Keep this guide handy for quick reference! 📌**
