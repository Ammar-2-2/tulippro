'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Type-definities voor props
type Booking = { created_at: string; packages?: { title?: string } };
type TourPackage = { title: string };
type Message = { is_replied: boolean };

type Props = {
  bookings: Booking[];
  tourPackages: TourPackage[];
  messages: Message[];
};

const DashboardAnalytics: React.FC<Props> = ({ bookings, tourPackages, messages }) => {
  // Tel hoeveel berichten beantwoord zijn
  const replied = messages.filter(m => m.is_replied).length;
  const pending = messages.length - replied;

  // Tel hoeveel keer elk pakket geboekt is
  const packageStats: Record<string, number> = {};
  bookings.forEach(b => {
    const title = b.packages?.title || 'Onbekend';
    packageStats[title] = (packageStats[title] || 0) + 1;
  });

  // Zet de data in een array en sorteer op meest geboekt
  const topPackages = Object.entries(packageStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Alleen de top 5 pakketten laten zien

  return (
    <div className="p-6 space-y-6">
      {/* Titel van het dashboard */}
      <h2 className="text-2xl font-bold text-black">📊 Dashboard Overzicht</h2>

      {/* Overzicht van totalen */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-lg">
        <li className="bg-white shadow rounded p-4 text-black">
          📦 Boekingen: <span className="font-bold">{bookings.length}</span>
        </li>
        <li className="bg-white shadow rounded p-4 text-black">
          🎒 Pakketten: <span className="font-bold">{tourPackages.length}</span>
        </li>
        <li className="bg-white shadow rounded p-4 text-black">
          ✉️ Berichten: <span className="font-bold">{messages.length}</span>
          <div className="text-sm text-gray-600 mt-1">
            ✅ Beantwoord: {replied} / ⏳ Openstaand: {pending}
          </div>
        </li>
      </ul>

      {/* Staafgrafiek van populairste pakketten */}
      <div>
        <h3 className="text-xl font-semibold text-black">🔥 Meest geboekte pakketten</h3>
        <div className="bg-white shadow rounded p-4 mt-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topPackages}>
              <XAxis dataKey="name" /> {/* Namen van pakketten */}
              <YAxis /> {/* Aantal boekingen */}
              <Tooltip /> {/* Mouse hover informatie */}
              <Bar dataKey="count" fill="#6366f1" /> {/* Staafkleur paars */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
