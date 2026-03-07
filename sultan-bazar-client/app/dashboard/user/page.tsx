"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/services/auth.services";
import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
// import { useGetWishlistQuery } from "@/redux/api/productApi";
import { ShoppingCart, Heart, Bell, Clock, Loader2 } from "lucide-react";
import { OrdersList } from "@/components/dashboard/OrdersList";
import { TOrder } from "@/types/common";

export default function UserDashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState("");

    const { data: myOrdersData, isLoading: ordersLoading } = useGetMyOrdersQuery({});
    // const { data: wishlistData, isLoading: wishlistLoading } = useGetWishlistQuery({});

    const orders: TOrder[] = Array.isArray(myOrdersData)
        ? myOrdersData
        : Array.isArray(myOrdersData?.data)
            ? myOrdersData.data
            : Array.isArray(myOrdersData?.data?.data)
                ? myOrdersData.data.data
                : [];

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.orderStatus === 'pending').length,
        // wishlist: Array.isArray(wishlistData) ? wishlistData.length : wishlistData?.data?.length || 0
    };

    useEffect(() => {
        const user = getUserInfo();
        if (!user) { router.replace("/login"); return; }
        if (user.role !== "user") { router.replace(`/dashboard/${user.role}`); return; }
        setUserName(user.name || user.username || "there");
    }, [router]);

    if (ordersLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#B5451B" }} />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Page header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hello, {userName} 👋</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your orders and account details here.</p>
                </div>
                <button className="p-2 rounded-xl hover:bg-white text-gray-500 hover:text-gray-700 transition-colors">
                    <Bell className="w-5 h-5" />
                </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                    { label: "Total Orders", value: stats.total, icon: ShoppingCart, color: "#B5451B" },
                    { label: "Pending Delivery", value: stats.pending, icon: Clock, color: "#D4860A" },
                    // { label: "Wishlist Items", value: stats.wishlist, icon: Heart, color: "#e11d48" },
                ].map((c) => (
                    <div key={c.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-gray-500">{c.label}</p>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{ background: c.color + "15" }}>
                                <c.icon className="w-4 h-4" style={{ color: c.color }} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{c.value}</p>
                    </div>
                ))}
            </div>

            {/* Integrated Orders List */}
            <div className="mb-6">
                <OrdersList
                    orders={orders}
                    title="My Orders"
                    description="Track your deliveries and leave reviews for products you've received."
                    showTabs={true}
                />
            </div>
        </div>
    );
}
