import type { Metadata } from "next";
import { Geist } from "next/font/google";
import LayoutClient from "./layout.client";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Coffee Shop CMS",
  description: "Sistem manajemen Coffee Shop — menu, meja, dan pesanan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`dark ${geist.variable} h-full`} style={{ colorScheme: "dark" }}>
      <body className="min-h-full bg-background text-foreground antialiased flex flex-col font-sans">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
