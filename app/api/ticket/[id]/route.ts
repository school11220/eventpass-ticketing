import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;

    // Get ticket details with order and event info
    const result = await sql`
      SELECT 
        t.id,
        t.qr_token,
        t.checked_in,
        t.checked_in_at,
        e.name as event_name,
        e.date as event_date,
        e.venue,
        o.name as attendee_name,
        o.email as attendee_email
      FROM tickets t
      JOIN orders o ON t.order_id = o.id
      JOIN events e ON t.event_id = e.id
      WHERE t.id = ${ticketId}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    const ticket = result.rows[0];

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        qrToken: ticket.qr_token,
        eventName: ticket.event_name,
        eventDate: ticket.event_date,
        venue: ticket.venue,
        attendeeName: ticket.attendee_name,
        attendeeEmail: ticket.attendee_email,
        checkedIn: ticket.checked_in,
        checkedInAt: ticket.checked_in_at,
      },
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}
