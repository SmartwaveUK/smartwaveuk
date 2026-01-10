"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations("Shop");

    // Initial state from URL
    const [priceRange, setPriceRange] = useState({
        min: searchParams.get("min_price") || "",
        max: searchParams.get("max_price") || ""
    });

    // We'll track selected values in local state for UI, then push to URL on "Apply" or change
    const [selectedBrands, setSelectedBrands] = useState<string[]>(
        searchParams.getAll("brand")
    );
    const [selectedConditions, setSelectedConditions] = useState<string[]>(
        searchParams.getAll("condition")
    );
    const [inStockOnly, setInStockOnly] = useState(
        searchParams.get("availability") === "in_stock"
    );

    // Mock data - in real app could be passed as props
    const brands = ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi"];
    const conditions = ["New", "Refurbished", "Used"];

    // Update state when URL changes (e.g. Back button)
    useEffect(() => {
        setPriceRange({
            min: searchParams.get("min_price") || "",
            max: searchParams.get("max_price") || ""
        });
        setSelectedBrands(searchParams.getAll("brand"));
        setSelectedConditions(searchParams.getAll("condition"));
        setInStockOnly(searchParams.get("availability") === "in_stock");
    }, [searchParams]);

    const updateFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        // Update Price
        if (priceRange.min) params.set("min_price", priceRange.min);
        else params.delete("min_price");

        if (priceRange.max) params.set("max_price", priceRange.max);
        else params.delete("max_price");

        // Update Brands
        params.delete("brand");
        selectedBrands.forEach(b => params.append("brand", b));

        // Update Condition
        params.delete("condition");
        selectedConditions.forEach(c => params.append("condition", c));

        // Update Availability
        if (inStockOnly) params.set("availability", "in_stock");
        else params.delete("availability");

        // Reset page to 1 on filter change
        params.delete("page");

        router.push(`/shop?${params.toString()}`);
    };

    const toggleBrand = (brand: string) => {
        const newBrands = selectedBrands.includes(brand)
            ? selectedBrands.filter(b => b !== brand)
            : [...selectedBrands, brand];
        setSelectedBrands(newBrands);
        // Auto-apply for checkboxes usually better UX, or wait for "Apply" button?
        // Let's auto-apply for desktop sidebar
        const params = new URLSearchParams(searchParams.toString());
        params.delete("brand");
        newBrands.forEach(b => params.append("brand", b));
        params.delete("page");
        router.push(`/shop?${params.toString()}`);
    };

    const toggleCondition = (condition: string) => {
        const newConditions = selectedConditions.includes(condition)
            ? selectedConditions.filter(c => c !== condition)
            : [...selectedConditions, condition];
        setSelectedConditions(newConditions);

        const params = new URLSearchParams(searchParams.toString());
        params.delete("condition");
        newConditions.forEach(c => params.append("condition", c));
        params.delete("page");
        router.push(`/shop?${params.toString()}`);
    };

    const toggleAvailability = (checked: boolean) => {
        setInStockOnly(checked);
        const params = new URLSearchParams(searchParams.toString());
        if (checked) params.set("availability", "in_stock");
        else params.delete("availability");
        params.delete("page");
        router.push(`/shop?${params.toString()}`);
    };

    const handlePriceApply = () => {
        updateFilters();
    };

    // Helper to check if brand is checked
    // Note: URLSearchParams.getAll returns array, so init state handles it.

    return (
        <div className="space-y-8 w-64 shrink-0 hidden lg:block pr-6 border-r h-[calc(100vh-6rem)] sticky top-24 overflow-y-auto custom-scrollbar">
            <div>
                <h3 className="font-semibold mb-4 text-lg">{t('filters')}</h3>
                <Button
                    variant="ghost"
                    className="text-muted-foreground h-auto p-0 hover:text-foreground text-sm"
                    onClick={() => router.push('/shop')}
                >
                    {t('clearAll')}
                </Button>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">{t('priceRange')}</h4>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder={t('min')}
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="h-9"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                        type="number"
                        placeholder={t('max')}
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="h-9"
                    />
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={handlePriceApply}>
                    {t('applyPrice')}
                </Button>
            </div>

            {/* Brands */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">{t('brands')}</h4>
                <div className="space-y-3">
                    {brands.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                            <Checkbox
                                id={`brand-${brand}`}
                                checked={selectedBrands.includes(brand)}
                                onCheckedChange={() => toggleBrand(brand)}
                            />
                            <Label
                                htmlFor={`brand-${brand}`}
                                className="text-sm font-normal cursor-pointer text-muted-foreground peer-data-[state=checked]:text-foreground peer-data-[state=checked]:font-medium"
                            >
                                {brand}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Condition */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">{t('condition')}</h4>
                <div className="space-y-3">
                    {conditions.map((condition) => (
                        <div key={condition} className="flex items-center space-x-2">
                            <Checkbox
                                id={`condition-${condition}`}
                                checked={selectedConditions.includes(condition)}
                                onCheckedChange={() => toggleCondition(condition)}
                            />
                            <Label
                                htmlFor={`condition-${condition}`}
                                className="text-sm font-normal cursor-pointer text-muted-foreground peer-data-[state=checked]:text-foreground peer-data-[state=checked]:font-medium"
                            >
                                {t(`conditions.${condition.toLowerCase()}`)}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Availability */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">{t('availability')}</h4>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="in-stock"
                        checked={inStockOnly}
                        onCheckedChange={(c) => toggleAvailability(c as boolean)}
                    />
                    <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                        {t('inStockOnly')}
                    </Label>
                </div>
            </div>
        </div>
    );
}
