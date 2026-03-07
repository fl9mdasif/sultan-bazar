import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, MessageSquare } from "lucide-react";

const quickLinks = ["Home", "Products", "About", "Contact"];
const customerService = ["Return Policy", "FAQ", "Privacy Policy"];

export default function Footer() {
    return (
        <footer className="relative text-gray-300">
            {/* Background image */}
            <Image
                src="/images/footer-image.jpg"
                alt="Footer background"
                fill
                className="object-cover object-center"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0" style={{ background: "rgba(10, 5, 2, 0.75)" }} />

            {/* Main grid */}
            <div className="relative z-10 container mx-auto px-4 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Col 1 — Brand */}
                    <div>
                        <Link href="/" className="inline-block mb-4">
                            <div className="relative w-44 h-14">
                                <Image
                                    src="/logo.png"
                                    alt="Sultan Bazar"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                        </Link>
                        <p className="font-bengali text-sm text-gray-400 mb-1">স্বাদে খাঁটি, মানে নিখুঁত</p>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            Your trusted source for 100% natural spices, oils, and cooking essentials. Bringing the best of Bangladesh to your kitchen.
                        </p>

                        <div className="flex gap-4">
                            {[
                                {
                                    icon: <Facebook className="w-5 h-5" />,
                                    label: "Facebook",
                                    href: "https://www.facebook.com/profile.php?id=61581883173632",
                                    hoverColor: "hover:bg-[#1877F2]"
                                },


                                {
                                    icon: <MessageSquare className="w-5 h-5" />,
                                    label: "WhatsApp",
                                    href: "https://wa.me/8801711229443",
                                    hoverColor: "hover:bg-[#25D366]"
                                },
                            ].map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 text-gray-400 hover:text-white transition-all duration-300 shadow-lg ${s.hoverColor} hover:border-transparent hover:scale-110`}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 2 — Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link}>
                                    <Link
                                        href={`/${link.toLowerCase().replace(" ", "-")}`}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 — Customer Service */}
                    <div>
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                            Customer Service
                        </h3>
                        <Link className="text-sm text-gray-400 hover:text-white transition-colors space-y-2.5"
                            href="/dashboard/user">My Orders</Link>

                        <ul className="space-y-2.5">
                            {customerService.map((item: any) => (
                                <li key={item}>
                                    <Link
                                        href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                    </div>

                    {/* Col 4 — Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                            Contact Us
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3 text-gray-400">
                                <span className="text-base mt-0.5">📍</span>
                                <span>house 26, road 03, PC culture housing societ, Mohammedpur, Dhaka 1216, Banlgladesh</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <span>📞</span>
                                <a href="tel:+8801711229443" className="hover:text-white transition-colors">
                                    +880 1711-229443
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <span>📧</span>
                                <a href="mailto:asr.globaltrade.bd@gmail.com" className="hover:text-white transition-colors">
                                    asr.globaltrade.bd@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <span>⏰</span>
                                <span>Sat–Thu: 9am – 9pm</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="relative z-10 border-t border-gray-700/50 bg-black/20">
                <div className="container mx-auto px-4 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        © 2026 Sultan Bazar. All rights reserved.
                    </p>
                    {/* Payment icons */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 mr-1">We accept:</span>
                        {["💳 bKash", "💰 Nagad", "🏦 Cash on Delivery"].map((p) => (
                            <span
                                key={p}
                                className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-gray-400"
                            >
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
