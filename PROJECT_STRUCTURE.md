# 📐 Project Structure Overview

Complete overview of the EventPass application architecture.

```
eventpass/
│
├── 📱 app/                          # Next.js App Router
│   ├── api/                         # Backend API Routes
│   │   ├── admin/
│   │   │   └── stats/
│   │   │       └── route.ts         # Admin statistics endpoint
│   │   ├── events/
│   │   │   └── [id]/
│   │   │       └── route.ts         # Get single event details
│   │   ├── create-order/
│   │   │   └── route.ts             # Create Razorpay order
│   │   ├── verify-payment/
│   │   │   └── route.ts             # Verify payment & generate ticket
│   │   ├── generate-qr/
│   │   │   └── route.ts             # Generate QR code image
│   │   ├── check-ticket/
│   │   │   └── route.ts             # Check-in ticket validation
│   │   └── send-email/
│   │       └── route.ts             # Send ticket via email
│   │
│   ├── event/
│   │   └── [id]/
│   │       └── page.tsx             # Event detail & payment page
│   ├── ticket/
│   │   └── [id]/
│   │       └── page.tsx             # Ticket success page with QR
│   ├── checkin/
│   │   └── page.tsx                 # QR scanner check-in page
│   ├── admin/
│   │   └── page.tsx                 # Admin dashboard
│   ├── layout.tsx                   # Root layout wrapper
│   ├── page.tsx                     # Homepage (event listing)
│   └── globals.css                  # Global styles
│
├── 🧩 components/                   # Reusable Components
│   ├── Navbar.tsx                   # Navigation bar
│   ├── Footer.tsx                   # Footer with links
│   └── EventCard.tsx                # Event card component
│
├── 📚 lib/                          # Utility Libraries
│   └── db.ts                        # Database helper functions
│
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies & scripts
│   ├── tsconfig.json                # TypeScript configuration
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.ts           # Tailwind CSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   ├── middleware.ts                # Next.js middleware (security headers)
│   ├── vercel.json                  # Vercel deployment config
│   └── .gitignore                   # Git ignore rules
│
├── 📖 Documentation
│   ├── README.md                    # Main documentation
│   ├── DEPLOYMENT_GUIDE.md          # Step-by-step deployment
│   ├── TROUBLESHOOTING.md           # Common issues & solutions
│   ├── PROJECT_STRUCTURE.md         # This file
│   └── .env.example                 # Environment variables template
│
└── 🗄️ Database
    └── schema.sql                   # PostgreSQL schema & seed data
```

---

## 📦 Key Directories Explained

### `/app` - Application Code

The main application directory using Next.js 14 App Router:

- **Frontend Pages**: `page.tsx` files define routes
- **API Routes**: `route.ts` files in `/api` folder create backend endpoints
- **Dynamic Routes**: `[id]` folders create parameterized routes

### `/components` - UI Components

Reusable React components:

- **Navbar**: Site navigation
- **Footer**: Footer with branding
- **EventCard**: Event display cards

### `/lib` - Utilities

Helper functions and utilities:

- **db.ts**: Database query functions using @vercel/postgres

---

## 🔄 Data Flow

### 1. Event Browsing Flow

```
User → Homepage (page.tsx)
         ↓ Fetch from DB
      getEvents() in db.ts
         ↓ SQL Query
      Neon PostgreSQL
         ↓ Return events
      Display EventCards
```

### 2. Payment Flow

```
User → Event Detail (/event/[id]/page.tsx)
         ↓ Click "Proceed to Payment"
      Fill form (name, email, phone)
         ↓ Submit
      /api/create-order
         ↓ Create Razorpay order
      Razorpay Checkout Popup
         ↓ User pays
      Payment Success Handler
         ↓
      /api/verify-payment
         ↓ Verify signature
         ↓ Generate JWT token
         ↓ Create ticket in DB
         ↓ Generate QR code
      /api/send-email
         ↓ Send ticket email
      Redirect to /ticket/[id]
         ↓
      Display QR Code Ticket
```

### 3. Check-In Flow

```
Scanner → /checkin page
            ↓ Camera access
         Scan QR Code
            ↓ Extract JWT token
         /api/check-ticket?token=xxx
            ↓ Verify JWT
            ↓ Check DB status
            ↓ Mark as checked in
         Return success/failure
            ↓
         Display result
```

### 4. Admin Flow

```
Admin → /admin page
          ↓ Enter password
       Authenticate (Bearer token)
          ↓
       /api/admin/stats
          ↓ Query DB
       Return statistics
          ↓
       Display dashboard
```

---

## 🗂️ Database Schema

### Tables

