"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[3/4] sm:aspect-square bg-slate-50 rounded-3xl overflow-hidden flex items-center justify-center p-8 relative">
                <div className="text-center text-muted-foreground">
                    <span className="text-lg">No Image</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="aspect-[3/4] sm:aspect-square bg-slate-50 rounded-3xl overflow-hidden flex items-center justify-center p-8 relative">
                <img
                    src={selectedImage}
                    alt={title}
                    className="object-contain w-full h-full drop-shadow-xl transition-all duration-300"
                />
            </div>

            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(img)}
                            className={cn(
                                "relative w-20 h-20 rounded-2xl bg-slate-50 border-2 overflow-hidden flex-shrink-0 transition-all",
                                selectedImage === img ? "border-blue-600 ring-2 ring-blue-100" : "border-transparent hover:border-slate-300"
                            )}
                        >
                            <img src={img} alt={`${title} view ${idx + 1}`} className="w-full h-full object-contain p-2" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
