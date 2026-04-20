"use client";

import { X, Package, Calendar, MapPin, CreditCard, Clock, Printer, ChevronRight } from "lucide-react";
import Image from "next/image";
import type { TOrder, TOrderStatus, TPaymentStatus } from "@/types/common";

// ── Helpers ─────────────────────────────────────────────────────────────
export const STATUS_COLORS: Record<TOrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    processing: "bg-purple-100 text-purple-800 border-purple-200",
    shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    returned: "bg-gray-100 text-gray-800 border-gray-200",
};

export const PAYMENT_STATUS_COLORS: Record<TPaymentStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    paid: "bg-green-100 text-green-800 border-green-200",
    failed: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-gray-100 text-gray-800 border-gray-200",
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// ── Order Details Modal ──────────────────────────────────────────────────────
export function OrderDetailsModal({
    open,
    onClose,
    order,
}: {
    open: boolean;
    onClose: () => void;
    order: TOrder | null;
}) {
    if (!open || !order) return null;

    return (
        <>
            {/* ─── Global Print Styles ─── */}
            <style jsx global>{`
                @media print {
                    /* Hide EVERYTHING on the page by default */
                    body > * {
                        display: none !important;
                    }
                    /* Show only our print container */
                    body > .print-only-invoice {
                        display: block !important;
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        background: white !important;
                        visibility: visible !important;
                    }
                    @page {
                        size: portrait;
                        margin: 15mm;
                    }
                    /* Ensure colors and backgrounds print */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>

            {/* ─── Print-Only Invoice (Hidden on screen) ─── */}
            <div className="hidden print:block print-only-invoice font-sans bg-white p-4">
                <div className="max-w-[800px] mx-auto border border-gray-100 p-8 shadow-sm">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-orange-600 pb-8 mb-8">
                        <div>
                            <h1 className="text-4xl font-black text-orange-600 tracking-tighter">SULTAN BAZAR</h1>
                            <p className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-[0.2em]">Quality is our Identity</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-3xl font-black text-gray-900">INVOICE</h2>
                            <p className="text-sm font-bold text-gray-600 mt-2 uppercase">ID: <span className="text-black">{order.orderNumber}</span></p>
                            <p className="text-xs font-medium text-gray-400 mt-1">{formatDate(order.createdAt || new Date().toISOString())}</p>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-10 mb-10">
                        <div className="bg-gray-50 p-6 rounded-2xl">
                            <h3 className="text-[10px] font-black uppercase text-orange-600 mb-4 tracking-widest border-b border-orange-100 pb-1 inline-block">Billed To</h3>
                            <p className="font-bold text-gray-900 text-lg uppercase">{order.shippingAddress.fullName}</p>
                            <p className="text-gray-700 font-bold mt-1">{order.shippingAddress.phone}</p>
                            <p className="text-gray-500 text-sm mt-1">{order.user?.email || "customer@sultanbazar.com"}</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-[10px] font-black uppercase text-orange-600 mb-4 tracking-widest border-b border-orange-100 pb-1 inline-block">Shipping Address</h3>
                            <p className="text-gray-800 font-medium leading-relaxed">
                                {order.shippingAddress.address}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.district}<br />
                                Bangladesh - {order.shippingAddress.postalCode}
                            </p>
                        </div>
                    </div>

                    {/* Table */}
                    <table className="w-full text-left border-collapse mb-10">
                        <thead>
                            <tr className="bg-orange-600 text-white rounded-t-lg">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest rounded-tl-lg">Item Description</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-center">Qty</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-right">Price</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-right rounded-tr-lg">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 border-x border-b border-gray-100">
                            {order.items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-5">
                                        <p className="font-bold text-gray-900 text-lg uppercase">{(item.product as any)?.name || item.variant?.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">SKU: {item.variant.sku} | {item.variant.name}</p>
                                    </td>
                                    <td className="px-6 py-5 text-center font-black text-gray-900 text-lg">{item.quantity}</td>
                                    <td className="px-6 py-5 text-right font-medium text-gray-600">৳{item.variant.price}</td>
                                    <td className="px-6 py-5 text-right font-black text-gray-900 text-lg">৳{item.totalPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Footer / Summary */}
                    <div className="flex justify-between items-end">
                        <div className="space-y-3">
                            <div className="flex gap-2 items-center">
                                <span className={`w-3 h-3 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Payment: {order.paymentStatus}</span>
                            </div>
                            <p className="text-sm font-bold text-gray-700 uppercase">Method: <span className="text-orange-600">{order.paymentMethod}</span></p>
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Authorized Sultan Bazar Stamp</p>
                                <div className="h-12 w-32 mt-2 bg-gray-50 border border-dashed border-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm space-y-4">
                            <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>৳{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-gray-500 border-b border-gray-100 pb-4 uppercase tracking-widest">
                                <span>Shipping Charge</span>
                                <span>৳{order.shippingCharge}</span>
                            </div>
                            {(order.discount ?? 0) > 0 && (
                                <div className="flex justify-between text-sm font-black text-green-600 uppercase tracking-widest">
                                    <span>Discount Applied</span>
                                    <span>-৳{order.discount}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center bg-orange-600 text-white p-6 rounded-2xl shadow-xl shadow-orange-100">
                                <span className="text-xs font-black uppercase tracking-[0.2em]">Grand Total</span>
                                <span className="text-3xl font-black tracking-tighter">৳{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 pt-10 border-t border-gray-100 text-center">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Thank you for buying from Sultan Bazar</p>
                    </div>
                </div>
            </div>

            {/* ─── Screen Modal (Screen Only) ─── */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md no-print">
                <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-white/20">
                    {/* Premium Header */}
                    <div className="relative bg-gray-900 px-8 py-6 text-white shrink-0">
                        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-orange-600/20 to-transparent pointer-events-none"></div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-black tracking-tight uppercase">Order Details</h2>
                                    <span className="bg-white/10 text-white/60 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] border border-white/5">#{order.orderNumber}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-white/50">
                                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(order.createdAt || new Date().toISOString())}</span>
                                    <span className="flex items-center gap-1.5 uppercase tracking-widest"><CreditCard className="w-3.5 h-3.5" /> {order.paymentMethod}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 self-end sm:self-auto">
                                {/* <button
                                    onClick={handlePrint}
                                    className="group flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 active:scale-95 font-black text-xs uppercase tracking-widest"
                                >
                                    <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    Print Invoice
                                </button> */}
                                <button
                                    onClick={onClose}
                                    className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-white transition-all border border-white/10"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Scrollable */}
                    <div className="overflow-y-auto flex-1 p-8 bg-gray-50/30">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left: Items & Timeline */}
                            <div className="lg:col-span-8 space-y-8">
                                {/* Product Section */}
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                                <Package className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Products Summary</h3>
                                        </div>
                                        <span className="text-xs font-black text-orange-600 bg-orange-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-orange-100">{order.items.length} Units</span>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="group p-6 flex items-center gap-6 hover:bg-gray-50/50 transition-colors">
                                                <div className="relative w-24 h-24 rounded-2xl bg-gray-100 border border-gray-100 overflow-hidden shrink-0 shadow-sm">
                                                    {(item.product as any)?.thumbnail ? (
                                                        <Image
                                                            src={(item.product as any).thumbnail}
                                                            alt={(item.product as any)?.name || item.variant?.name || "Product"}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center"><Package className="w-10 h-10 text-gray-300" /></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-black text-gray-900 text-lg uppercase tracking-tight truncate leading-tight transition-colors group-hover:text-orange-600">
                                                        {(item.product as any)?.name || item.variant?.name || "Premium Product"}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-md uppercase tracking-widest border border-gray-100">SKU: {item.variant.sku}</span>
                                                        <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-md uppercase tracking-widest border border-orange-100">{item.variant.name}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="font-black text-gray-900 text-xl tracking-tighter">৳{item.totalPrice}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{item.quantity} × ৳{item.variant.price}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-200 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                                    <h3 className="font-black text-gray-900 mb-8 flex items-center gap-3 uppercase tracking-widest text-sm">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-blue-600" />
                                        </div>
                                        Order Progression
                                    </h3>
                                    <div className="space-y-8 relative ml-4">
                                        <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-orange-600 via-gray-100 to-gray-50"></div>
                                        {order.statusHistory.map((history, idx) => (
                                            <div key={idx} className="flex gap-8 relative items-start">
                                                <div className={`w-3 h-3 rounded-full -ml-[6px] mt-1.5 ring-4 ring-white shadow-sm z-10 ${idx === 0 ? "bg-orange-600 scale-125 shadow-orange-600/20" : "bg-gray-300"}`}></div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className={`font-black uppercase text-xs tracking-[0.15em] ${idx === 0 ? "text-orange-600" : "text-gray-400"}`}>{history.status}</p>
                                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{formatDate(history.changedAt || new Date().toISOString())}</span>
                                                    </div>
                                                    {history.note && (
                                                        <div className="mt-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 text-sm text-gray-600 italic">
                                                            {history.note}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Customer & Payments */}
                            <div className="lg:col-span-4 space-y-8">
                                {/* Customer Card */}
                                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                    <h3 className="font-black uppercase tracking-[0.2em] text-[10px] text-white/40 mb-6 flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5" /> Ship To
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-2xl font-black tracking-tight leading-none uppercase">{order.shippingAddress.fullName}</p>
                                            <p className="text-orange-500 font-black text-sm mt-2 tracking-widest">{order.shippingAddress.phone}</p>
                                        </div>
                                        <div className="pt-6 border-t border-white/10">
                                            <p className="text-white/70 text-sm leading-relaxed font-medium">
                                                {order.shippingAddress.address}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{order.shippingAddress.city}</span>
                                                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{order.shippingAddress.district}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Summary */}
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                                    <h3 className="font-black text-gray-900 mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-orange-600" />
                                        </div>
                                        Order Totals
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gateway</span>
                                            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{order.paymentMethod}</span>
                                        </div>

                                        <div className="space-y-3 px-2">
                                            <div className="flex justify-between text-sm font-bold text-gray-500">
                                                <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                                                <span className="text-gray-900 font-black">৳{order.subtotal}</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-bold text-gray-500 border-b border-gray-50 pb-3">
                                                <span className="uppercase tracking-widest text-[10px]">Shipping</span>
                                                <span className="text-gray-900 font-black">৳{order.shippingCharge}</span>
                                            </div>
                                            {(order.discount ?? 0) > 0 && (
                                                <div className="flex justify-between text-sm font-black text-green-600 bg-green-50/50 p-2 rounded-lg">
                                                    <span className="uppercase tracking-widest text-[10px]">Discount</span>
                                                    <span>-৳{order.discount}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-8 bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-[2rem] text-white shadow-xl shadow-gray-900/20 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-orange-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Total Amount</p>
                                            <div className="flex items-baseline justify-between gap-1">
                                                <span className="text-4xl font-black tracking-tighter">৳{order.totalAmount}</span>

                                                {/* payment status */}

                                                {/* <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border border-white/10 ${order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-orange-500/20 text-orange-400 border-orange-500/20'}`}>{order.paymentStatus}</span> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
