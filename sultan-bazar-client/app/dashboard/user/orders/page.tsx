"use client";

import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import { OrdersList } from "@/components/dashboard/OrdersList";
import { TOrder } from "@/types/common";

export default function UserOrdersPage() {
    const { data: myOrdersData, isLoading } = useGetMyOrdersQuery(
        {},
        { pollingInterval: 5000 }
    );

    const orders: TOrder[] = Array.isArray(myOrdersData)
        ? myOrdersData
        : Array.isArray(myOrdersData?.data)
            ? myOrdersData.data
            : Array.isArray(myOrdersData?.data?.data)
                ? myOrdersData.data.data
                : [];
    if (isLoading) {
        return (
            <div className="p-6 lg:p-8 flex items-center justify-center min-h-[500px]">
                <div className="text-gray-500 animate-pulse font-medium">Loading your orders...</div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            <OrdersList
                orders={orders}
                title="My Orders"
                description="Track your deliveries and leave reviews for products you've received."
                showTabs={true}
            />
        </div>
    );
}
