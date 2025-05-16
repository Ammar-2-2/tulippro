'use client';
import { useEffect, useState } from 'react';

interface Message {
    id: number;
    email: string;
    message: string;
    response?: string | null;
    is_read: boolean;
    created_at: string;
}

export default function MessagesTab({ emailId }: { emailId: string; }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!emailId) return;

        const fetchMessages = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/messages/${encodeURIComponent(emailId)}`);
                if (!res.ok) {
                    console.error('Failed to fetch messages:', res.statusText);
                    setMessages([]);
                    setLoading(false);
                    return;
                }

                const data: Message[] = await res.json();

                // Mark unread messages with responses as read by calling an update API or ignore for now

                setMessages(data);
            } catch (error) {
                console.error('Error fetching messages:', error);
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [emailId]);

    if (loading) return <p className="text-gray-500">Loading messages...</p>;

    if (messages.length === 0) return <p className="text-gray-500">No messages yet.</p>;

    return (
        <div className="space-y-4">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`border p-4 rounded-lg shadow-sm ${msg.response ? 'bg-green-50' : 'bg-yellow-50'}`}
                >
                    <p className="font-medium text-purple-700">📝 You: {msg.message}</p>
                    {msg.response ? (
                        <p className="mt-2 text-gray-800">💬 Admin: {msg.response}</p>
                    ) : (
                        <p className="text-sm text-yellow-600 mt-2">⏳ Awaiting admin response...</p>
                    )}
                </div>
            ))}
        </div>
    );
}
