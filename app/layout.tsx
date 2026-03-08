import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const fontBody = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Pulseboard",
  description: "Premium collaborative work management for fast teams.",
  metadataBase: new URL("http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontBody.variable} ${fontDisplay.variable}`}>
      <body className="font-[var(--font-body)] antialiased">{children}</body>
    </html>
  );
}
