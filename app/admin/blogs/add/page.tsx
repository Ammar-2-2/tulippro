'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AddBlog() {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrls, setImageUrls] = useState<string[]>(['']);
    const router = useRouter();

    const handleImageChange = (index: number, value: string) => {
        const updated = [...imageUrls];
        updated[index] = value;
        setImageUrls(updated);
    };

    const addImageField = () => setImageUrls([...imageUrls, '']);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { error } = await supabase.from('blog_posts').insert([
            {
                title,
                subtitle,
                content,
                image_urls: imageUrls.filter((url) => url.trim() !== ''),
                posted_at: new Date().toISOString(),
            },
        ]);

        if (error) {
            console.error('Insert error:', error.message);
        } else {
            router.push('/admin/dashboard');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Add New Blog Post</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-semibold">Title</label>
                    <input
                        className="w-full p-3 border rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Subtitle</label>
                    <input
                        className="w-full p-3 border rounded"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Content</label>
                    <textarea
                        className="w-full p-3 border rounded min-h-[200px]"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Image URLs</label>
                    {imageUrls.map((url, idx) => (
                        <input
                            key={idx}
                            type="text"
                            className="w-full p-2 mb-2 border rounded"
                            value={url}
                            onChange={(e) => handleImageChange(idx, e.target.value)}
                            placeholder={`Image URL ${idx + 1}`}
                        />
                    ))}
                    <button
                        type="button"
                        onClick={addImageField}
                        className="mt-2 px-4 py-1 bg-gray-200 rounded"
                    >
                        + Add Another Image
                    </button>
                </div>
                <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded">
                    Submit
                </button>
            </form>
        </div>
    );
}
