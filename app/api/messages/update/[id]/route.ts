import { executeQuery } from '@/lib/mysql';
import { NextResponse, NextRequest } from 'next/server';

interface Context {
  params: Promise<{ id: string }>;
}

interface UpdateMessageBody {
  response: string;
  is_replied: boolean;
  is_read: boolean;
}

export async function POST(request: NextRequest, context: Context) {
  const { id } = await context.params;

  try {
    const body = await request.json() as UpdateMessageBody;
    const { response, is_replied, is_read } = body;

    await executeQuery({
      query: `
        UPDATE messages
        SET response = ?, is_replied = ?, is_read = ?
        WHERE id = ?
      `,
      values: [response, is_replied, is_read, id],
    });

    return NextResponse.json({ message: 'Message updated successfully' });
  } catch (error: unknown) {
    console.error('Error updating message:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
