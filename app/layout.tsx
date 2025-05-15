import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { createTables } from "../lib/db";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "South Indian Delights - Restaurant POS",
  description: "A complete POS system for South Indian restaurant management",
  generator: "v0.dev",
};

// Initialize database when app starts
createTables()
  .then(() => console.log("Database tables created successfully"))
  .catch((err) => console.error("Failed to create tables:", err));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
