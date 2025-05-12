import { supabase } from '@/lib/supabase';
import Link from 'next/link';


type Params = Promise<{
    id: string;
}>;


export default async function BlogPage({ params }: { params: Params; }) {
    // Fetch the blog using the `id` from params
    const { id } = await params;
    const { data: blog, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id) // Use params.id for the query
        .single();

    if (error || !blog) {
        return <div className="p-10 text-center text-red-600">Kan het artikel niet laden</div>;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10" dir="ltr">
            <h1 className="text-4xl font-bold text-purple-800 mb-4">{blog.title}</h1>
            <h2 className="text-xl text-gray-600 mb-4">{blog.subtitle}</h2>
            <p className="text-sm text-gray-500 mb-6">
                Gepubliceerd op {new Date(blog.posted_at).toLocaleDateString('nl-NL')}
            </p>

            {blog.image_urls?.map((url: string, idx: number) => (
                <img
                    key={idx}
                    src={url}
                    alt={`blog-image-${idx}`}
                    className="mb-6 w-full rounded-lg shadow-md"
                />
            ))}

            <article className="prose prose-lg text-gray-800 leading-relaxed max-w-none mb-10">
                {blog.content}
            </article>

            <div className="flex justify-center">
                <Link href="/blogs">
                    <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                        Terug naar Blogs
                    </button>
                </Link>
            </div>
        </div>
    );
}
