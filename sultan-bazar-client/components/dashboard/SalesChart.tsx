"use client";

import { useState } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from "recharts";
import { useGetSalesAnalyticsQuery } from "@/redux/api/orderApi";
import { Loader2, TrendingUp } from "lucide-react";

export default function SalesChart() {
    const [period, setPeriod] = useState<"daily" | "monthly" | "yearly">("monthly");
    const { data, isLoading } = useGetSalesAnalyticsQuery(period);

    const chartData = data?.data || [];

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#B5451B]" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#B5451B]" />
                        Sales Analytics
                    </h2>
                    <p className="text-sm text-gray-500">Revenue and order volume over time</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {["daily", "monthly", "yearly"].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p as any)}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${period === p ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {chartData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-gray-400 gap-3">
                    <TrendingUp className="w-10 h-10 opacity-20" />
                    <p className="font-medium">No sales data available for this period.</p>
                </div>
            ) : (
                <div className="space-y-12 mt-8">
                    {/* Revenue Area Chart */}
                    <div className="w-full">
                        <h3 className="text-sm font-semibold text-gray-700 mb-6">Revenue (৳)</h3>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#B5451B" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#B5451B" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={(val) => `৳${val}`} dx={-10} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Revenue']}
                                        labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#B5451B" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Orders Bar Chart */}
                    <div className="w-full">
                        <h3 className="text-sm font-semibold text-gray-700 mb-6">Orders Volume</h3>
                        <div className="h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={period === 'yearly' ? 60 : period === 'monthly' ? 40 : 20}>
                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} dx={-10} allowDecimals={false} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: any) => [value, 'Orders']}
                                        cursor={{ fill: '#f9fafb' }}
                                        labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}
                                    />
                                    <Bar dataKey="orders" fill="#D4860A" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
