import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

// Type definitions
type Booking = {
    created_at: string;
    packages?: {
        title?: string;
    };
};

type TourPackage = {
    id: string | number;
    title: string;
};

type Message = {
    is_replied: boolean;
};

type DashboardAnalyticsProps = {
    bookings: Booking[];
    tourPackages: TourPackage[];
    messages: Message[];
};

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ bookings, tourPackages, messages }) => {
    const [selectedMonth, setSelectedMonth] = React.useState<{ month: number; year: number } | null>(null);

    // Filter bookings based on selected month
    const filteredBookings = React.useMemo(() => {
        if (!selectedMonth) return bookings;
        return bookings.filter(booking => {
            const bookingDate = new Date(booking.created_at);
            return (
                bookingDate.getMonth() === selectedMonth.month &&
                bookingDate.getFullYear() === selectedMonth.year
            );
        });
    }, [bookings, selectedMonth]);

    // Booking stats for packages
    const packageBookingStats = filteredBookings.reduce<Record<string, number>>((acc, booking) => {
        const packageTitle = booking.packages?.title || 'Unknown';
        if (!acc[packageTitle]) acc[packageTitle] = 0;
        acc[packageTitle]++;
        return acc;
    }, {});

    const packageBookingData = Object.entries(packageBookingStats)
        .map(([name, bookings]) => ({ name, bookings }))
        .sort((a, b) => b.bookings - a.bookings);

    // Message stats
    const messageStats = [
        { name: 'Replied', value: messages.filter(msg => msg.is_replied).length },
        { name: 'Pending', value: messages.filter(msg => !msg.is_replied).length }
    ];

    // Get top packages for a specific month/year
    const getTopPackagesForMonth = (month: number, year: number) => {
        const filtered = bookings.filter(booking => {
            const date = new Date(booking.created_at);
            return date.getMonth() === month && date.getFullYear() === year;
        });

        const stats = filtered.reduce<Record<string, number>>((acc, booking) => {
            const title = booking.packages?.title || 'Unknown';
            acc[title] = (acc[title] || 0) + 1;
            return acc;
        }, {});

        const sorted = Object.entries(stats)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        return sorted.slice(0, 3);
    };

    // Custom tooltip for monthly booking trends
    const CustomMonthlyTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const now = new Date();
            const index = payload[0].payload.index;
            const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
            const topPackages = getTopPackagesForMonth(date.getMonth(), date.getFullYear());

            return (
                <div className="bg-white p-3 border rounded shadow text-sm">
                    <p className="font-semibold">{label}</p>
                    <p>Total Bookings: {payload[0].value}</p>
                    <div className="mt-2">
                        {topPackages.map(pkg => (
                            <p key={pkg.name}>• {pkg.name}: {pkg.count}</p>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    // Monthly booking trends (last 6 months)
    const getMonthlyBookings = () => {
        const now = new Date();
        const monthlyData: { name: string; bookings: number; index: number }[] = [];

        for (let i = 5; i >= 0; i--) {
            const month = new Date(now);
            month.setMonth(now.getMonth() - i);
            const monthName = month.toLocaleString('default', { month: 'short' });

            const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
            const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

            const count = bookings.filter(booking => {
                const bookingDate = new Date(booking.created_at);
                return bookingDate >= startOfMonth && bookingDate <= endOfMonth;
            }).length;

            monthlyData.push({ name: monthName, bookings: count, index: 5 - i });
        }

        return monthlyData;
    };

    const monthlyBookingData = getMonthlyBookings();

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-purple-700 mb-4">Total Bookings</h2>
                    <p className="text-5xl font-bold text-center text-purple-800">{bookings.length}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-purple-700 mb-4">Total Packages</h2>
                    <p className="text-5xl font-bold text-center text-green-600">{tourPackages.length}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-purple-700 mb-4">Messages</h2>
                    <p className="text-5xl font-bold text-center text-blue-600">{messages.length}</p>
                    <div className="flex justify-center mt-2 text-sm">
                        <span className="text-green-600 mr-4">Replied: {messages.filter(m => m.is_replied).length}</span>
                        <span className="text-yellow-600">Pending: {messages.filter(m => !m.is_replied).length}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Most Booked Packages */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-purple-700">
                            Most Booked Packages
                            {selectedMonth && (
                                <span className="text-sm text-gray-500 ml-2">
                                    (
                                    {new Date(selectedMonth.year, selectedMonth.month).toLocaleString('default', {
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                    )
                                </span>
                            )}
                        </h2>
                        {selectedMonth && (
                            <button
                                onClick={() => setSelectedMonth(null)}
                                className="text-sm text-blue-600 underline"
                            >
                                Clear Selection
                            </button>
                        )}
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={packageBookingData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="bookings" fill="#8884d8" name="Number of Bookings" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Message Status */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-purple-700 mb-4">Message Status</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={messageStats}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {messageStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#82ca9d' : '#ffc658'} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Monthly Booking Trends */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-purple-700 mb-4">Monthly Booking Trends</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={monthlyBookingData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomMonthlyTooltip />} />
                            <Legend />
                            <Bar
                                dataKey="bookings"
                                fill="#5243AA"
                                name="Bookings per Month"
                                onClick={(data, index) => {
                                    const now = new Date();
                                    const selectedDate = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
                                    setSelectedMonth({ month: selectedDate.getMonth(), year: selectedDate.getFullYear() });
                                }}
                                cursor="pointer"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardAnalytics;
