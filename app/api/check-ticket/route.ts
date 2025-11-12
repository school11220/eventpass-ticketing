import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getTicketByToken, checkInTicket } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Missing ticket token' },
        { status: 400 }
      );
    }

    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid or expired ticket' },
        { status: 401 }
      );
    }

    // Get ticket from database
    const ticket = await getTicketByToken(token);

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Check if already checked in
    if (ticket.checked_in) {
      return NextResponse.json(
        {
          error: 'Already checked in',
          checkedInAt: ticket.checked_in_at,
        },
        { status: 409 }
      );
    }

    // Get client IP (for logging)
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Mark ticket as checked in
    const updatedTicket = await checkInTicket(ticket.id, ip);

    if (!updatedTicket) {
      return NextResponse.json(
        { error: 'Failed to check in ticket' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket checked in successfully',
      ticket: {
        id: ticket.id,
        eventName: ticket.event_name,
        eventDate: ticket.event_date,
        venue: ticket.venue,
        attendeeName: ticket.name,
        attendeeEmail: ticket.email,
        checkedInAt: updatedTicket.checked_in_at,
      },
    });
  } catch (error) {
    console.error('Error checking ticket:', error);
    return NextResponse.json(
      { error: 'Failed to check ticket' },
      { status: 500 }
    );
  }
}

// POST endpoint for manual ticket validation without check-in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Missing ticket token' },
        { status: 400 }
      );
    }

    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid or expired ticket' },
        { status: 401 }
      );
    }

    // Get ticket from database
    const ticket = await getTicketByToken(token);

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      ticket: {
        id: ticket.id,
        eventName: ticket.event_name,
        eventDate: ticket.event_date,
        venue: ticket.venue,
        attendeeName: ticket.name,
        attendeeEmail: ticket.email,
        checkedIn: ticket.checked_in,
        checkedInAt: ticket.checked_in_at,
      },
    });
  } catch (error) {
    console.error('Error validating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to validate ticket' },
      { status: 500 }
    );
  }
}
