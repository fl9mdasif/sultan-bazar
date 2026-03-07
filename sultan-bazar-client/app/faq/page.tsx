"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search, MessageCircle } from "lucide-react";

const FAQS = [
    {
        question: "How can I track my order?",
        answer: "Once your order is shipped, you will receive a tracking number via email or SMS. You can also track your order in the 'My Orders' section of your dashboard."
    },
    {
        question: "What are your delivery charges?",
        answer: "We offer free delivery for orders above ৳1000. For orders below this amount, a standard shipping charge of ৳60 (inside Dhaka) or ৳120 (outside Dhaka) applies."
    },
    {
        question: "Do you ship internationally?",
        answer: "Currently, we only ship within Bangladesh. We are working on expanding our services to international customers soon."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept Cash on Delivery (COD), bKash, Nagad, and standard Credit/Debit cards."
    },
    {
        question: "Are your products 100% natural?",
        answer: "Yes! All Sultan Bazar products are 100% natural, free from artificial preservatives, colors, or additives. We source directly from trusted farmers."
    },
    {
        question: "How do I return a product?",
        answer: "If you're not satisfied with a product, you can initiate a return within 7 days of delivery. Please refer to our Return Policy page for more details."
    }
];

export default function FAQPage() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-[#FAFAF8] py-16">
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked <span className="text-[#B5451B]">Questions</span></h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions about our products, shipping, returns, and more.
                    </p>

                    <div className="mt-8 relative max-w-lg mx-auto">
                        <input
                            type="text"
                            placeholder="Search for questions..."
                            className="w-full px-6 py-4 rounded-full border border-[#F0E6D3] bg-white shadow-sm outline-none focus:border-[#B5451B] transition-colors"
                        />
                        <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, index) => (activeIndex === index ? (
                        <div key={index} className="bg-white rounded-2xl shadow-sm border border-[#F0E6D3] overflow-hidden focus-within:border-[#B5451B] transition-all duration-300">
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left group"
                            >
                                <span className="font-bold text-gray-900 group-hover:text-[#B5451B] transition-colors">{faq.question}</span>
                                <ChevronUp className="w-5 h-5 text-[#B5451B]" />
                            </button>
                            <div className="px-8 pb-8 text-gray-600 leading-relaxed border-t border-[#FAFAF8] pt-6">
                                {faq.answer}
                            </div>
                        </div>
                    ) : (
                        <div key={index} className="bg-white rounded-2xl shadow-sm border border-[#F0E6D3] overflow-hidden hover:border-orange-200 transition-all duration-300">
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left group"
                            >
                                <span className="font-bold text-gray-900 group-hover:text-[#B5451B] transition-colors">{faq.question}</span>
                                <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#B5451B]" />
                            </button>
                        </div>
                    )))}
                </div>

                <div className="mt-16 bg-[#B5451B] p-10 lg:p-14 rounded-3xl text-white text-center shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <MessageCircle className="w-12 h-12 mx-auto mb-6 text-orange-200" />
                        <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
                        <p className="text-orange-100 mb-8 max-w-lg mx-auto">
                            If you couldn't find the answer you were looking for, don't hesitate to reach out to our support team.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/contact" className="bg-white text-[#B5451B] font-bold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors">
                                Contact Support
                            </a>
                            <a href="https://wa.me/8801711229443" target="_blank" rel="noopener noreferrer" className="bg-transparent border border-white/40 text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
                                Chat on WhatsApp
                            </a>
                        </div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
                </div>
            </div>
        </div>
    );
}
