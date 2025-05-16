import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mysql';

export async function GET(request: Request, { params }: { params: { email: string } }) {
  try {
    const { email } = params;
    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    const data = await executeQuery<any[]>({
      query: `
        SELECT id, email, message, response, is_read, created_at
        FROM messages
        WHERE email = ?
        ORDER BY created_at DESC
      `,
      values: [email],
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
