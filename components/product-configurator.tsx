"use client";

import { useState, useEffect } from "react";
import { useCart, CartItem } from "@/components/providers/cart-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ShoppingBag, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface ProductConfiguratorProps {
    phone: CartItem; // Using CartItem as base type (needs to match what we pass)
    colors: string[];
    storageOptions: string[];
    isAvailable: boolean;
    priceFormatted: string;
}

export function ProductConfigurator({
    phone,
    colors,
    storageOptions,
    isAvailable,
    priceFormatted
}: ProductConfiguratorProps) {
    const { addItem, items } = useCart();
    const t = useTranslations("ProductConfigurator");
    // Default selection logic: Select if only one option exists, otherwise undefined
    const [selectedColor, setSelectedColor] = useState<string | undefined>(colors.length === 1 ? colors[0] : undefined);
    const [selectedStorage, setSelectedStorage] = useState<string | undefined>(storageOptions.length === 1 ? storageOptions[0] : undefined);

    // Check if item is in cart (checking ID only for now as unique items)
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        setIsInCart(items.some(i => i.id === phone.id));
    }, [items, phone.id]);

    const [isLoading, setIsLoading] = useState(false);

    // Validation: Check if required options are selected
    const isColorValid = colors.length === 0 || !!selectedColor;
    const isStorageValid = storageOptions.length === 0 || !!selectedStorage;
    const isValidSelection = isColorValid && isStorageValid;

    const handleAddToCart = async () => {
        setIsLoading(true);
        // Simulate a small network delay for better UX feel
        await new Promise(resolve => setTimeout(resolve, 600));

        addItem({
            ...phone,
            selectedColor,
            selectedStorage
        });
        setIsLoading(false);
    };

    const CartButton = ({ mobile = false }) => {
        if (!isAvailable) {
            return (
                <button
                    disabled
                    className={cn(
                        "bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed",
                        mobile ? "flex-1 py-3" : "w-full py-3 px-4 border"
                    )}
                >
                    {t('soldUnavailable')}
                </button>
            );
        }

        if (isInCart) {
            return (
                <Link
                    href="/cart"
                    className={cn(
                        "flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 font-bold rounded-xl hover:bg-green-100 transition-colors",
                        mobile ? "flex-1 py-3 bg-green-600 text-white border-none hover:bg-green-700" : "w-full py-3 px-4"
                    )}
                >
                    <Check className="w-5 h-5" />
                    {mobile ? t('viewBag') : t('viewInBag')}
                </Link>
            );
        }

        if (!isValidSelection) {
            return (
                <button
                    disabled
                    className={cn(
                        "bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2",
                        mobile ? "flex-1 py-3" : "w-full py-3 px-4 border"
                    )}
                >
                    {t('selectOptions')}
                </button>
            );
        }

        return (
            <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className={cn(
                    "bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-wait disabled:active:scale-100",
                    mobile ? "flex-1 py-3" : "w-full py-3 px-4"
                )}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <ShoppingBag className="w-5 h-5" />
                        {t('addToBag')}
                    </>
                )}
            </button>
        );
    };

    return (
        <div className="space-y-6">
            {/* Color Selection */}
            {colors.length > 0 && (
                <div className="space-y-3">
                    <span className="text-sm font-semibold">{t('selectColor')}</span>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((c) => (
                            <button
                                key={c}
                                onClick={() => setSelectedColor(c)}
                                className={cn(
                                    "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                                    selectedColor === c
                                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                                        : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                                )}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Storage Selection */}
            {storageOptions.length > 0 && (
                <div className="space-y-3">
                    <span className="text-sm font-semibold">{t('variantSpecs')}</span>
                    <div className="flex flex-wrap gap-3">
                        {storageOptions.map((s) => (
                            <button
                                key={s}
                                onClick={() => setSelectedStorage(s)}
                                className={cn(
                                    "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                                    selectedStorage === s
                                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                                        : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Desktop Actions */}
            <div className="pt-4 p-6 bg-slate-50 border rounded-2xl md:block hidden">
                <h3 className="font-semibold mb-4 text-lg">{t('interested')}</h3>
                <CartButton />
                <p className="text-xs text-muted-foreground mt-4 text-center">
                    {t('freeShipping')}
                </p>
            </div>

            {/* Mobile Actions (Sticky) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t pb-safe z-50 flex gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex-1 flex flex-col justify-center">
                    <span className="text-xs text-muted-foreground">{t('totalPrice')}</span>
                    <span className="text-lg font-bold text-foreground">{priceFormatted}</span>
                </div>
                <CartButton mobile={true} />
            </div>
        </div>
    );
}
