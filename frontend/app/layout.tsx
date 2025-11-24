import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  title: "SkoolCeria - Sistem Pengurusan Sekolah",
  description: "Sistem Pengurusan Laporan Harian dan Kebersihan Kelas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased font-sans bg-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
