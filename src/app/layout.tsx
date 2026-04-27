import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "OTR Portfolios — Live Basketball Portfolios for Players",
    template: "%s | OTR Portfolios",
  },
  description:
    "Professional live web portfolios for basketball players. Built to pitch college coaches, pro agencies, and brand sponsors.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "OTR Portfolios",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-neutral-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
