import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import StoreProvider from "@/redux/StoreProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Sultan Bazar — সুলতান বাজার | রান্নাঘরের বিশ্বস্ত সঙ্গী",
    template: "%s | Sultan Bazar"
  },
  description: "সুলতান বাজার থেকে ১০০% প্রাকৃতিক মশলা, খাঁটি তেল এবং রান্নার প্রয়োজনীয় পণ্য কিনুন। স্বাদে খাঁটি, মানে নিখুঁত। 100% Natural Spices, Oils & Cooking Essentials from Sultan Bazar.",
  keywords: [
    "Sultan Bazar", "সুলতান বাজার", "প্রাকৃতিক মশলা", "Natural Spices", 
    "খাঁটি সরিষার তেল", "Mustard Oil", "রান্নার উপকরণ", "Cooking Essentials", 
    "Pure Food Bangladesh", "Organic Food Dhaka", "ASR Global Trade"
  ],
  authors: [{ name: "Sultan Bazar" }],
  creator: "Sultan Bazar",
  publisher: "Sultan Bazar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Sultan Bazar — রান্নাঘরের বিশ্বস্ত সঙ্গী",
    description: "১০০% প্রাকৃতিক মশলা, খাঁটি তেল এবং রান্নার প্রয়োজনীয় পণ্য। স্বাদে খাঁটি, মানে নিখুঁত।",
    url: "https://sultanbazar.com.bd", // Replace with actual domain if known, or leave generic
    siteName: "Sultan Bazar",
    images: [
      {
        url: "/images/parallax-full-width.jpg",
        width: 1200,
        height: 630,
        alt: "Sultan Bazar - Natural Spices and Cooking Essentials",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sultan Bazar — রান্নাঘরের বিশ্বস্ত সঙ্গী",
    description: "১০০% প্রাকৃতিক মশলা, খাঁটি তেল এবং রান্নার প্রয়োজনীয় পণ্য। স্বাদে খাঁটি, মানে নিখুঁত।",
    images: ["/images/parallax-full-width.jpg"],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <StoreProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster position="bottom-right" richColors />
        </StoreProvider>
      </body>
    </html>
  );
}
