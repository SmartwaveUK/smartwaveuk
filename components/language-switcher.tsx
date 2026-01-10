"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { ChangeEvent, useTransition } from "react";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
    const [isPending, startTransition] = useTransition();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        const nextLocale = event.target.value;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    }

    return (
        <div className="relative inline-flex items-center">
            <Globe className="w-4 h-4 text-slate-400 absolute left-2 pointer-events-none" />
            <select
                defaultValue={locale}
                disabled={isPending}
                onChange={onSelectChange}
                className="h-9 pl-8 pr-3 bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
            >
                <option value="en">UK</option>
                <option value="pl">PL</option>
            </select>
        </div>
    );
}
