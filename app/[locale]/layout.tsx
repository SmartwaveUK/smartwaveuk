import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/components/providers/cart-provider";
import { PublicLayout } from "@/components/public-layout";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning style={{ backgroundColor: "#dbeafe" }}>
            <body
                className={`${outfit.className} antialiased bg-gradient-to-b from-blue-100 via-blue-50 to-white min-h-screen text-slate-900 font-sans`}
            >
                <NextIntlClientProvider messages={messages}>
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
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
