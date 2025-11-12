import { sql } from '@vercel/postgres';

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL is not set. Database operations will fail.');
  console.warn('📝 Please set up your environment variables in .env.local');
  console.warn('📖 See GETTING_STARTED.md for setup instructions');
}

export const db = {
  query: async (text: string, params?: any[]) => {
    try {
      const result = await sql.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },
};

export async function getEvents() {
  try {
    const result = await sql`
      SELECT * FROM events 
      ORDER BY date ASC
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return empty array if database is not configured
    return [];
  }
}

export async function getEventById(id: string) {
  try {
    const result = await sql`
      SELECT * FROM events 
      WHERE id = ${id}
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export async function createOrder(data: {
  eventId: string;
  email: string;
  name: string;
  phone: string;
  amount: number;
  razorpayOrderId: string;
}) {
  const result = await sql`
    INSERT INTO orders (event_id, email, name, phone, amount, razorpay_order_id)
    VALUES (${data.eventId}, ${data.email}, ${data.name}, ${data.phone}, ${data.amount}, ${data.razorpayOrderId})
    RETURNING *
  `;
  return result.rows[0];
}

export async function updateOrderPayment(orderId: string, paymentData: {
  paymentId: string;
  signature: string;
  status: string;
}) {
  const result = await sql`
    UPDATE orders 
    SET 
      razorpay_payment_id = ${paymentData.paymentId},
      razorpay_signature = ${paymentData.signature},
      payment_status = ${paymentData.status},
      updated_at = NOW()
    WHERE razorpay_order_id = ${orderId}
    RETURNING *
  `;
  return result.rows[0];
}

export async function createTicket(data: {
  orderId: string;
  eventId: string;
  qrToken: string;
}) {
  const result = await sql`
    INSERT INTO tickets (order_id, event_id, qr_token)
    VALUES (${data.orderId}, ${data.eventId}, ${data.qrToken})
    RETURNING *
  `;
  return result.rows[0];
}

export async function getTicketByToken(token: string) {
  const result = await sql`
    SELECT t.*, o.email, o.name, e.name as event_name, e.date as event_date, e.venue
    FROM tickets t
    JOIN orders o ON t.order_id = o.id
    JOIN events e ON t.event_id = e.id
    WHERE t.qr_token = ${token}
  `;
  return result.rows[0];
}

export async function checkInTicket(ticketId: string, checkedInBy: string) {
  const result = await sql`
    UPDATE tickets 
    SET 
      checked_in = true,
      checked_in_at = NOW(),
      checked_in_by = ${checkedInBy}
    WHERE id = ${ticketId} AND checked_in = false
    RETURNING *
  `;
  return result.rows[0];
}

export async function getOrderStats() {
  const result = await sql`
    SELECT 
      COUNT(*) as total_orders,
      SUM(CASE WHEN payment_status = 'success' THEN 1 ELSE 0 END) as successful_orders,
      SUM(CASE WHEN payment_status = 'success' THEN amount ELSE 0 END) as total_revenue
    FROM orders
  `;
  return result.rows[0];
}

export async function getEventStats() {
  const result = await sql`
    SELECT 
      e.id,
      e.name,
      e.date,
      e.venue,
      COUNT(DISTINCT o.id) as total_sales,
      COUNT(DISTINCT t.id) as total_tickets,
      SUM(CASE WHEN t.checked_in = true THEN 1 ELSE 0 END) as checked_in_count,
      SUM(CASE WHEN o.payment_status = 'success' THEN o.amount ELSE 0 END) as revenue
    FROM events e
    LEFT JOIN orders o ON e.id = o.event_id AND o.payment_status = 'success'
    LEFT JOIN tickets t ON e.id = t.event_id
    GROUP BY e.id, e.name, e.date, e.venue
    ORDER BY e.date DESC
  `;
  return result.rows;
}
