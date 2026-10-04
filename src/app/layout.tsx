import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JOB UP - แพลตฟอร์มหางานนิสิต มหาวิทยาลัยพะเยา",
  description: "ศูนย์กลางค้นหาและจับคู่งานพาร์ตไทม์ ฟรีแลนซ์ รับหิ้ว รอบ ม.พะเยา",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-100/60 font-sans text-zinc-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

