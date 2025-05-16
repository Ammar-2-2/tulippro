import { executeQuery } from '@/lib/mysql';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await executeQuery<any[]>({
      query: `
        SELECT id, title, subtitle, content, posted_at, image_urls
        FROM blog_posts
        ORDER BY posted_at DESC
        LIMIT 4
      `,
    });

    // If image_urls is stored as JSON string in the DB, parse it
    const blogs = data.map(blog => ({
      ...blog,
      image_urls: typeof blog.image_urls === 'string' ? JSON.parse(blog.image_urls) : blog.image_urls,
    }));

    return NextResponse.json(blogs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

