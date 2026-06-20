import type { Metadata } from "next";
import { Barlow, Roboto_Slab } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-body",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rouge Soccer",
  description: "Football roguelike MVP Basic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="it" className={`${barlow.variable} ${robotoSlab.variable}`}>
      <body>{children}</body>
    </html>
  );
}
