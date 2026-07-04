import type { Metadata } from "next";
import { Baloo_2, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-baloo",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Moments — Quatrolympic 19",
  description:
    "Upload dan lihat momen-momen selama Quatrolympic 19. Bagikan foto kamu tanpa perlu login!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${baloo.variable} ${inter.variable} ${spaceMono.variable} font-body text-ink`}
      >
        {children}
      </body>
    </html>
  );
}
