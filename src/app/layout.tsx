import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "Risiti Digital Book",
  title: {
    default: "Risiti Digital Book — A fresh page",
    template: "%s | Risiti Digital Book",
  },
  description:
    "Welcome to Risiti Digital Book. A simpler, more thoughtful way forward for your everyday business. Our story is just beginning.",
  appleWebApp: { capable: true, title: "Risiti", statusBarStyle: "default" },
  formatDetection: { telephone: false },
  icons: { apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#1E1A34",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} min-h-full`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
