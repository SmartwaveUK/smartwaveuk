"use client";

import { useCart, CartItem } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
// Just use simple state for now or built-in alert. 
// Actually, I'll just use simple state within button.

export function AddToCart({ phone, isAvailable }: { phone: CartItem, isAvailable: boolean }) {
    const { addItem, items } = useCart();
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        setIsInCart(items.some(i => i.id === phone.id));
    }, [items, phone.id]);

    const handleAdd = () => {
        addItem(phone);
        // Optional: Open cart drawer or show toast
    };

    if (!isAvailable) {
        return (
            <button
                disabled
                className="w-full py-3 px-4 bg-muted text-muted-foreground font-medium rounded-xl cursor-not-allowed border text-center"
            >
                Item Sold / Unavailable
            </button>
        );
    }

    if (isInCart) {
        return (
            <Link href="/cart" className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-50 text-green-700 border border-green-200 font-bold rounded-xl hover:bg-green-100 transition-colors">
                <Check className="w-5 h-5" />
                View in Bag
            </Link>
        );
    }

    return (
        <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
        >
            <ShoppingBag className="w-5 h-5" />
            Add to Bag
        </button>
    );
}

export function StickyMobileAddToCart({ phone, isAvailable, priceFormatted }: { phone: CartItem, isAvailable: boolean, priceFormatted: string }) {
    const { addItem, items } = useCart();
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        setIsInCart(items.some(i => i.id === phone.id));
    }, [items, phone.id]);

    if (!isAvailable) {
        return (
            <button disabled className="flex-1 py-3 bg-slate-100 text-slate-400 font-bold rounded-xl">
                Sold
            </button>
        )
    }

    if (isInCart) {
        return (
            <Link href="/cart" className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg">
                <Check className="w-5 h-5" />
                View Bag
            </Link>
        )
    }

    return (
        <button
            onClick={() => addItem(phone)}
            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
        >
            Add to Bag
        </button>
    )
}
