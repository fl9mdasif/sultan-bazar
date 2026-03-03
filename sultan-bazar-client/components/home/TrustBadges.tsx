const badges = [
    { icon: "🌿", title: "100% Natural Ingredients", sub: "Farm to table freshness" },
    { icon: "🚚", title: "Fast Home Delivery", sub: "2–4 days across Bangladesh" },
    { icon: "✅", title: "Quality Guaranteed", sub: "Tested & certified products" },
    { icon: "💰", title: "Best Price Promise", sub: "Directly from source" },
];

export default function TrustBadges() {
    return (
        <div
            className="w-full py-4"
            style={{ background: "linear-gradient(90deg, #B5451B, #D4860A, #B5451B)" }}
        >
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-0">
                    {badges.map((b, i) => (
                        <div
                            key={b.title}
                            className={`flex items-center gap-3 justify-center py-1 ${i < badges.length - 1 ? "lg:border-r lg:border-white/20" : ""
                                }`}
                        >
                            <span className="text-2xl">{b.icon}</span>
                            <div className="text-white">
                                <p className="font-semibold text-sm leading-tight">{b.title}</p>
                                <p className="text-white/70 text-xs">{b.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
