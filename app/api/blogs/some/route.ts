import { executeQuery } from '@/lib/mysql';
import { NextResponse } from 'next/server';

interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  posted_at: string;
  image_urls: string | string[];
}

export async function GET() {
  try {
    const data = await executeQuery<BlogPost[]>({
      query: `
        SELECT id, title, subtitle, content, posted_at, image_urls
        FROM blog_posts
        ORDER BY posted_at DESC
        LIMIT 4
      `,
    });

    const blogs = data.map(blog => ({
      ...blog,
      image_urls:
        typeof blog.image_urls === 'string'
          ? JSON.parse(blog.image_urls)
          : blog.image_urls,
    }));

    return NextResponse.json(blogs);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
