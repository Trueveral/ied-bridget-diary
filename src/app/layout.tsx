import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StrictMode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bridget's Diary",
  description: "See the diary from a cyropreserved brain. 57 years from now.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StrictMode>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </StrictMode>
  );
}
