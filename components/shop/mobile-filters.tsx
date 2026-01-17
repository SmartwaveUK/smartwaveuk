"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { FilterSidebar } from "./filter-sidebar";

export function MobileFilterDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("Shop");

    return (
        <div className="lg:hidden">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="gap-2">
                <Filter className="w-4 h-4" />
                {t('filters')}
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-[85vw] max-w-xs h-full bg-background p-6 shadow-xl animate-in slide-in-from-left duration-300 mr-auto flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold">{t('filters')}</h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {/* Reuse the logic from FilterSidebar, but adapted for mobile if needed. 
                                Since FilterSidebar is designed to be self-contained with URL state, 
                                we can actually just render it here if we strip the sidebar-specific layout classes.
                                However, FilterSidebar has `hidden lg:block` and fixed positioning.
                                We should refactor FilterSidebar to be a "FilterContent" component 
                                or just duplicate the content for now to avoid breaking the sticky desktop layout.
                                
                                actually, let's just use the FilterSidebar and override classes with a wrapper 
                                or make FilterSidebar accept a className prop to override `hidden`.
                            */}

                            {/* 
                                Better approach: Copy content to a `FilterList` component and use it in both. 
                                For speed/simplicity now, I'll essentially replicate the content structure here 
                                or modify FilterSidebar to be reusable.
                                
                                Let's Modify FilterSidebar to be reusable first.
                             */}
                            <FilterContent />
                        </div>

                        <div className="pt-6 border-t mt-auto">
                            <Button className="w-full" onClick={() => setIsOpen(false)}>
                                {t('showResults')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Temporary inline version of FilterContent to avoid complex refactor in one step.
// Ideally accessing the export from filter-sidebar if I change it.
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function FilterContent() {
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
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        searchParams.getAll("category")
    );
    const [inStockOnly, setInStockOnly] = useState(
        searchParams.get("availability") === "in_stock"
    );

    // Mock data - in real app could be passed as props
    const brands = ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi"];
    const conditions = ["New", "Refurbished", "Used"];
    const categories = ['Smartphone', 'Tablet', 'Smartwatch', 'Headphones', 'Accessories'];

    // Update state when URL changes (e.g. Back button)
    useEffect(() => {
        setPriceRange({
            min: searchParams.get("min_price") || "",
            max: searchParams.get("max_price") || ""
        });
        setSelectedBrands(searchParams.getAll("brand"));
        setSelectedConditions(searchParams.getAll("condition"));
        setSelectedCategories(searchParams.getAll("category"));
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

        // Update Category
        params.delete("category");
        selectedCategories.forEach(c => params.append("category", c));

        // Update Availability
        if (inStockOnly) params.set("availability", "in_stock");
        else params.delete("availability");

        params.delete("page");
        router.push(`/shop?${params.toString()}`);
    };

    const toggleBrand = (brand: string) => {
        const newBrands = selectedBrands.includes(brand)
            ? selectedBrands.filter(b => b !== brand)
            : [...selectedBrands, brand];
        setSelectedBrands(newBrands);

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

    const toggleCategory = (category: string) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(newCategories);

        const params = new URLSearchParams(searchParams.toString());
        params.delete("category");
        newCategories.forEach(c => params.append("category", c));
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


    return (
        <div className="space-y-8">
            <div>
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

            {/* Categories */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">{t('categories')}</h4>
                <div className="space-y-3">
                    {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                                id={`mobile-category-${category}`}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => toggleCategory(category)}
                            />
                            <Label
                                htmlFor={`mobile-category-${category}`}
                                className="text-sm font-normal cursor-pointer text-muted-foreground peer-data-[state=checked]:text-foreground peer-data-[state=checked]:font-medium"
                            >
                                {category}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Brands */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">{t('brands')}</h4>
                <div className="space-y-3">
                    {brands.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                            <Checkbox
                                id={`mobile-brand-${brand}`}
                                checked={selectedBrands.includes(brand)}
                                onCheckedChange={() => toggleBrand(brand)}
                            />
                            <Label
                                htmlFor={`mobile-brand-${brand}`}
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
                                id={`mobile-condition-${condition}`}
                                checked={selectedConditions.includes(condition)}
                                onCheckedChange={() => toggleCondition(condition)}
                            />
                            <Label
                                htmlFor={`mobile-condition-${condition}`}
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
                        id="mobile-in-stock"
                        checked={inStockOnly}
                        onCheckedChange={(c) => toggleAvailability(c as boolean)}
                    />
                    <Label htmlFor="mobile-in-stock" className="text-sm font-normal cursor-pointer">
                        {t('inStockOnly')}
                    </Label>
                </div>
            </div>
        </div>
    );
}
