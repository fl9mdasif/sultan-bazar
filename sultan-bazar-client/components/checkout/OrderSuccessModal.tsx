"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Home, ShoppingBag, LayoutDashboard, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";

interface OrderSuccessModalProps {
    isOpen: boolean;
    orderItems: any[];
    totalPrice: number;
}

export default function OrderSuccessModal({ isOpen, orderItems, totalPrice }: OrderSuccessModalProps) {
    useEffect(() => {
        if (isOpen) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" />
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-orange-100">
                <div className="p-8 md:p-12 text-center">
                    {/* Success Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
                            <CheckCircle className="w-12 h-12 text-green-500 relative z-10" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                        Order Success! 🎉
                    </h2>
                    <p className="text-gray-500 font-medium mb-8">
                        Congratulations! Your sultan treasures have been secured and are being prepared.
                    </p>

                    {/* Order Highlights */}
                    <div className="bg-orange-50/50 rounded-3xl p-6 mb-10 border border-orange-100/50">
                        <div className="space-y-3 mb-4">
                            {orderItems.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 font-medium truncate pr-4">
                                        {item.product?.name || "Product"}
                                    </span>
                                    <span className="text-gray-900 font-bold flex-shrink-0">
                                        ×{item.quantity}
                                    </span>
                                </div>
                            ))}
                            {orderItems.length > 2 && (
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-left">
                                    + {orderItems.length - 2} more items
                                </p>
                            )}
                        </div>
                        <div className="pt-4 border-t border-orange-100 flex justify-between items-center">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
                            <span className="text-xl font-black text-[#B5451B]">৳{totalPrice}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link href="/" className="block">
                            <Button className="w-full h-14 rounded-2xl bg-[#B5451B] hover:bg-[#8e3515] text-white font-bold text-lg transition-all shadow-lg shadow-[#B5451B]/20">
                                <Home className="w-5 h-5 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/products">
                                <Button variant="outline" className="w-full h-14 rounded-2xl border-orange-100 text-gray-700 hover:bg-orange-50 font-bold transition-all">
                                    <ShoppingBag className="w-5 h-5 mr-2" />
                                    Products
                                </Button>
                            </Link>
                            <Link href="/dashboard/user/orders">
                                <Button variant="outline" className="w-full h-14 rounded-2xl border-orange-100 text-gray-700 hover:bg-orange-50 font-bold transition-all">
                                    <LayoutDashboard className="w-5 h-5 mr-2" />
                                    Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Decor */}
                <div className="h-2 bg-gradient-to-r from-transparent via-[#B5451B]/20 to-transparent" />
            </div>
        </div>
    );
}
