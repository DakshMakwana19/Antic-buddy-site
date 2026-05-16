import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnticBuddy — Intelligent Product Recognition & Management",
  description: "Built to simplify operations, train teams faster, and eliminate manual confusion. By Tushar Makwana.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
