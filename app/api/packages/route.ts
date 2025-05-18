import { NextResponse, NextRequest } from 'next/server';
import { executeQuery } from '@/lib/mysql';
import { v4 as uuidv4 } from 'uuid';

interface Package {
  id: string;
  title: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
}

interface CreatePackageBody {
  title: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
}

export async function GET() {
  try {
    const data = await executeQuery<Package[]>({ query: 'SELECT * FROM packages' });
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('DB error:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CreatePackageBody;
    const { title, description, image_url, start_date, end_date } = body;
    const id = uuidv4();

    await executeQuery({
      query: `
        INSERT INTO packages (id, title, description, image_url, start_date, end_date)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      values: [id, title, description, image_url, start_date, end_date],
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    console.error('DB insert error:', error);
    return NextResponse.json({ error: 'Failed to add package' }, { status: 500 });
  }
}
