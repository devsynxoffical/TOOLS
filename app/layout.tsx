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
    default: "GroupBuy Tools | Agency-Grade SEO Access",
    template: "%s | GroupBuy Tools",
  },
  description:
    "Access Ahrefs, Semrush, Moz, and more through one affordable group buy subscription.",
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
