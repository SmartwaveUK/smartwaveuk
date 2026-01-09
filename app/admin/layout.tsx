import Link from "next/link";
import { Suspense } from "react";
import {
    LayoutDashboard,
    Smartphone,
    Inbox,
    LogOut,
    Settings
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AuthButton } from "@/components/auth-button";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-muted/40">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/admin" className="flex items-center gap-2 font-semibold">
                        <span>Phone Broker Admin</span>
                    </Link>
                </div>
                <nav className="flex flex-col gap-4 px-4 py-4">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/phones"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                    >
                        <Smartphone className="h-4 w-4" />
                        Phones Listing
                    </Link>
                    <Link
                        href="/admin/inquiries"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                    >
                        <Inbox className="h-4 w-4" />
                        Inquiries
                        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                            0
                        </Badge>
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </nav>
                <div className="mt-auto p-4 border-t">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <Suspense fallback={<div className="h-8 w-20 bg-slate-100 rounded animate-pulse" />}>
                            <AuthButton />
                        </Suspense>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64 w-full">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
