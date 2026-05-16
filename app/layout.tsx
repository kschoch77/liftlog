import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "LiftLog",
  description: "A simple mobile-first workout tracker.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-dvh w-full max-w-md bg-white pb-24 text-slate-950 shadow-sm">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
