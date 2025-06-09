'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Types
type Booking = { created_at: string; packages?: { title?: string } };
type TourPackage = { title: string };
type Message = { is_replied: boolean };

type Props = {
  bookings: Booking[];
  tourPackages: TourPackage[];
  messages: Message[];
};

const DashboardAnalytics: React.FC<Props> = ({ bookings, tourPackages, messages }) => {
  const replied = messages.filter(m => m.is_replied).length;
  const pending = messages.length - replied;

  // Lijst van unieke jaren uit de bookings
  const years = Array.from(
    new Set(bookings.map(b => new Date(b.created_at).getFullYear()))
  ).sort();

  // Maanden
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));

  // Gekozen maand en jaar
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Filter boekingen per maand/jaar
  const filteredBookings = bookings.filter(b => {
    const d = new Date(b.created_at);
    return (
      selectedYear !== null &&
      selectedMonth !== null &&
      d.getFullYear() === selectedYear &&
      d.getMonth() === selectedMonth
    );
  });

  // Statistiek populairste pakketten
  const packageStats: Record<string, number> = {};
  filteredBookings.forEach(b => {
    const title = b.packages?.title || 'Onbekend';
    packageStats[title] = (packageStats[title] || 0) + 1;
  });

  const topPackages = Object.entries(packageStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-black">📊 Dashboard Overzicht</h2>

      {/* Totalen */}
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

      {/* Jaar en maand keuze */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 text-black font-medium">📅 Kies een jaar:</label>
          <select
            className="w-full border rounded px-4 py-2"
            value={selectedYear ?? ''}
            onChange={e => setSelectedYear(Number(e.target.value))}
          >
            <option value="">-- Jaar --</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-black font-medium">📅 Kies een maand:</label>
          <select
            className="w-full border rounded px-4 py-2"
            value={selectedMonth ?? ''}
            onChange={e => setSelectedMonth(Number(e.target.value))}
          >
            <option value="">-- Maand --</option>
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Populairste pakketten */}
      {selectedYear !== null && selectedMonth !== null && (
        <div>
          <h3 className="text-xl font-semibold text-black mt-4">
            🔝 Populairste pakketten in {months[selectedMonth].label} {selectedYear}
          </h3>
          <div className="bg-white shadow rounded p-4 mt-2 h-64">
            {topPackages.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPackages}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">Geen boekingen in deze maand.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAnalytics;
