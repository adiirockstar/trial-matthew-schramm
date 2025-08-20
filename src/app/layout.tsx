import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matthew's Codex - Personal Knowledge Assistant",
  description: "A personal knowledge assistant that helps you learn about Matthew's skills, experience, and values through natural conversation.",
  keywords: ["personal", "knowledge", "assistant", "portfolio", "resume", "chat"],
  authors: [{ name: "Matthew Schramm" }],
  openGraph: {
    title: "Matthew's Codex - Personal Knowledge Assistant",
    description: "A personal knowledge assistant that helps you learn about Matthew's skills, experience, and values through natural conversation.",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
