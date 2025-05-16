import { executeQuery } from '@/lib/mysql';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await executeQuery<any[]>({
      query: `
        SELECT 
          b.id, 
          b.created_at, 
          b.user_id, 
          p.id as package_id, 
          p.title, 
          p.image_url, 
          p.start_date, 
          p.end_date
        FROM bookings b
        JOIN packages p ON b.package_id = p.id
      `
    });

    const transformedData = data.map(booking => ({
      id: booking.id,
      created_at: booking.created_at,
      user_id: booking.user_id,
      packages: {
        title: booking.title,
        image_url: booking.image_url,
        start_date: booking.start_date,
        end_date: booking.end_date
      }
    }));

    return NextResponse.json(transformedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Add this POST handler for creating a booking
export async function POST(request: Request) {
  try {
    const { user_id, package_id } = await request.json();

    if (!user_id || !package_id) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    await executeQuery({
      query: `
        INSERT INTO bookings (user_id, package_id)
        VALUES (?, ?)
      `,
      values: [user_id, package_id],
    });

    return NextResponse.json({ message: 'Booking created' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
