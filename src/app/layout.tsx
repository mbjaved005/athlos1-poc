"use client";
export const dynamic = "force-dynamic";
import { Geist, Geist_Mono } from "next/font/google";
import NextAuthSessionProvider from "./SessionProvider";
import LoaderTransition from "./LoaderTransition";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthSessionProvider>
          <LoaderTransition />
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
