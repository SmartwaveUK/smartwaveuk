"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function ActiveFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations("Shop");

    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const brands = searchParams.getAll("brand");
    const categories = searchParams.getAll("category");
    const conditions = searchParams.getAll("condition");
    const availability = searchParams.get("availability");

    const hasFilters = minPrice || maxPrice || brands.length > 0 || categories.length > 0 || conditions.length > 0 || availability;

    if (!hasFilters) return null;

    const removeFilter = (key: string, value?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            // Remove specific value from array params
            const values = params.getAll(key);
            const newValues = values.filter(v => v !== value);
            params.delete(key);
            newValues.forEach(v => params.append(key, v));
        } else {
            // Remove single value param
            params.delete(key);
        }
        params.delete("page");
        router.push(`/shop?${params.toString()}`);
    };

    const clearAll = () => {
        router.push('/shop');
    }

    return (
        <div className="flex flex-wrap items-center gap-2 mb-4">
            {minPrice && (
                <Badge variant="secondary" className="gap-1 pl-2 pr-1 h-7">
                    {t('min')}: {minPrice}
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => removeFilter("min_price")}>
                        <X className="h-3 w-3" />
                    </Button>
                </Badge>
            )}
            {maxPrice && (
                <Badge variant="secondary" className="gap-1 pl-2 pr-1 h-7">
                    {t('max')}: {maxPrice}
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => removeFilter("max_price")}>
                        <X className="h-3 w-3" />
                    </Button>
                </Badge>
            )}
            {brands.map(brand => (
                <Badge key={`brand-${brand}`} variant="secondary" className="gap-1 pl-2 pr-1 h-7">
                    {brand}
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => removeFilter("brand", brand)}>
                        <X className="h-3 w-3" />
                    </Button>
                </Badge>
            ))}
            {categories.map(category => (
                <Badge key={`category-${category}`} variant="secondary" className="gap-1 pl-2 pr-1 h-7">
                    {category}
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => removeFilter("category", category)}>
                        <X className="h-3 w-3" />
                    </Button>
                </Badge>
            ))}
            {conditions.map(condition => (
                <Badge key={`condition-${condition}`} variant="secondary" className="gap-1 pl-2 pr-1 h-7">
                    {/* Try to translate if key exists, else fallback to condition string (title cased usually) */}
                    {['New', 'Refurbished', 'Used'].includes(condition) ? t(`conditions.${condition.toLowerCase()}`) : condition}
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => removeFilter("condition", condition)}>
                        <X className="h-3 w-3" />
                    </Button>
                </Badge>
            ))}
            {availability === "in_stock" && (
                <Badge variant="secondary" className="gap-1 pl-2 pr-1 h-7">
                    {t('inStockOnly')}
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => removeFilter("availability")}>
                        <X className="h-3 w-3" />
                    </Button>
                </Badge>
            )}

            <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground ml-2" onClick={clearAll}>
                {t('clearAll')}
            </Button>
        </div>
    );
}
