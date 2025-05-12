'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type BlogPost = {
    id: string;
    title: string;
    subtitle: string;
    posted_at: string;
};

type Booking = {
    id: string;
    created_at: string;
    user_id: string;
    user_email: string;
    packages: {
        title: string;
        start_date: string;
        end_date: string;
        image_url?: string;
    };
};

type TourPackage = {
    id: string;
    title: string;
    description: string;
    image_url: string;
    start_date: string;
    end_date: string;
};

type Message = {
    id: string;
    message: string;
    response?: string;
    is_replied: boolean;
    is_read: boolean;
    user?: {
        email: string;
        full_name: string;
    };
    name?: string;
    email?: string;
};

export default function AdminDashboard() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeTab, setActiveTab] = useState<'bookings' | 'messages' | 'blogs' | 'packages'>('bookings');
    const [responseData, setResponseData] = useState<Record<string, string>>({});
    const [editingMessages, setEditingMessages] = useState<Set<string>>(new Set());

    const router = useRouter();

    useEffect(() => {
        if (activeTab === 'blogs') fetchBlogs();
        if (activeTab === 'bookings') fetchBookings();
        if (activeTab === 'packages') fetchPackages();
        if (activeTab === 'messages') fetchMessages();
    }, [activeTab]);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('id, message, response, is_replied, is_read, name, email')
            .order('created_at', { ascending: false });

        if (!error && data) setMessages(data);
    };

    const sendResponse = async (id: string) => {
        const response = responseData[id];
        if (!response || !response.trim()) {
            alert('Please enter a valid response');
            return;
        }

        await supabase
            .from('messages')
            .update({ response, is_replied: true, is_read: false })
            .eq('id', id);

        setEditingMessages((prev) => {
            const updated = new Set(prev);
            updated.delete(id);
            return updated;
        });

        fetchMessages();
    };

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/bookings');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setBookings(data);
        } catch (err) {
            console.error('Error loading bookings:', err);
        }
    };

    const fetchBlogs = async () => {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('id, title, subtitle, posted_at')
            .order('posted_at', { ascending: false });

        if (!error && data) setBlogPosts(data);
    };

    const fetchPackages = async () => {
        const { data, error } = await supabase.from('packages').select('*').order('start_date', { ascending: true });
        if (!error && data) setTourPackages(data);
    };

    const deleteBlog = async (id: string) => {
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (!error) setBlogPosts(prev => prev.filter(blog => blog.id !== id));
    };

    const handleAddBlogClick = () => {
        router.push('/admin/blogs/add');
    };

    const isExpired = (startDate: string) => {
        const today = new Date().setHours(0, 0, 0, 0);
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        return start <= today;
    };

    const handleResponseChange = (id: string, value: string) => {
        setResponseData(prev => ({ ...prev, [id]: value }));
    };

    const toggleEdit = (id: string) => {
        setEditingMessages(prev => {
            const updated = new Set(prev);
            if (updated.has(id)) updated.delete(id);
            else updated.add(id);
            return updated;
        });
    };

    const groupedBookings = bookings.reduce((acc, booking) => {
        const title = booking.packages?.title || 'Unknown';
        if (!acc[title]) acc[title] = [];
        acc[title].push(booking);
        return acc;
    }, {} as Record<string, Booking[]>);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white p-6 shadow-md">
                <div className="flex justify-between items-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-purple-700 hover:underline">
                        Tulip Tour
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                </div>
                <nav className="space-y-4">
                    {[
                        ['bookings', '📦 Bookings'],
                        ['messages', '💬 Messages'],
                        ['blogs', '📝 Blogs'],
                        ['packages', '🎁 Packages']
                    ].map(([tab, label]) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as 'bookings' | 'messages' | 'blogs' | 'packages')}
                            className={`block w-full text-left px-4 py-2 rounded ${activeTab === tab ? 'bg-purple-600 text-white' : 'hover:bg-purple-100 text-gray-700'}`}
                        >
                            {label}
                        </button>
                    ))}
                </nav>
                <div className="mt-8">
                    <Link
                        href="/"
                        className="block text-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                    >
                        Go to Website
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {activeTab === 'messages' && (
                    <div>
                        <h1 className="text-2xl font-bold mb-6 text-purple-700">All Messages</h1>
                        {messages.map((msg) => {
                            const senderName = msg.user?.full_name || msg.name || 'Unknown';
                            const senderEmail = msg.user?.email || msg.email || 'N/A';

                            return (
                                <div
                                    key={msg.id}
                                    className={`p-4 border rounded-lg mb-4 ${msg.is_replied ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}`}
                                >
                                    <p><strong>User:</strong> {senderName} </p>
                                    <p><strong>Email:</strong> {senderEmail}</p>
                                    <p><strong>Message:</strong> {msg.message}</p>

                                    {(!msg.is_replied || editingMessages.has(msg.id)) && (
                                        <textarea
                                            className="w-full border mt-2 p-2"
                                            value={responseData[msg.id] || msg.response || ''}
                                            onChange={(e) => handleResponseChange(msg.id, e.target.value)}
                                            placeholder="Write a response..."
                                        />
                                    )}

                                    {msg.is_replied ? (
                                        editingMessages.has(msg.id) ? (
                                            <button
                                                onClick={() => sendResponse(msg.id)}
                                                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => toggleEdit(msg.id)}
                                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>
                                        )
                                    ) : (
                                        <button
                                            onClick={() => sendResponse(msg.id)}
                                            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                        >
                                            Submit Response
                                        </button>
                                    )}

                                    <p className="text-sm text-gray-500 mt-1">
                                        Status: {msg.is_replied ? '✅ Replied' : '⏳ Pending'}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}


                {/* Bookings */}
                {activeTab === 'bookings' && (
                    <>
                        <h1 className="text-2xl font-bold mb-6 text-purple-700">Manage Bookings</h1>
                        <div className="space-y-6">
                            {Object.entries(groupedBookings).map(([title, group]) => (
                                <div key={title} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                    <h2 className="text-xl font-semibold text-purple-800 mb-4">{title}</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                                        {group.map(booking => (
                                            <div key={booking.id} className="bg-gray-50 p-4 border rounded-lg shadow-sm">
                                                {booking.packages?.image_url && (
                                                    <img
                                                        src={booking.packages.image_url}
                                                        alt={booking.packages.title}
                                                        className="h-32 w-full object-cover rounded mb-4"
                                                    />
                                                )}
                                                <p className="text-sm text-gray-700">
                                                    <strong>User Email:</strong> {booking.user_email}
                                                </p>
                                                <p className="text-sm text-gray-700">
                                                    <strong>Start Date:</strong> {formatDate(booking.packages?.start_date)}
                                                </p>
                                                <p className="text-sm text-gray-700">
                                                    <strong>End Date:</strong> {formatDate(booking.packages?.end_date)}
                                                </p>
                                                <p className="text-sm text-gray-700">
                                                    <strong>Booked At:</strong> {formatDate(booking.created_at)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Blogs */}
                {activeTab === 'blogs' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-purple-700">Manage Blogs</h1>
                            <button
                                onClick={handleAddBlogClick}
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                            >
                                Add New Blog
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                            {blogPosts.map(blog => (
                                <div key={blog.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                                    <h2 className="text-lg font-bold text-purple-700 mb-2">{blog.title}</h2>
                                    <p className="text-sm text-gray-600 mb-4">{blog.subtitle}</p>
                                    <p className="text-xs text-gray-500 mb-4">
                                        Posted At: {formatDate(blog.posted_at)}
                                    </p>
                                    <div className="flex justify-between">
                                        <Link
                                            href={`/admin/blogs/edit/${blog.id}`}
                                            className="text-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => deleteBlog(blog.id)}
                                            className="text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Packages */}
                {activeTab === 'packages' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-purple-700">Manage Packages</h1>
                            <button
                                onClick={() => router.push('/admin/packages/add')}
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                            >
                                Add New Package
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {tourPackages.map(pkg => (
                                <div key={pkg.id} className="bg-white p-4 shadow-md rounded-lg border border-gray-200 relative">
                                    {isExpired(pkg.start_date) && (
                                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            Expired
                                        </span>
                                    )}
                                    <img src={pkg.image_url} alt={pkg.title} className="w-full h-32 object-cover rounded mb-2" />
                                    <h2 className="text-lg font-semibold text-purple-800">{pkg.title}</h2>
                                    <p className="text-gray-600 text-sm">{pkg.description}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {formatDate(pkg.start_date)} – {formatDate(pkg.end_date)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

// Date formatter
function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
