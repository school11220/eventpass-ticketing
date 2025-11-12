# 🔧 Troubleshooting Guide

Common issues and their solutions when running EventPass.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Database Issues](#database-issues)
- [Payment Issues](#payment-issues)
- [QR Scanner Issues](#qr-scanner-issues)
- [Email Issues](#email-issues)
- [Deployment Issues](#deployment-issues)

---

## Installation Issues

### npm install fails

**Problem**: Package installation errors

**Solutions**:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Or use specific Node version
nvm use 18
npm install
```

### TypeScript errors after install

**Problem**: Type definition conflicts

**Solution**:
```bash
# Delete TypeScript cache
rm -rf .next
npm run dev
```

---

## Database Issues

### "Connection refused" or "Cannot connect to database"

**Problem**: Database connection string is incorrect

**Check**:
1. Verify `DATABASE_URL` in `.env.local`
2. Ensure the connection string includes `?sslmode=require`
3. Check if Neon project is active (not paused)

**Solution**:
```env
# Correct format:
DATABASE_URL=postgresql://user:pass@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

### "relation does not exist" errors

**Problem**: Database tables not created

**Solution**:
1. Go to Neon SQL Editor
2. Run the `schema.sql` file completely
3. Verify tables exist:
   ```sql
   SELECT * FROM events;
   ```

### No events showing on homepage

**Problem**: Database is empty

**Solution**:
```sql
-- Check if events exist
SELECT COUNT(*) FROM events;

-- If zero, re-run the INSERT statements from schema.sql
INSERT INTO events (name, description, date, venue, price, image_url) VALUES ...
```

---

## Payment Issues

### Razorpay popup doesn't open

**Problem**: Razorpay script not loaded or keys incorrect

**Check**:
1. Browser console for errors
2. Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set
3. Ensure key starts with `rzp_test_` or `rzp_live_`

**Solution**:
```bash
# Check if env var is available
console.log(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)

# Restart dev server after changing .env.local
npm run dev
```

### "Invalid signature" error

**Problem**: Razorpay signature verification failed

**Solutions**:
1. Verify `RAZORPAY_KEY_SECRET` matches your Key ID
2. Check if you're mixing test and live keys
3. Ensure secret is not exposed to client

**Correct setup**:
```env
# These should match (both test OR both live)
RAZORPAY_KEY_ID=rzp_test_abc123
RAZORPAY_KEY_SECRET=secret_for_abc123
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_abc123
```

### Payment succeeds but no ticket generated

**Problem**: Webhook verification or database insert failed

**Check**:
1. Browser console for API errors
2. Vercel logs (in deployment dashboard)
3. Database logs in Neon

**Debug**:
```bash
# Check if order was created
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;

# Check if ticket was created
SELECT * FROM tickets ORDER BY created_at DESC LIMIT 5;
```

---

## QR Scanner Issues

### Camera doesn't start

**Problem**: Camera permissions denied or HTTPS required

**Solutions**:

1. **Grant Camera Permissions**:
   - Chrome: Click lock icon in address bar → Permissions → Camera → Allow
   - Firefox: Click shield icon → Permissions → Camera → Allow
   - Safari: Settings → Websites → Camera → Allow

2. **Use HTTPS**:
   - Camera APIs require HTTPS
   - `localhost` works, but LAN IP doesn't
   - Deploy to Vercel (has HTTPS by default)

3. **Check Browser Compatibility**:
   - Chrome 87+
   - Firefox 90+
   - Safari 14+

### QR code not detected

**Problem**: Camera not focusing or QR code is damaged

**Solutions**:
1. Increase screen brightness
2. Hold QR code 6-12 inches from camera
3. Ensure good lighting
4. Try printing the QR code
5. Use the manual token entry instead

### "Invalid or expired ticket" error

**Problem**: JWT token expired or incorrect

**Check**:
1. Ticket age (7-day expiry)
2. `JWT_SECRET` matches between creation and verification
3. Token is complete (not truncated)

**Debug**:
```javascript
// Decode JWT without verification to check content
const jwt = require('jsonwebtoken');
const token = 'your_token_here';
const decoded = jwt.decode(token);
console.log(decoded);
```

---

## Email Issues

### Emails not sending

**Problem**: Email credentials incorrect or not configured

**Solutions**:

**Using Gmail**:
1. Enable 2FA on your Google account
2. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other"
   - Copy the 16-character password
3. Add to `.env.local`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=abcd efgh ijkl mnop
   ```

**Using Resend**:
1. Sign up at https://resend.com
2. Verify your domain (or use resend.dev for testing)
3. Get API key from dashboard
4. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxx
   ```

### Email is marked as spam

**Problem**: Sender reputation or SPF/DKIM not configured

**Solutions**:
1. Use a verified domain with Resend
2. Configure SPF and DKIM records
3. Avoid spam trigger words in subject
4. Test with different email providers

**Note**: Email is optional. Payment will succeed even if email fails.

---

## Deployment Issues

### Build fails on Vercel

**Problem**: Build errors or missing dependencies

**Check Vercel Logs**:
1. Go to Vercel dashboard
2. Click on failed deployment
3. View build logs

**Common Causes**:

1. **Missing Environment Variables**:
   - Add all required env vars in Vercel settings
   - Include `NEXT_PUBLIC_*` variables

2. **TypeScript Errors**:
   ```bash
   # Test build locally first
   npm run build
   ```

3. **Import Errors**:
   - Check file paths are correct
   - Ensure all files are committed to git

### Site deployed but shows 500 error

**Problem**: Runtime error on the server

**Check**:
1. Vercel Function Logs (in dashboard)
2. Database connection (most common cause)
3. Environment variables are set correctly

**Solution**:
```bash
# Test database connection
curl https://your-app.vercel.app/api/events/test-id
# Should return 404 or event data, not 500
```

### Database queries fail in production

**Problem**: Connection string or SSL configuration

**Check**:
```env
# Ensure SSL mode is specified
DATABASE_URL=postgresql://...?sslmode=require
```

**Solution**:
1. Copy connection string directly from Neon
2. Don't modify it
3. Ensure no extra spaces or line breaks

### Environment variables not updating

**Problem**: Old deployment cached

**Solution**:
1. Update env vars in Vercel settings
2. Go to Deployments tab
3. Click "..." → "Redeploy"
4. Check "Use existing Build Cache" is UNCHECKED

---

## General Debugging

### Check Environment Variables

```bash
# In development
npm run dev
# Then visit: http://localhost:3000/api/debug

# Create this file: app/api/debug/route.ts
export async function GET() {
  return Response.json({
    hasDatabase: !!process.env.DATABASE_URL,
    hasRazorpay: !!process.env.RAZORPAY_KEY_ID,
    hasJWT: !!process.env.JWT_SECRET,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  });
}
```

### Clear Next.js Cache

```bash
# Delete build cache
rm -rf .next

# Delete node modules (if needed)
rm -rf node_modules
npm install

# Restart
npm run dev
```

### Test API Endpoints

```bash
# Test database connection
curl http://localhost:3000/api/events/test

# Test payment creation (should fail without body, but shows it's working)
curl -X POST http://localhost:3000/api/create-order

# Test admin stats (should return 401)
curl http://localhost:3000/api/admin/stats
```

### Check Browser Console

Press `F12` or `Cmd+Option+I` to open DevTools:
- **Console tab**: JavaScript errors
- **Network tab**: API requests/responses
- **Application tab**: Check local storage, cookies

### Check Logs

**Local Development**:
- Terminal where `npm run dev` is running
- Shows server-side errors

**Vercel Production**:
1. Go to Vercel Dashboard
2. Click on your project
3. Click "Logs" tab
4. Filter by error level

---

## Still Having Issues?

### Before Asking for Help

Provide:
1. Exact error message (screenshot or text)
2. What you were doing when error occurred
3. Browser and version
4. Node.js version (`node --version`)
5. Relevant logs (Vercel or terminal)

### Quick Fixes to Try

```bash
# Nuclear option: Start fresh
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

### Verify Setup Checklist

- [ ] Node.js 18+ installed
- [ ] `.env.local` exists and has all required vars
- [ ] Database connection string is correct
- [ ] Razorpay keys are for same mode (test/live)
- [ ] SQL schema has been executed
- [ ] Sample events exist in database
- [ ] `npm install` completed successfully
- [ ] `npm run dev` starts without errors

---

**Most issues are due to:**
1. Missing or incorrect environment variables (60%)
2. Database not set up properly (25%)
3. Razorpay key mismatch (10%)
4. Other (5%)

**Always check environment variables first!**
