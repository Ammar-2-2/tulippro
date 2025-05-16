'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditBlog() {
    const { id } = useParams() as { id: string; };
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`/api/blogs/${id}`);
                if (!res.ok) throw new Error('Failed to fetch blog');

                const data = await res.json();
                setTitle(data.title);
                setSubtitle(data.subtitle);
                setContent(data.content);
                setImageUrls(Array.isArray(data.image_urls) ? data.image_urls : []);
            } catch (error) {
                console.error('Fetch error:', error);
                router.push('/admin/dashboard');
            }
        };

        if (id) fetchBlog();
    }, [id, router]);

    const handleImageChange = (index: number, value: string) => {
        const updated = [...imageUrls];
        updated[index] = value;
        setImageUrls(updated);
    };

    const addImageField = () => setImageUrls([...imageUrls, '']);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`/api/blogs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    subtitle,
                    content,
                    image_urls: imageUrls.filter((url) => url.trim() !== ''),
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error('Update error:', err.error);
                alert('Failed to update blog post');
            } else {
                router.push('/admin/dashboard');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-4">
                    <label className="block font-semibold">Title</label>
                    <input
                        className="w-full p-3 border rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                {/* Subtitle */}
                <div className="mb-4">
                    <label className="block font-semibold">Subtitle</label>
                    <input
                        className="w-full p-3 border rounded"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        required
                    />
                </div>
                {/* Content */}
                <div className="mb-4">
                    <label className="block font-semibold">Content</label>
                    <textarea
                        className="w-full p-3 border rounded min-h-[200px]"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                {/* Image URLs */}
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
                    Update Post
                </button>
            </form>
        </div>
    );
}
