"use client";

import { usePathname } from "@/i18n/routing";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BottomNav } from "@/components/bottom-nav";
import { Suspense } from "react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Check if we are in the admin section
    const isAdmin = pathname?.startsWith("/swuk-admin");

    if (isAdmin) {
        // Render only children (the admin layout will handle its own sidebar/structure)
        return <>{children}</>;
    }

    // Render public layout with Nav and Footer
    return (
        <>
            <Suspense fallback={<div className="h-16 w-full bg-background/80 border-b" />}>
                <Navbar />
            </Suspense>
            {children}
            <Suspense fallback={null}>
                <BottomNav />
            </Suspense>
            <Footer />
        </>
    );
}
