"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, User, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from '@hugeicons/react';

export function BottomNav() {
    const pathname = usePathname();

    // Hide on admin routes
    if (pathname.startsWith("/admin")) return null;

    const navItems = [
        { icon: Home, label: "Home", href: "/" },
        { icon: MessageCircle, label: "Chat", href: "#", disabled: true }, // Placeholder
        { icon: ShoppingCart, label: "Cart", href: "/cart", disabled: true }, // Placeholder
        { icon: User, label: "Profile", href: "/account", admin: true }, // Quick link to admin for now
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t pb-safe">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center space-y-1 w-full h-full text-xs font-medium transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground",
                                item.disabled && "opacity-50 pointer-events-none"
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
