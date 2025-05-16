"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Blog = {
    id: string;
    title: string;
    subtitle: string;
    content: string;
    posted_at: string;
    image_urls?: string[] | null;
};

type BlogPageProps = {
    params: { id: string; };
};

export default function BlogPage({ params }: BlogPageProps) {
    const { id } = params;
    const [blog, setBlog] = useState<Blog | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchBlog() {
            try {
                const res = await fetch(`/api/blogs/${id}`);
                if (!res.ok) {
                    throw new Error(`Error fetching blog: ${res.statusText}`);
                }
                const data: Blog = await res.json();
                setBlog(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Onbekende fout");
                }
            }
        }
        fetchBlog();
    }, [id]);

    if (error) {
        return (
            <div className="p-10 text-center text-red-600">
                Kan het artikel niet laden: {error}
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="p-10 text-center text-gray-600">Laden...</div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10" dir="ltr">
            <h1 className="text-4xl font-bold text-purple-800 mb-4">{blog.title}</h1>
            <h2 className="text-xl text-gray-600 mb-4">{blog.subtitle}</h2>
            <p className="text-sm text-gray-500 mb-6">
                Gepubliceerd op {new Date(blog.posted_at).toLocaleDateString("nl-NL")}
            </p>

            {blog.image_urls?.map((url, idx) => (
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
