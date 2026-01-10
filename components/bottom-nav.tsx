"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import { Home, Search, ShoppingCart, User, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from "next-intl";

export function BottomNav() {
    const pathname = usePathname();
    const t = useTranslations('Navigation');

    // Hide on admin routes
    if (pathname.startsWith("/swuk-admin")) return null;

    const navItems = [
        { icon: Home, label: t('home'), href: "/" },
        { icon: MessageCircle, label: t('chat'), href: "https://wa.link/mlzire" },
        { icon: ShoppingCart, label: t('cart'), href: "/cart" },
        { icon: User, label: t('account'), href: "/account", admin: true }, // Quick link to admin for now
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t pb-safe">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    // Simple active check might need robust handling for subpaths
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                    // Specific handling for external links to render normal a tag or pass through
                    if (item.href.startsWith("http")) {
                        return (
                            <a
                                key={item.label}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "flex flex-col items-center justify-center space-y-1 w-full h-full text-xs font-medium transition-colors text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon className="w-6 h-6" />
                                <span>{item.label}</span>
                            </a>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center space-y-1 w-full h-full text-xs font-medium transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
