import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mysql';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const data = await executeQuery<any[]>({ query: 'SELECT * FROM packages' });
    return NextResponse.json(data);
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, image_url, start_date, end_date } = await req.json();
    const id = uuidv4();

    await executeQuery({
      query: `
        INSERT INTO packages (id, title, description, image_url, start_date, end_date)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      values: [id, title, description, image_url, start_date, end_date],
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('DB insert error:', error);
    return NextResponse.json({ error: 'Failed to add package' }, { status: 500 });
  }
}
