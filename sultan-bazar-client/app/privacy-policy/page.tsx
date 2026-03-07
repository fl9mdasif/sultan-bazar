"use client";

import { ShieldCheck, Eye, Lock, Globe } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF8] py-16">
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                <div className="text-center mb-16">
                    <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-[#B5451B]" />
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy <span className="text-[#B5451B]">Policy</span></h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                    </p>
                </div>

                <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-sm border border-[#F0E6D3] space-y-12">
                    {/* Section 1 */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-50 rounded-xl">
                                <Eye className="w-6 h-6 text-[#B5451B]" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                We collect information you provide directly to us when you create an account, place an order, or contact our support team. This may include:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Name, email address, and phone number.</li>
                                <li>Shipping and billing addresses.</li>
                                <li>Payment information (processed securely through our payment gateways).</li>
                                <li>Order history and communication logs.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-50 rounded-xl">
                                <Globe className="w-6 h-6 text-[#B5451B]" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                We use the information we collect to provide, maintain, and improve our services, including:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Processing and fulfilling your orders.</li>
                                <li>Communicating with you about your orders, products, and promotions.</li>
                                <li>Improving our website and shopping experience.</li>
                                <li>Protecting against fraudulent or illegal activity.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-50 rounded-xl">
                                <Lock className="w-6 h-6 text-[#B5451B]" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Security of Your Data</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                We take the security of your personal information seriously and use industry-standard measures to protect it. All payment transactions are encrypted and processed through secure third-party gateways. We do not store your credit card details on our servers.
                            </p>
                            <p>
                                While we strive to protect your data, no method of transmission over the internet or electronic storage is 100% secure. Therefore, we cannot guarantee its absolute security.
                            </p>
                        </div>
                    </section>

                    {/* Contact Section */}
                    <div className="mt-16 p-8 bg-[#FAFAF8] rounded-2xl border border-[#F0E6D3] text-center">
                        <h3 className="font-bold text-gray-900 mb-2">Have questions about your privacy?</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            If you have any questions or concerns about our privacy policy, please contact our data protection officer.
                        </p>
                        <a href="mailto:asr.globaltrade.bd@gmail.com" className="bg-[#B5451B] text-white font-bold px-8 py-3 rounded-full hover:bg-[#9a3915] transition-colors">
                            Contact Us
                        </a>
                    </div>
                </div>

                <div className="mt-12 text-center text-xs text-gray-400">
                    Last updated: October 2026. Sultan Bazar (ASR Global Trade) — All rights reserved.
                </div>
            </div>
        </div>
    );
}
