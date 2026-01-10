"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowDownAZ, ArrowUpAZ, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

export function SortOptions() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "newest";
    const t = useTranslations("Shop");

    const sortOptions = [
        { id: "newest", label: t('sortOptions.newest'), icon: Calendar },
        { id: "price_asc", label: t('sortOptions.price_asc'), icon: ArrowDownAZ },
        { id: "price_desc", label: t('sortOptions.price_desc'), icon: ArrowUpAZ },
    ];

    const handleSort = (sortId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", sortId);
        router.push(`/shop?${params.toString()}`);
    };

    const activeLabel = sortOptions.find(o => o.id === currentSort)?.label || t('sortBy');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <span className="hidden sm:inline text-muted-foreground font-normal">{t('sortBy')}:</span>
                    <span className="font-medium">{activeLabel}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                {sortOptions.map((option) => (
                    <DropdownMenuItem
                        key={option.id}
                        onClick={() => handleSort(option.id)}
                        className={`gap-2 cursor-pointer ${currentSort === option.id ? "bg-accent" : ""}`}
                    >
                        <option.icon className="w-4 h-4 text-muted-foreground" />
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
