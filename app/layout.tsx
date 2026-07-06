import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { HueKitRoot } from "@/components/huekit/HueKitRoot";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HueKit",
  description: "DialKit for colors — copy components/huekit into your Next.js app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-dvh antialiased`} style={{ background: "var(--hue-surface)" }}>
        {children}
        <HueKitRoot />
      </body>
    </html>
  );
}
