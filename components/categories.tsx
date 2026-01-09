"use client";

import { Smartphone, Monitor, Headphones, Tablet, Speaker, Grid } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const categories = [
    { label: "Mobile", icon: Smartphone, image: "/phone-cat.png" },
    { label: "Headphones", icon: Headphones, image: "/headphone-cat.png" },
    { label: "Tablets", icon: Tablet, image: "/tablet-cat.png" },
    { label: "Laptops", icon: Monitor, image: "/laptop-cat.png" }, // Fixed pluralization for consistency
    { label: "Speakers", icon: Speaker, image: "/speaker-cat.png" },
    { label: "More", icon: Grid },
];

export function Categories() {
    return (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 sm:flex sm:flex-wrap sm:justify-start">
            {categories.map((cat, i) => (
                <button
                    key={cat.label}
                    className="flex flex-col items-center gap-2 group bg-slate-50 rounded-md p-2 transition-all group-hover:bg-white group-hover:border-primary/20 group-hover:shadow-lg group-hover:scale-105"
                >
                    <div className="w-16 h-16 flex items-center justify-center text-slate-600  overflow-hidden relative">
                        {cat.image ? (
                            <div className="w-24 h-24 relative">
                                <Image
                                    src={cat.image}
                                    alt={cat.label}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <cat.icon className="w-6 h-6 group-hover:text-primary transition-colors" />
                        )}
                    </div>
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-foreground transition-colors">
                        {cat.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
