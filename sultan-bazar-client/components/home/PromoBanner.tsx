export default function PromoBanner() {
    return (
        <div
            className="shimmer relative w-full py-4 text-white overflow-hidden"
            style={{ background: "#B5451B" }}
        >
            <div className="flex items-center justify-center gap-4 px-4 text-center">
                <span className="text-xl">🎉</span>
                <p className="text-sm md:text-base font-semibold tracking-wide">
                    Free Delivery on orders above{" "}
                    <span className="font-extrabold text-yellow-300">৳1,000</span>{" "}
                    &nbsp;·&nbsp; Use code{" "}
                    <span className="font-extrabold text-yellow-300">SULTAN10</span>{" "}
                    for 10% off your first order!
                </p>
                <span className="text-xl">🌿</span>
            </div>
        </div>
    );
}
