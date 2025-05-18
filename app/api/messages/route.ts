import { executeQuery } from '@/lib/mysql';
import { NextResponse, NextRequest } from 'next/server';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  response: string | null;
  is_replied: boolean;
  is_read: boolean;
  created_at: string;
}

interface CreateMessageBody {
  name: string;
  email: string;
  message: string;
}

export async function GET() {
  try {
    const data = await executeQuery<Message[]>({
      query: `
        SELECT id, name, email, message, response, is_replied, is_read, created_at
        FROM messages
        ORDER BY created_at DESC
      `,
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error fetching messages:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json() as CreateMessageBody;

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
