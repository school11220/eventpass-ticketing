# Quick Database Setup - Fix "No events available"

## Why You Can't See Events

Your `.env.local` file has placeholder database credentials. The app needs a real PostgreSQL database to store and display events.

## 🚀 5-Minute Setup (Free)

### Step 1: Create Neon Database (3 minutes)

1. Go to **https://neon.tech**
2. Click "Sign Up" (use GitHub/Google for instant signup)
3. Create a new project:
   - Name: `eventpass` (or anything you like)
   - Region: Choose closest to you
   - Click "Create Project"

### Step 2: Get Connection String (1 minute)

1. After project is created, you'll see a connection string like:
   ```
   postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
2. **Copy this entire string**

### Step 3: Run Database Schema (1 minute)

1. In Neon dashboard, click **"SQL Editor"** (left sidebar)
2. Open the file `schema.sql` in your project
3. **Copy ALL the SQL** from that file
4. **Paste it** into the SQL Editor in Neon
5. Click **"Run"** button
6. You should see: "Comedy Night Live" event inserted ✅

### Step 4: Update Environment Variables (30 seconds)

1. Open `.env.local` file in your project
2. Replace this line:
   ```bash
   DATABASE_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require
   ```
   
   With your real connection string from Step 2:
   ```bash
   DATABASE_URL=postgresql://your-real-connection-string-here
   ```

### Step 5: Restart Server (10 seconds)

1. Stop the dev server (Ctrl+C in terminal)
2. Start again:
   ```bash
   npm run dev
   ```

3. Open **http://localhost:3000**
4. You should now see the **Comedy Night Live** event! 🎉

---

## ✅ What You'll See

After setup:
- Homepage: Comedy Night Live event card (₹200)
- Click event: Simple booking form
- After payment: QR code ticket

---

## 🔧 Alternative: Test Without Database

If you want to test the UI before setting up the database, you can temporarily use mock data:

Edit `lib/db.ts` and change the `getEvents()` function to return test data:

```typescript
export async function getEvents() {
  // Temporary mock data for testing
  return [
    {
      id: '1',
      name: 'Comedy Night Live',
      description: 'An evening of laughter with top stand-up comedians',
      date: '2025-12-20T20:00:00',
      venue: 'The Laugh Factory, Mumbai',
      price: 200,
      image_url: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800'
    }
  ];
}
```

But remember: **This is just for testing the UI**. For real functionality (booking, QR codes, check-in), you NEED the real database.

---

## Need Help?

If you get stuck:
1. Make sure you copied the ENTIRE connection string
2. Check there are no extra spaces in `.env.local`
3. Make sure you ran the SQL schema in Neon
4. Restart the dev server after changing `.env.local`
