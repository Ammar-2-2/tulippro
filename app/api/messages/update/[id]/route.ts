// File: app/api/messages/update/[id]/route.ts
import { executeQuery } from '@/lib/mysql';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
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
  } catch (error: any) {
    console.error('Error updating message:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
