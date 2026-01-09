import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { BottomNav } from "@/components/bottom-nav";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Suspense } from "react";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Phone Broker Platform",
  description: "Premium smartphones at broker prices.",
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
          <Suspense fallback={<div className="h-16 w-full bg-background/80 border-b" />}>
            <Navbar />
          </Suspense>
          {children}
          <Suspense fallback={null}>
            <BottomNav />
          </Suspense>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
