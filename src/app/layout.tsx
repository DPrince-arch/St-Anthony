import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "St. Anthony Catholic Church | Parish App & Liturgy",
  description: "Official parish application for St. Anthony Catholic Church. Access daily readings, prayers, Rosary, Mass bookings, and announcements.",
  manifest: "/manifest.json",
  icons: {
    icon: "/church-icon.svg",
    apple: "/church-icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "St. Anthony Church",
  },
};

export const viewport: Viewport = {
  themeColor: "#8b1d24",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}
