'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ContactSection() {
    const [form, setForm] = useState({ name: '', email: '', message: '', agree: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.agree) return alert('Please agree to terms');

        setIsSubmitting(true);

        try {
            const { error } = await supabase.from('messages').insert([
                {
                    name: form.name,
                    email: form.email,
                    message: form.message,
                    is_replied: false,
                    is_read: false,
                },
            ]);

            if (error) throw new Error(error.message);

            setForm({ name: '', email: '', message: '', agree: false });
            setSuccessMessage('Your message has been sent successfully!');
        } catch (error) {
            console.error('Error inserting message:', error);
            setSuccessMessage('Something went wrong. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="bg-white py-20 px-4">
            <div className="max-w-7xl mx-auto text-left">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-purple-700">Neem contact op</h2>
                    <p className="text-gray-600 mt-2">📍 Sluit je aan bij ons volgende avontuur. Laat ons je meenemen op een onvergetelijke reis! ✨</p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 bg-white shadow-lg rounded-xl p-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center">📞</div>
                            <span className="text-gray-700">+31613333021</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center">📞</div>
                            <span className="text-gray-700">+31613333164</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center">✉️</div>
                            <span className="text-gray-700">info@tuliptrip.com</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center">📍</div>
                            <span className="text-gray-700">Amsterdam, Nederland</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                name="name"
                                type="text"
                                placeholder="Volledige naam"
                                required
                                className="border border-gray-300 rounded p-2"
                                onChange={handleChange}
                                value={form.name}
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder="E-mailadres"
                                required
                                className="border border-gray-300 rounded p-2"
                                onChange={handleChange}
                                value={form.email}
                            />
                        </div>
                        <textarea
                            name="message"
                            placeholder="Je bericht..."
                            required
                            className="w-full border border-gray-300 rounded p-2 h-32"
                            onChange={handleChange}
                            value={form.message}
                        />
                        <div className="flex items-center justify-start gap-2">
                            <input
                                type="checkbox"
                                name="agree"
                                checked={form.agree}
                                onChange={handleChange}
                            />
                            <label htmlFor="agree" className="text-sm text-gray-600">
                                Ik ga akkoord met de servicevoorwaarden en het privacybeleid.
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="bg-purple-700 text-white py-2 px-6 rounded hover:bg-purple-800 transition"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Verzenden...' : 'Bericht verzenden'}
                        </button>
                    </form>

                    {successMessage && (
                        <div className="mt-4 text-center text-green-600">
                            <p>{successMessage}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
