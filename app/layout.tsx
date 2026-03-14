import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { clientEnv } from "@/lib/env";
import "./globals.css";

const fontBody = Inter({
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
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_APP_URL),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const useClerk = clientEnv.NEXT_PUBLIC_AUTH_PROVIDER === "clerk";
  const content = (
    <html lang="en" className={`${fontBody.variable} ${fontDisplay.variable}`}>
      <body className="font-[var(--font-body)] antialiased">{children}</body>
    </html>
  );

  if (!useClerk) {
    return content;
  }

  return (
    <ClerkProvider
      signInUrl={clientEnv.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
      signUpUrl={clientEnv.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
      appearance={{
        variables: {
          colorPrimary: "#5E6AD2",
          colorBackground: "#0F0F13",
          colorInputBackground: "#14151D",
          colorText: "#F4F6FA",
        },
      }}
    >
      {content}
    </ClerkProvider>
  );
}
