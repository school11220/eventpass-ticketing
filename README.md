# 🎫 EventPass - Modern Event Ticketing System

A full-stack Next.js 14 web application for secure event ticketing and check-in with QR codes, built with TypeScript, Tailwind CSS, and deployed on Vercel's free tier.

![EventPass](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel)

## ✨ Features

- 🎟️ **Event Listing** - Browse all available events with beautiful UI
- 💳 **Secure Payments** - Razorpay integration for seamless checkout
- 📱 **QR Code Tickets** - JWT-signed QR codes with 7-day expiry
- 📧 **Email Delivery** - Automatic ticket delivery via email
- 📸 **QR Scanner** - Real-time camera-based check-in system
- 👨‍💼 **Admin Dashboard** - Monitor sales, check-ins, and revenue
- 🔒 **Security** - CSRF protection, secure headers, JWT signing
- 🎨 **Modern UI** - Responsive design with Tailwind CSS
- ⚡ **Serverless** - Built for Vercel's free tier

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon PostgreSQL (Serverless)
- **Payments**: Razorpay
- **Authentication**: JWT (jsonwebtoken)
- **QR Codes**: qrcode library
- **QR Scanner**: @zxing/browser
- **Email**: Nodemailer / Resend API
- **Deployment**: Vercel

## 📁 Project Structure

```
eventpass/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   └── stats/route.ts
│   │   ├── events/[id]/route.ts
│   │   ├── create-order/route.ts
│   │   ├── verify-payment/route.ts
│   │   ├── generate-qr/route.ts
│   │   ├── check-ticket/route.ts
│   │   └── send-email/route.ts
│   ├── event/[id]/page.tsx
│   ├── checkin/page.tsx
│   ├── admin/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── EventCard.tsx
├── lib/
│   └── db.ts
├── public/
├── schema.sql
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.example
├── vercel.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Neon.tech account (free PostgreSQL)
- A Razorpay account (test mode is free)
- Git installed

### Step 1: Clone and Install

```bash
# Navigate to your project directory
cd check-in

# Install dependencies
npm install
```

### Step 2: Set Up Database

1. **Create a Neon Database**:
   - Go to [Neon.tech](https://neon.tech)
   - Sign up and create a new project
   - Copy your connection string

2. **Run the Schema**:
   - Open Neon's SQL Editor
   - Copy the contents of `schema.sql`
   - Execute the SQL to create tables and seed data

### Step 3: Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local with your values
```

Fill in the following in `.env.local`:

```env
# Database
DATABASE_URL=your_neon_connection_string

# Razorpay (Get from https://dashboard.razorpay.com/app/keys)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx

# JWT Secret (Generate with: openssl rand -base64 32)
JWT_SECRET=your_random_secret_here

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Admin Password
ADMIN_PASS=your_admin_password

# Email (Optional - for ticket delivery)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Step 4: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 🌐 Deployment to Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts and set environment variables
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Add environment variables:
   - Go to Settings → Environment Variables
   - Add all variables from `.env.example`
6. Deploy!

### Important: Update Environment Variables for Production

After deployment, update:
```env
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

## 📋 Configuration Guide

### Razorpay Setup

1. Sign up at [Razorpay](https://razorpay.com)
2. Go to Settings → API Keys
3. Generate Test Mode keys
4. Copy `Key ID` and `Key Secret`
5. Add to `.env.local`

### Email Setup (Optional)

**Option 1: Gmail**
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Generate an App Password
4. Use in `EMAIL_PASS`

**Option 2: Resend**
1. Sign up at [Resend](https://resend.com)
2. Get API key
3. Add to `RESEND_API_KEY`

### Database Setup

1. Create Neon project at [Neon.tech](https://neon.tech)
2. Copy connection string
3. Run `schema.sql` in SQL Editor
4. Tables will be created with sample events

## 🔐 Security Features

- ✅ JWT-signed QR codes with expiration
- ✅ Razorpay signature verification
- ✅ CSRF protection via middleware
- ✅ Security headers (XSS, MIME sniffing, etc.)
- ✅ Admin password protection
- ✅ Server-side API route validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ HTTPS enforced on Vercel

## 📱 Usage Guide

### For Event Organizers

1. **Browse Events**: Visit homepage to see all events
2. **Buy Tickets**: Click on an event → Fill form → Pay via Razorpay
3. **Receive Ticket**: Get QR code via email automatically
4. **Check-In**: Go to `/checkin` → Scan QR codes

### For Admins

1. Visit `/admin`
2. Enter admin password (from `ADMIN_PASS`)
3. View:
   - Total orders and revenue
   - Event-wise sales statistics
   - Check-in counts

### API Endpoints

- `POST /api/create-order` - Create Razorpay order
- `POST /api/verify-payment` - Verify payment signature
- `GET /api/check-ticket?token=xxx` - Check-in ticket
- `POST /api/send-email` - Send ticket email
- `GET /api/admin/stats` - Get admin statistics

## 🧪 Testing

### Test Payment Flow

1. Use Razorpay test mode credentials
2. Test card: `4111 1111 1111 1111`
3. Any future expiry, any CVV
4. Payment will succeed in test mode

### Test Check-In

1. Complete a test payment
2. Save the QR code from email
3. Go to `/checkin`
4. Scan the QR code
5. Should show success message

## 🛠️ Troubleshooting

### Database Connection Issues

```bash
# Test connection
node -e "const {sql} = require('@vercel/postgres'); sql\`SELECT NOW()\`.then(console.log)"
```

### Payment Not Working

- Verify Razorpay keys are correct
- Check browser console for errors
- Ensure Razorpay script is loaded

### QR Scanner Not Working

- Grant camera permissions
- Use HTTPS (required for camera access)
- Try different browser (Chrome/Firefox recommended)

### Email Not Sending

- Check email credentials
- Verify Gmail app password
- Email is optional - payment will still work

## 📊 Database Schema

```sql
-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY,
  name TEXT,
  description TEXT,
  date TIMESTAMP,
  venue TEXT,
  price INTEGER,
  image_url TEXT
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  email TEXT,
  name TEXT,
  amount INTEGER,
  payment_status TEXT,
  razorpay_order_id TEXT
);

-- Tickets
CREATE TABLE tickets (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  event_id UUID REFERENCES events(id),
  qr_token TEXT UNIQUE,
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMP
);
```

## 🤝 Contributing

This is a starter template. Feel free to:

- Add more features (multi-ticket orders, refunds, etc.)
- Improve UI/UX
- Add tests
- Enhance security
- Optimize performance

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙋 Support

For issues or questions:

- Check the troubleshooting section
- Review environment variables
- Check Vercel deployment logs
- Verify database connection

## 🎉 Credits

- **Framework**: Next.js by Vercel
- **Payments**: Razorpay
- **Database**: Neon.tech
- **Styling**: Tailwind CSS
- **QR Codes**: qrcode & @zxing/browser

---

**Built with ❤️ using Next.js 14 & Razorpay**

**Ready to deploy on Vercel's free tier! 🚀**
