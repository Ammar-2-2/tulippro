'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MessagesTab from '@/components/MessagesTab';
import dynamic from 'next/dynamic';
import FamilyForm from '@/components/FamilyForm';

const MapTab = dynamic(() => import('@/components/MapTab'), {
  ssr: false,
});

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface Booking {
  id: string;
  created_at: string;
  packages: {
    title: string;
    image_url: string;
    description: string;
    start_date: string;
    end_date: string;
    latitude?: number;
    longitude?: number;
  };
  user_id?: string;
}

export default function Dashboard() {
  const { user } = useUser();

  // 👇 Tab toegevoegd
  const [activeTab, setActiveTab] = useState<'bookings' | 'messages' | 'map' | 'family'>('bookings');

  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const createBookingIfNeeded = async () => {
      const storedPackageId = localStorage.getItem('selected_package');

      if (storedPackageId) {
        try {
          await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: user?.id,
              package_id: storedPackageId,
            }),
          });

          localStorage.removeItem('selected_package');
        } catch (error) {
          console.error('Error creating booking from stored package:', error);
        }
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        const userBookings = data.filter(
          (b: Booking & { user_id: string }) => user && b.user_id === user.id
        );
        setBookings(userBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    if (user?.id) {
      createBookingIfNeeded();
      fetchBookings();
    }
  }, [user?.id]);

  const validLocations = bookings
    .filter(b => b.packages.latitude && b.packages.longitude)
    .map(b => ({
      lat: b.packages.latitude!,
      lon: b.packages.longitude!,
      title: b.packages.title,
    }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white p-6 shadow-md flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-purple-700">Tulip Tour</h2>
            <UserButton afterSignOutUrl="/" />
          </div>
          <nav className="space-y-4">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`block w-full text-left px-4 py-2 rounded ${activeTab === 'bookings'
                ? 'bg-purple-600 text-white'
                : 'hover:bg-purple-100 text-gray-700'
                }`}
            >
              📦 Bookings
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`block w-full text-left px-4 py-2 rounded ${activeTab === 'messages'
                ? 'bg-purple-600 text-white'
                : 'hover:bg-purple-100 text-gray-700'
                }`}
            >
              💬 Messages
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`block w-full text-left px-4 py-2 rounded ${activeTab === 'map'
                ? 'bg-purple-600 text-white'
                : 'hover:bg-purple-100 text-gray-700'
                }`}
            >
              🗺️ Map
            </button>

            {/* 👇 Extra tab */}
            <button
              onClick={() => setActiveTab('family')}
              className={`block w-full text-left px-4 py-2 rounded ${activeTab === 'family'
                ? 'bg-purple-600 text-white'
                : 'hover:bg-purple-100 text-gray-700'
                }`}
            >
              👨‍👩‍👧‍👦 Family
            </button>
          </nav>
        </div>
        <div className="mt-8">
          <Link
            href="/"
            className="block text-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Go to Website
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8">
        {activeTab === 'messages' && (
          <div>
            <h1 className="text-2xl font-bold mb-6 text-purple-700">Messages</h1>
            <MessagesTab emailId={user?.emailAddresses?.[0]?.emailAddress || ''} />
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h1 className="text-2xl font-bold mb-6 text-purple-700">My Bookings</h1>
            {bookings.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col"
                  >
                    <img
                      src={b.packages.image_url}
                      alt={b.packages.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 flex-1 flex flex-col">
                      <h2 className="text-lg font-semibold text-purple-800 mb-1">
                        {b.packages.title}
                      </h2>
                      <p className="text-sm text-gray-600 flex-1 mb-2">
                        {b.packages.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-auto">
                        📅 {formatDate(b.packages.start_date)} → {formatDate(b.packages.end_date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">You have no bookings yet.</p>
            )}
          </div>
        )}

        {activeTab === 'map' && (
          <div>
            <h1 className="text-2xl font-bold mb-6 text-purple-700">Nearby Places</h1>
            {validLocations.length > 0 ? (
              <MapTab locations={validLocations} />
            ) : (
              <p className="text-gray-500">Geen boekingen met locaties gevonden.</p>
            )}
          </div>
        )}

        {/* 👇 Nieuw tab content */}
        {activeTab === 'family' && (
          <div>
            <h1 className="text-2xl font-bold mb-6 text-purple-700">Mijn gezinssamenstelling</h1>
            <FamilyForm />
          </div>
        )}
      </main>
    </div>
  );
}
