'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function MessagesTab({ emailId }: { emailId: string; }) {
    interface Message {
        id: number;
        email: string;
        message: string;
        response?: string;
        is_read: boolean;
        created_at: string;
    }

    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('email', emailId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching messages:', error.message);
                setMessages([]);
                setLoading(false);
                return;
            }

            const unreadWithResponses = data.filter((msg) => msg.response && !msg.is_read);
            if (unreadWithResponses.length > 0) {
                const ids = unreadWithResponses.map((msg) => msg.id);
                await supabase.from('messages').update({ is_read: true }).in('id', ids);
            }

            setMessages(data);
            setLoading(false);
        };

        if (emailId) {
            fetchMessages();
        }
    }, [emailId]);

    if (loading) return <p className="text-gray-500">Loading messages...</p>;

    return (
        <div className="space-y-4">
            {messages.length === 0 ? (
                <p className="text-gray-500">No messages yet.</p>
            ) : (
                messages.map((msg) => (
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
                ))
            )}
        </div>
    );
}