```sql
┌─────────┐         ┌─────────┐         ┌─────────┐
│ events  │────┬───→│ orders  │────┬───→│ tickets │
└─────────┘    │    └─────────┘    │    └─────────┘
               │                   │
            event_id            order_id
```

### Relationships

- **events → orders**: One-to-Many (one event, many orders)
- **orders → tickets**: One-to-Many (one order, many tickets)
- **events → tickets**: One-to-Many (one event, many tickets)

---

## 🛣️ Route Structure

### Frontend Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Homepage with event listing |
| `/event/[id]` | `app/event/[id]/page.tsx` | Event detail & booking |
| `/ticket/[id]` | `app/ticket/[id]/page.tsx` | Ticket display with QR |
| `/checkin` | `app/checkin/page.tsx` | QR scanner check-in |
| `/admin` | `app/admin/page.tsx` | Admin dashboard |

### API Routes

| Endpoint | Method | File | Purpose |
|----------|--------|------|---------|
| `/api/events/[id]` | GET | `app/api/events/[id]/route.ts` | Get event by ID |
| `/api/create-order` | POST | `app/api/create-order/route.ts` | Create Razorpay order |
| `/api/verify-payment` | POST | `app/api/verify-payment/route.ts` | Verify payment & create ticket |
| `/api/generate-qr` | POST | `app/api/generate-qr/route.ts` | Generate QR code image |
| `/api/check-ticket` | GET | `app/api/check-ticket/route.ts` | Validate & check-in ticket |
| `/api/send-email` | POST | `app/api/send-email/route.ts` | Send ticket via email |
| `/api/admin/stats` | GET | `app/api/admin/stats/route.ts` | Get admin statistics |

---

## 🔒 Security Architecture

### Environment Variables

```
Client Side (Browser)
  ↓ Can access
NEXT_PUBLIC_* variables
  - NEXT_PUBLIC_RAZORPAY_KEY_ID
  - NEXT_PUBLIC_BASE_URL

Server Side (API Routes)
  ↓ Can access
ALL variables
  - DATABASE_URL
  - RAZORPAY_KEY_SECRET
  - JWT_SECRET
  - ADMIN_PASS
```

### Middleware

`middleware.ts` adds security headers to all routes:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security
- Referrer-Policy

### Authentication

- **Admin Routes**: Bearer token (ADMIN_PASS)
- **Tickets**: JWT with HMAC SHA256
- **Payments**: Razorpay signature verification

---

## 📦 Dependencies

### Production Dependencies

```json
{
  "@vercel/postgres": "Database client",
  "@zxing/browser": "QR code scanner",
  "jsonwebtoken": "JWT signing/verification",
  "next": "Framework",
  "nodemailer": "Email sending",
  "qrcode": "QR code generation",
  "razorpay": "Payment processing",
  "react": "UI library"
}
```

### Development Dependencies

```json
{
  "@types/*": "TypeScript definitions",
  "autoprefixer": "CSS vendor prefixes",
  "postcss": "CSS processing",
  "tailwindcss": "CSS framework",
  "typescript": "Type safety"
}
```

---

## 🚀 Build Process

### Development

```bash
npm run dev
  ↓
Next.js Dev Server
  ↓ Hot Module Replacement
Fast Refresh
```

### Production

```bash
npm run build
  ↓
TypeScript Compilation
  ↓
Next.js Build
  ↓ Static Generation
  ↓ API Routes → Serverless Functions
  ↓
.next/ folder
  ↓
npm start (or Vercel deployment)
```

---

## 🌐 Deployment Architecture

```
User Browser
     ↓
Vercel Edge Network (CDN)
     ↓
Next.js Pages (Static)
     ↓
Vercel Serverless Functions (API Routes)
     ↓
┌─────────────────┬─────────────────┐
│                 │                 │
Neon PostgreSQL   Razorpay API     Email Service
```

---

## 📊 State Management

This application uses:
- **React useState**: Component state
- **Server Components**: Database queries
- **Client Components**: Interactive features

No external state management (Redux, Zustand) needed.

---

## 🎨 Styling Architecture

```
Tailwind CSS (Utility-first)
     ↓
tailwind.config.ts (Configuration)
     ↓
globals.css (Custom styles)
     ↓
Component Classes
```

Custom theme colors:
- Primary: Blue shades (#0ea5e9)
- Success: Green
- Error: Red
- Warning: Yellow

---

## 🔧 Configuration Files

### next.config.js
- Security headers
- Environment variable exposure
- Build configuration

### tsconfig.json
- TypeScript strict mode
- Path aliases (@/*)
- Module resolution

### tailwind.config.ts
- Custom colors
- Content paths
- Theme extensions

### vercel.json
- Route rewrites
- Header configuration
- Deployment settings

---

This structure follows Next.js 14 best practices and is optimized for Vercel deployment.
