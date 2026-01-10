"use client";

import { Link } from "@/i18n/routing";
import { Search, ShoppingBag, User } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { HugeiconsIcon } from '@hugeicons/react';
import { ShoppingBasket03Icon, UserIcon } from '@hugeicons/core-free-icons';
import { useCart } from "@/components/providers/cart-provider";
import { useTranslations } from "next-intl";


export function Navbar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const { itemCount } = useCart();
    const t = useTranslations("StoreDashboard");

    return (
        <header className="hidden md:block sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-12">
                {/* Logo */}
                <Link href="/" className="text-transparent bg-clip-text font-bold text-2xl tracking-tight" style={{
                    backgroundImage: "linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                }}>
                    Smart<span className="">waveUK</span>
                </Link>

                {/* Navigation Links */}
                {/* <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/" className="hover:text-foreground transition-colors">
                        Home
                    </Link>
                    <Link href="/shop" className="hover:text-foreground transition-colors">
                        All Phones
                    </Link>
                    <Link href="#" className="hover:text-foreground transition-colors">
                        Sell with Us
                    </Link>
                    <Link href="#" className="hover:text-foreground transition-colors">
                        Support
                    </Link>
                </nav> */}

                <div className="relative w-full bg-white rounded-full border border-slate-400">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder={t('searchPlaceholder')}
                        defaultValue={searchParams.get("q") || ""}
                        onChange={(e) => {
                            const term = e.target.value;
                            const params = new URLSearchParams(searchParams);
                            if (term) {
                                params.set("q", term);
                            } else {
                                params.delete("q");
                            }
                            replace(`${pathname}?${params.toString()}`);
                        }}
                        className="w-full h-12 rounded-full bg-white border-none pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/70"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link href="/cart" className="p-2 hover:bg-slate-100 rounded-full transition-colors relative block">
                        <HugeiconsIcon
                            icon={ShoppingBasket03Icon}
                            size={24}
                            color="currentColor"
                            strokeWidth={1.5}
                        />
                        {itemCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
                        )}
                    </Link>

                    <Link href="/account" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <HugeiconsIcon
                            icon={UserIcon}
                            size={24}
                            color="currentColor"
                            strokeWidth={1.5}
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
}
