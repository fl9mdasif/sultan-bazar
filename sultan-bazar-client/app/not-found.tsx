"use client";
import Link from "next/link";
import { Home, Phone, Mail, MapPin, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
            <div className="max-w-3xl w-full text-center">
                {/* 404 Large Text */}
                <div className="relative mb-8">
                    <h1 className="text-[120px] md:text-[180px] font-black text-gray-100 select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-[#B5451B] text-white px-6 py-2 rounded-full text-lg md:text-xl font-bold shadow-xl rotate-3">
                            Page Not Found
                        </div>
                    </div>
                </div>

                {/* Sultan Bazar Branding */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-bengali">
                    সুলতান বাজার — স্বাদে খাঁটি, মানে নিখুঁত
                </h2>
                <p className="text-gray-600 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                    Oops! The page you are looking for doesn&apos;t exist or has been moved. 
                    Your trusted source for 100% natural spices, oils, and cooking essentials is still here!
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Link
                        href="/"
                        className="flex items-center gap-2 bg-[#B5451B] hover:bg-[#8e3515] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-[#B5451B]/20 hover:-translate-y-1 w-full sm:w-auto"
                    >
                        <Home className="w-5 h-5" />
                        Go Back Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 bg-white border-2 border-gray-100 hover:border-[#B5451B] text-gray-700 hover:text-[#B5451B] px-8 py-4 rounded-2xl font-bold transition-all w-full sm:w-auto"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Previous Page
                    </button>
                </div>

                {/* Sultan Bazar Info Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/50 p-8 rounded-3xl border border-gray-100 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#B5451B]">
                            <Phone className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-800">+880 1711-229443</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#B5451B]">
                            <Mail className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-800">asr.globaltrade.bd@gmail.com</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#B5451B]">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-800 text-center">Mohammedpur, Dhaka, Bangladesh</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
