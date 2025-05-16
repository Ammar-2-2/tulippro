import { executeQuery } from '@/lib/mysql';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await executeQuery<any[]>({
      query: `
        SELECT id, name, email, message, response, is_replied, is_read, created_at
        FROM messages
        ORDER BY created_at DESC
      `,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await executeQuery({
      query: `
        INSERT INTO messages (name, email, message, is_replied, is_read)
        VALUES (?, ?, ?, false, false)
      `,
      values: [name, email, message],
    });

    return NextResponse.json({ message: 'Message saved successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
