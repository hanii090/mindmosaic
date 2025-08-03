import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootLayoutClient from './RootLayoutClient';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MindMosaic - Your Mind, Gently Heard",
  description: "AI-powered mental health self-check support designed for university students. Get gentle, anonymous guidance when you need it most.",
  keywords: ["mental health", "university students", "AI support", "wellbeing", "self-check"],
  authors: [{ name: "MindMosaic Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0C0C0F",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "MindMosaic - Your Mind, Gently Heard",
    description: "AI-powered mental health self-check support for university students",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindMosaic - Your Mind, Gently Heard",
    description: "AI-powered mental health self-check support for university students",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-inter antialiased min-h-screen`}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
