import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/components/providers/cart-provider";
import { PublicLayout } from "@/components/public-layout";
import "./globals.css";
import { Suspense } from "react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "SmartWaveUk",
  description: "Premium gadgets at affordable prices.",
};

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ backgroundColor: "#dbeafe" }}>
      <body className={`${outfit.className} antialiased bg-gradient-to-b from-blue-100 via-blue-50 to-white min-h-screen text-slate-900`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
          disableTransitionOnChange
        >
          <CartProvider>
            <PublicLayout>
              {children}
            </PublicLayout>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
