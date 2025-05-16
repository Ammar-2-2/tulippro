import { executeQuery } from '@/lib/mysql';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await executeQuery<any[]>({
      query: `
        SELECT id, title, subtitle, content, posted_at, image_urls
        FROM blog_posts
        ORDER BY posted_at DESC
      `,
    });

    const blogs = data.map(blog => ({
      ...blog,
      image_urls: typeof blog.image_urls === 'string' ? JSON.parse(blog.image_urls) : blog.image_urls,
    }));

    return NextResponse.json(blogs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subtitle, content, image_urls, posted_at } = body;

    await executeQuery({
      query: `
        INSERT INTO blog_posts (title, subtitle, content, image_urls, posted_at)
        VALUES (?, ?, ?, ?, ?)
      `,
      values: [
        title,
        subtitle,
        content,
        JSON.stringify(image_urls),
        posted_at || new Date().toISOString(),
      ],
    });

    return NextResponse.json({ message: 'Blog post added successfully' });
  } catch (error: any) {
    console.error('Error inserting blog post:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}