"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
    id: string;
    model: string;
    brand: string;
    price: number;
    currency: string;
    image_url: string | null;
    condition: string;
    selectedColor?: string;
    selectedStorage?: string;
};

type CartContextType = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    itemCount: number;
    cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem("phonebox_cart");
            if (stored) {
                setItems(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load cart", e);
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("phonebox_cart", JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (item: CartItem) => {
        setItems((prev) => {
            if (prev.find((i) => i.id === item.id)) {
                return prev; // No duplicates for unique phones
            }
            return [...prev, item];
        });
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartTotal = items.reduce((sum, item) => sum + item.price, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, itemCount: items.length, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
