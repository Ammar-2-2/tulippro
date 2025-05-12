'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AddPackage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: '',
        description: '',
        image_url: '',
        start_date: '',
        end_date: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('packages').insert([form]);
        if (!error) router.push('/admin/dashboard');
        else alert('Error adding package');
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
            <h1 className="text-2xl font-bold mb-6 text-purple-700">Add New Package</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" placeholder="Title" onChange={handleChange} required className="w-full p-2 border rounded" />
                <textarea name="description" placeholder="Description" onChange={handleChange} required className="w-full p-2 border rounded" />
                <input name="image_url" placeholder="Image URL" onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="date" name="start_date" onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="date" name="end_date" onChange={handleChange} required className="w-full p-2 border rounded" />
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Add Package</button>
            </form>
        </div>
    );
}
