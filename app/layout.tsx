import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { NavigationProgress } from "@/components/ui/NavigationProgress";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rankmora | Premium SEO Tools for 1–30 Days",
    template: "%s | Rankmora",
  },
  description:
    "Access Semrush, Moz, SpyFu, Majestic, Ahrefs, and more with flexible 1-day, 3-day, 7-day, or 30-day access. Pay in PKR on Rankmora.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    shortcut: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="preload"
          href="/fonts/material-symbols-outlined.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        <NavigationProgress />
        {children}
      </body>
    </html>
  );
}
