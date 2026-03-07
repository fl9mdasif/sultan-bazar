"use client";

import { RefreshCcw, ShieldCheck, Clock, CheckCircle } from "lucide-react";

const POLICIES = [
    {
        icon: <Clock className="w-8 h-8 text-[#B5451B]" />,
        title: "7-Day Return Window",
        description: "You have 7 days from the date of delivery to request a return for eligible products."
    },
    {
        icon: <RefreshCcw className="w-8 h-8 text-[#B5451B]" />,
        title: "Easy Exchanges",
        description: "Received the wrong item or a damaged product? We'll exchange it for you free of charge."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-[#B5451B]" />,
        title: "Full Refunds",
        description: "If an item is out of stock or cannot be replaced, we provide a 100% refund to your original payment method."
    }
];

export default function ReturnPolicyPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF8] py-16">
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Return <span className="text-[#B5451B]">Policy</span></h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        At Sultan Bazar, we strive to ensure your complete satisfaction. If you're not happy with your purchase, we're here to help.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {POLICIES.map((policy, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-[#F0E6D3] text-center">
                            <div className="mb-4 inline-block p-3 bg-orange-50 rounded-xl">
                                {policy.icon}
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{policy.title}</h3>
                            <p className="text-sm text-gray-500">{policy.description}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-sm border border-[#F0E6D3]">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Conditions for Returns</h2>
                    <ul className="space-y-4">
                        {[
                            "The product must be unused, unwashed, and in the same condition as received.",
                            "The product must be in its original packaging with all tags intact.",
                            "Perishable goods (like certain spices or oils) can only be returned if they are damaged or expired upon delivery.",
                            "Proof of purchase (order number or invoice) must be provided."
                        ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-gray-600">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">How to Initiate a Return</h2>
                    <div className="space-y-6 text-gray-600">
                        <p>
                            To start a return, please contact our customer support team at <a href="mailto:asr.globaltrade.bd@gmail.com" className="text-[#B5451B] font-semibold underline">asr.globaltrade.bd@gmail.com</a> or call us at <span className="text-[#B5451B] font-semibold">+880 1711-229443</span>.
                        </p>
                        <p>
                            Once your return request is approved, we will provide instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
                        </p>
                    </div>

                    <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500 italic">
                            * Please note that shipping costs for returns are the responsibility of the customer unless the product was damaged or incorrect upon delivery. Refund processing may take 5-10 business days.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
