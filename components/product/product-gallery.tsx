"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const [mainImage, setMainImage] = useState(images[0] || "");
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[3/4] sm:aspect-square bg-slate-50 rounded-3xl overflow-hidden flex items-center justify-center p-8">
                <div className="text-center text-muted-foreground">
                    <span className="text-lg">No Image Available</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="aspect-[3/4] sm:aspect-square bg-slate-50 rounded-3xl overflow-hidden flex items-center justify-center p-8 relative group">
                {/* Main Image */}
                <div className="relative w-full h-full">
                    {/* Using standard img for now to avoid next/image domain config issues, can upgrade later */}
                    <img
                        src={mainImage}
                        alt={title}
                        className="object-contain w-full h-full drop-shadow-xl transition-all duration-300 transform hover:scale-105"
                    />
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setMainImage(img);
                                setSelectedIndex(idx);
                            }}
                            className={cn(
                                "relative w-20 h-20 rounded-xl bg-slate-50 border-2 overflow-hidden flex-shrink-0 transition-all",
                                selectedIndex === idx
                                    ? "border-blue-500 ring-2 ring-blue-500/20"
                                    : "border-transparent hover:border-slate-300"
                            )}
                        >
                            <img
                                src={img}
                                alt={`${title} view ${idx + 1}`}
                                className="object-cover w-full h-full"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
