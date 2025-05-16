import { executeQuery } from '@/lib/mysql';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const data = await executeQuery<any[]>({
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
    blog.image_urls = typeof blog.image_urls === 'string' ? JSON.parse(blog.image_urls) : blog.image_urls;

    return NextResponse.json(blog);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await executeQuery({
      query: `DELETE FROM blog_posts WHERE id = ?`,
      values: [id],
    });

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, subtitle, content, image_urls } = body;

    await executeQuery({
      query: `
        UPDATE blog_posts
        SET title = ?, subtitle = ?, content = ?, image_urls = ?
        WHERE id = ?
      `,
      values: [title, subtitle, content, JSON.stringify(image_urls), id],
    });

    return NextResponse.json({ message: 'Blog updated successfully' });
  } catch (error: any) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}