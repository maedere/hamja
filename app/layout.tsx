import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "هم‌بام | سفر به شهرها، ماندن در جمع دوستان؛ میزبانی دوطرفه",
  description: "جامعه‌ای امن از میزبانان و مسافران محلی ایرانی برای میزبانی متقابل و سفرهای انسانی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[#F9F8F6] text-[#1F2937] font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
