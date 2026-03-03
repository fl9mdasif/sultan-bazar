import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Sultan Bazar — রান্নাঘরের বিশ্বস্ত সঙ্গী",
  description: "100% Natural Spices, Oils & Cooking Essentials from Sultan Bazar. স্বাদে খাঁটি, মানে নিখুঁত।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
