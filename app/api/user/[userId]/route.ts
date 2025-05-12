import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId;
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress || 'No email';
    return NextResponse.json({ email });
  } catch {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}
