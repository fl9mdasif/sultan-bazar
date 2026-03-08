"use client";

import { useState } from "react";
import {
    ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useGetSalesAnalyticsQuery } from "@/redux/api/orderApi";
import { Loader2, TrendingUp } from "lucide-react";

export default function SalesChart() {
    const [period, setPeriod] = useState<"daily" | "monthly" | "yearly">("monthly");
    const { data, isLoading } = useGetSalesAnalyticsQuery(period);

    // console.log("Sales Data", data);
    const chartData = data || [];

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#B5451B]" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm h-full">
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
                <div className="mt-8">
                    {/* Revenue & Orders Composed Chart */}
                    <div className="w-full">
                        <div className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#B5451B" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#B5451B" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={(val) => `৳${val}`} dx={-10} />
                                    <YAxis yAxisId="right" orientation="right" allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} dx={10} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: any, name: any) => {
                                            if (name === 'revenue') return [`৳${Number(value).toLocaleString()}`, 'Revenue'];
                                            if (name === 'orders') return [value, 'Orders'];
                                            return [value, name || ""];
                                        }}
                                        labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}
                                    />
                                    <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#B5451B" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#D4860A" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
