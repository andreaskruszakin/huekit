import type { Metadata } from "next";
import { HueKitRoot } from "@/components/huekit/HueKitRoot";
import "./globals.css";

export const metadata: Metadata = {
  title: "HueKit",
  description: "DialKit for colors — live CSS variable tuning",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh" style={{ background: "var(--hue-surface)" }}>
        {children}
        <HueKitRoot />
      </body>
    </html>
  );
}
