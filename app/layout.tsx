import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "همجا | سفر به شهرها، ماندن در جمع دوستان؛ میزبانی دوطرفه",
  description: "جامعه‌ای امن از میزبانان و مسافران محلی ایرانی برای میزبانی متقابل و سفرهای انسانی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F9F8F6] text-[#1F2937] font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
