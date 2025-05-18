import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mysql';

interface BlogPost {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  posted_at: string;
  image_urls: string | string[];
}

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  try {
    const data = await executeQuery<BlogPost[]>({
      query: `
        SELECT id, title, subtitle, content, posted_at, image_urls
        FROM blog_posts
        WHERE id = ?
        LIMIT 1
      `,
      values: [id],
    });

    if (data.length === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const blog = data[0];
    blog.image_urls =
      typeof blog.image_urls === 'string'
        ? JSON.parse(blog.image_urls)
        : blog.image_urls;

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  try {
    await executeQuery({
      query: `DELETE FROM blog_posts WHERE id = ?`,
      values: [id],
    });

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Context) {
  const { id } = await params;

  try {
    const body = await request.json() as {
      title: string;
      subtitle: string;
      content: string;
      image_urls: string[];
    };

    await executeQuery({
      query: `
        UPDATE blog_posts
        SET title = ?, subtitle = ?, content = ?, image_urls = ?
        WHERE id = ?
      `,
      values: [
        body.title,
        body.subtitle,
        body.content,
        JSON.stringify(body.image_urls),
        id,
      ],
    });

    return NextResponse.json({ message: 'Blog updated successfully' });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}
