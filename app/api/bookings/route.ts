import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function GET() {
  const { data, error } = await supabase
    .from('bookings')
    .select(`id, created_at, user_id, packages:package_id ( title, image_url, start_date,end_date )`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map user emails using Clerk
  const uniqueUserIds = [...new Set(data.map((b) => b.user_id))];
  const userEmailMap: Record<string, string> = {};

  await Promise.all(
    uniqueUserIds.map(async (userId) => {
      try {
        const user = await clerkClient.users.getUser(userId);
        userEmailMap[userId] = user.emailAddresses[0]?.emailAddress ?? 'No email';
      } catch {
        userEmailMap[userId] = 'Unknown';
      }
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enriched = data.map((booking: any) => ({
    ...booking,
    user_email: userEmailMap[booking.user_id] || 'Unknown',
  }));

  return NextResponse.json(enriched);
}
