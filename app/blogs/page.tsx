"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Blog = {
    id: string;
    title: string;
    content: string;
    posted_at: string;
    image_urls?: string[] | null;
};

export default function AllBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch("/api/blogs");
                if (!res.ok) {
                    throw new Error(`Error: ${res.status}`);
                }
                const data: Blog[] = await res.json();
                setBlogs(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Onbekende fout");
                }
            }
        };

        fetchBlogs();
    }, []);

    if (error) {
        return (
            <div className="p-10 text-red-600 text-center">
                Fout bij het laden van de artikelen: {error}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10" dir="ltr">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-purple-800">Alle artikelen</h1>
                <Link href="/">
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                        Home Page
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <div
                        key={blog.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 shadow-md"
                    >
                        {blog.image_urls?.[0] && (
                            <img
                                src={blog.image_urls[0]}
                                alt={blog.title}
                                className="rounded-lg h-40 w-full object-cover mb-3"
                            />
                        )}
                        <h2 className="text-lg font-semibold text-purple-800">
                            {blog.title}
                        </h2>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {blog.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            {new Date(blog.posted_at).toLocaleDateString("nl-NL")}
                        </p>
                        <Link
                            href={`/blogs/${blog.id}`}
                            className="text-purple-600 mt-2 inline-block hover:underline"
                        >
                            Lees meer →
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
