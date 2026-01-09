"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function HeroBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: "iPhone 16 Pro",
            subtitle: "Forged in Titanium. Powered by Apple Intelligence.",
            gradientOverlay: "from-blue-600",
            baseGradient: "from-blue-600 to-indigo-600",
            accentColor: "bg-indigo-600",
            textColor: "text-blue-100",
            image: "/iphone-main.png"
        },
        {
            id: 2,
            title: "Black Titanium",
            subtitle: "Sleek. Sophisticated. Pro performance.",
            gradientOverlay: "from-black/80",
            baseGradient: "from-slate-800 to-black",
            accentColor: "bg-slate-700",
            textColor: "text-slate-300",
            image: "/samsungflagship.png" // Using the other image for variety
        },
        {
            id: 3,
            title: "Red Hot Deals",
            subtitle: "Exclusive colors at unbeatable broker prices.",
            gradientOverlay: "from-red-600",
            baseGradient: "from-red-600 to-rose-600",
            accentColor: "bg-rose-600",
            textColor: "text-rose-100",
            image: "/iphone17pro.png" // Reusing main for now, user can replace
        },
    ];

    // Auto-rotate slides
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="relative w-full aspect-[2/1] sm:aspect-[3/1] rounded-2xl overflow-hidden shadow-lg group">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={cn(
                        "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out p-6 sm:p-10 flex flex-col justify-center items-start",
                        "bg-linear-to-r",
                        slide.baseGradient,
                        index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    )}
                >
                    {/* User requested rotating gradient overlay */}
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-tr to-transparent pointer-events-none transition-all duration-1000",
                        slide.gradientOverlay
                    )} />

                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className={cn("absolute bottom-0 right-20 w-32 h-32 rounded-full blur-xl", slide.accentColor)} />

                    <div className="relative z-10 max-w-[60%] space-y-2 sm:space-y-4">
                        <h2 className="text-2xl sm:text-4xl font-bold leading-tight text-white">
                            {slide.title}
                        </h2>
                        <p className={cn("text-sm sm:text-base font-medium", slide.textColor)}>
                            {slide.subtitle}
                        </p>

                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-xs sm:text-sm font-bold mt-2 shadow-sm hover:scale-105 transition-transform"
                        >
                            Shop Now
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Image Placeholder */}
                    <div className="absolute right-[-90px] bottom-[-50px] sm:right-[-70px] sm:bottom-[-50px] w-full h-full sm:w-80 sm:h-96 lg:w-[60rem] lg:h-[35rem] opacity-90 transform transition-transform duration-700 group-hover:-translate-y-2">
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority={index === 0} // Only prioritize first image
                        />
                    </div>
                </div>
            ))}

            {/* ... indicators ... */}
            <div className="absolute bottom-4 left-6 sm:left-10 z-20 flex gap-2">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            idx === currentSlide ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
