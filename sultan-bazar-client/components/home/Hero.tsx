import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
    return (
        <section
            className="relative overflow-hidden"
            style={{
                background: "linear-gradient(135deg, #FDF6EC 0%, #FEF3CD 40%, #FCE8C3 100%)",
                minHeight: "580px",
            }}
        >
            {/* Decorative spice dots background */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, #B5451B 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    {/* Left content */}
                    <div className="flex-1 text-center lg:text-left space-y-6 z-10">
                        {/* Slogan badge */}
                        <span
                            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full"
                            style={{
                                background: "#B5451B18",
                                color: "#B5451B",
                                border: "1px solid #B5451B40",
                            }}
                        >
                            🌿 স্বাদে খাঁটি, মানে নিখুঁত
                        </span>

                        {/* Headline */}
                        <h1
                            className="font-bengali text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                            style={{ color: "#1a1a1a" }}
                        >
                            রান্নাঘরের{" "}
                            <span style={{ color: "#B5451B" }}>বিশ্বস্ত</span>
                            <br />
                            সঙ্গী
                        </h1>

                        {/* Sub-headline */}
                        <p className="text-lg md:text-xl text-gray-600 font-medium max-w-md mx-auto lg:mx-0">
                            100% Natural Spices, Oils &amp; Cooking Essentials
                            <br />
                            <span className="text-base text-gray-500">
                                Sourced from the finest farms across Bangladesh
                            </span>
                        </p>

                        {/* CTA buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                            <Link href="/products">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:opacity-90 transition-all hover:shadow-xl text-base"
                                    style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)" }}
                                >
                                    🛒 Shop Now
                                </Button>
                            </Link>
                            <Link href="/categories">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto font-semibold px-8 py-3 rounded-full text-base hover:bg-orange-50 transition-all"
                                    style={{ borderColor: "#B5451B", color: "#B5451B" }}
                                >
                                    View Categories →
                                </Button>
                            </Link>
                        </div>

                        {/* Mini stats */}
                        <div className="flex gap-6 justify-center lg:justify-start pt-2">
                            {[
                                { num: "500+", label: "Products" },
                                { num: "10K+", label: "Happy Customers" },
                                { num: "5★", label: "Avg Rating" },
                            ].map((s) => (
                                <div key={s.label} className="text-center">
                                    <p className="font-bold text-xl" style={{ color: "#B5451B" }}>
                                        {s.num}
                                    </p>
                                    <p className="text-xs text-gray-500">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Hero image */}
                    <div className="flex-1 flex justify-center lg:justify-end z-10 w-full max-w-lg lg:max-w-none">
                        <div
                            className="relative w-full max-w-[500px] aspect-square rounded-3xl overflow-hidden shadow-2xl"
                            style={{
                                background: "linear-gradient(135deg, #D4860A20, #B5451B10)",
                            }}
                        >
                            <Image
                                src="/hero-spices.png"
                                alt="Fresh spices and mustard oil — Sultan Bazar"
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Floating badge */}
                            <div
                                className="absolute top-4 right-4 bg-white rounded-2xl py-2 px-3 shadow-lg flex items-center gap-2"
                            >
                                <span className="text-xl">🌿</span>
                                <div>
                                    <p className="text-xs font-bold" style={{ color: "#B5451B" }}>
                                        100% Natural
                                    </p>
                                    <p className="text-[10px] text-gray-500">No Preservatives</p>
                                </div>
                            </div>
                            <div
                                className="absolute bottom-4 left-4 bg-white rounded-2xl py-2 px-3 shadow-lg flex items-center gap-2"
                            >
                                <span className="text-xl">🚚</span>
                                <div>
                                    <p className="text-xs font-bold text-gray-800">Fast Delivery</p>
                                    <p className="text-[10px] text-gray-500">2–4 days nationwide</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
