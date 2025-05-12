import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { clerkClient } from "@clerk/clerk-sdk-node";

const isAdminRoute = createRouteMatcher(['/admin(.*)']);


export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const { userId } = await auth();

  let isAdmin = false;
  if (userId) {
    const user = await clerkClient.users.getUser(userId);
    isAdmin = user.publicMetadata?.isAdmin === true;
  }



  // Redirect admins from /dashboard to /admin/dashboard
  if (userId && isAdmin) {
    if (url.pathname === '/dashboard') {
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Block non-admins from admin routes
  if (isAdminRoute(req) && !isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};