import Categories from "./Categories";
import FeaturedProducts from "./FeaturedProducts";
import HealthProducts from "./HealthProducts";
import Hero from "./Hero";
import Newsletter from "./Newsletter";
import PromoBanner from "./PromoBanner";
import Reviews from "./Reviews";
import TrustBadges from "./TrustBadges";
import WhyChooseUs from "./WhyChooseUs";

export default function HomeAll() {
    return (
        <>
            {/* 1 ── Hero */}
            <Hero />

            {/* 2 ── Trust Badges strip */}
            <TrustBadges />

            {/* 3 ── Shop by Category */}
            <Categories />

            {/* 4 ── Promo Banner */}
            <PromoBanner />

            {/* 5 ── Best Sellers */}
            <FeaturedProducts />

            {/* 6 ── Why Choose Us */}
            <WhyChooseUs />

            {/* 7 ── Health Products */}
            <HealthProducts />

            {/* 8 ── Customer Reviews */}
            <Reviews />

            {/* 9 ── Newsletter */}
            <Newsletter />
        </>
    )
}