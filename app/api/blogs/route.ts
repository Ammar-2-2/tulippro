import { executeQuery } from '@/lib/mysql';
import { NextResponse, NextRequest } from 'next/server';

interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  posted_at: string;
  image_urls: string | string[];
}

interface NewBlogPost {
  title: string;
  subtitle: string;
  content: string;
  image_urls: string[];  
  posted_at?: string;
}

export async function GET() {
  try {
    const data = await executeQuery<BlogPost[]>({
      query: `
        SELECT id, title, subtitle, content, posted_at, image_urls
        FROM blog_posts
        ORDER BY posted_at DESC
      `,
    });

    // Parse image_urls if string
    const blogs = data.map(blog => ({
      ...blog,
      image_urls:
        typeof blog.image_urls === 'string'
          ? JSON.parse(blog.image_urls)
          : blog.image_urls,
    }));

    return NextResponse.json(blogs);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as NewBlogPost;
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error inserting blog post:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
