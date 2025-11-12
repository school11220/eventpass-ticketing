import { NextRequest, NextResponse } from 'next/server';
import { getEventStats, getOrderStats } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authHeader = request.headers.get('authorization');
    const adminPass = process.env.ADMIN_PASS;

    if (!authHeader || authHeader !== `Bearer ${adminPass}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get stats
    const [eventStats, orderStats] = await Promise.all([
      getEventStats(),
      getOrderStats(),
    ]);

    return NextResponse.json({
      events: eventStats,
      summary: orderStats,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
