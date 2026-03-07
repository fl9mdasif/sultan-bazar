import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import StoreProvider from "@/redux/StoreProvider";
import { Toaster } from "sonner";

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
    <html lang="bn" suppressHydrationWarning>
      <body className="antialiased">
        <StoreProvider>
          <Navbar />
          <Toaster position="top-right" richColors />
          <main>{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
