import { executeQuery } from '@/lib/mysql';
import { NextResponse, NextRequest } from 'next/server';

interface BookingRecord {
  id: string;
  created_at: string;
  user_id: string;
  package_id: string;
  title: string;
  image_url: string;
  start_date: string;
  end_date: string;
}

interface BookingResponse {
  id: string;
  created_at: string;
  user_id: string;
  packages: {
    title: string;
    image_url: string;
    start_date: string;
    end_date: string;
  };
}

interface CreateBookingBody {
  user_id: string;
  package_id: string;
}

export async function GET() {
  try {
    const data = await executeQuery<BookingRecord[]>({
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
      `,
    });

    const transformedData: BookingResponse[] = data.map((booking) => ({
      id: booking.id,
      created_at: booking.created_at,
      user_id: booking.user_id,
      packages: {
        title: booking.title,
        image_url: booking.image_url,
        start_date: booking.start_date,
        end_date: booking.end_date,
      },
    }));

    return NextResponse.json(transformedData);
  } catch (error: unknown) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, package_id } = (await request.json()) as CreateBookingBody;

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
  } catch (error: unknown) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
