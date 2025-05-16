'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type BlogPost = {
    id: string;
    title: string;
    subtitle: string;
    content: string;
    posted_at: string;
    image_urls: string[];
};

export default function Blogs() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch('/api/blogs/some');
                const data = await res.json();
                setBlogs(data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('nl-NL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    return (
        <section id="blogs" className="py-20 px-4 bg-white" dir="ltr">
            <div className="max-w-7xl mx-auto text-left">
                <h2 className="text-3xl font-bold text-purple-700 mb-2">📚 Onze Blog</h2>
                <p className="text-gray-600 mb-6">Ontdek de nieuwste reisverhalen van het Tulip-team.</p>

                {loading ? (
                    <p className="text-gray-500">Bezig met laden...</p>
                ) : blogs.length === 0 ? (
                    <p className="text-gray-500">Er zijn momenteel geen blogartikelen.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {blogs.map((blog) => (
                                <div key={blog.id} className="bg-white rounded-xl shadow-md border p-4">
                                    {blog.image_urls?.[0] && (
                                        <img
                                            src={blog.image_urls[0]}
                                            alt={blog.title}
                                            className="rounded-lg h-40 w-full object-cover mb-3"
                                        />
                                    )}
                                    <h3 className="text-lg font-semibold text-purple-800">{blog.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{blog.content}</p>
                                    <p className="text-xs text-gray-400 mt-2">{formatDate(blog.posted_at)}</p>
                                    <Link
                                        href={`/blogs/${blog.id}`}
                                        className="text-purple-600 mt-2 inline-block hover:underline"
                                    >
                                        Lees meer →
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <Link
                                href="/blogs"
                                className="inline-block px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                                Bekijk alle blogs
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
