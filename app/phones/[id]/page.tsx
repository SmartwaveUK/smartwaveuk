import { getPhone } from "@/lib/data";
import { getSiteSettings } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";
export const dynamic = "force-dynamic";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Heart, Share2, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/inquiry-form";
import { Suspense } from "react";

async function PhoneDetailsContent({ id }: { id: string }) {
    const phone = await getPhone(id);
    const settings = await getSiteSettings();

    if (!phone) {
        notFound();
    }

    const isAvailable = phone.availability_status === 'in_stock';
    const displayCurrency = settings.site_currency || phone.currency;
    const priceFormatted = formatPrice(phone.price, displayCurrency);

    // Mock data for UI demo
    const colors = [
        { name: "Titanium", color: "bg-slate-400" },
        { name: "Blue", color: "bg-blue-800" },
        { name: "White", color: "bg-slate-100 border" },
        { name: "Black", color: "bg-black" }
    ];

    const storage = ["256 GB", "512 GB", "1 TB"];

    return (
        <>
            <div className="container mx-auto px-5 md:px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

                    {/* Left Column: Image Area */}
                    <div className="space-y-6">
                        <div className="aspect-[3/4] sm:aspect-square bg-slate-50 rounded-3xl overflow-hidden flex items-center justify-center p-8 relative">
                            {phone.image_url ? (
                                <img
                                    src={phone.image_url}
                                    alt={`${phone.brand} ${phone.model}`}
                                    className="object-contain w-full h-full drop-shadow-xl"
                                />
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <span className="text-lg">No Image</span>
                                </div>
                            )}

                            {/* Thumbnail Indicators Placeholder */}
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details & Actions */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center justify-between md:justify-start md:gap-4 mb-2">
                                <h1 className="text-2xl md:text-4xl font-bold tracking-tight">{phone.model}</h1>
                                <Badge variant={isAvailable ? "default" : "secondary"}>
                                    {phone.condition}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>By {phone.brand}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <div className="flex items-center text-amber-500">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span className="ml-1 text-foreground font-medium">4.9</span>
                                    <span className="ml-1 text-muted-foreground">(2.2k)</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Area */}
                        <div className="flex items-center justify-between py-2 border-y md:border-none md:py-0">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-blue-600">{priceFormatted}</span>
                                <span className="text-sm text-muted-foreground line-through opacity-70">
                                    {formatPrice(phone.price * 1.1, displayCurrency)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Color Selection */}
                            <div className="space-y-3">
                                <span className="text-sm font-semibold">Color</span>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map((c) => (
                                        <button key={c.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:border-black transition-colors focus:ring-2 focus:ring-black focus:ring-offset-1">
                                            <div className={`w-4 h-4 rounded-full ${c.color}`} />
                                            <span className="text-sm font-medium">{c.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Storage Selection */}
                            <div className="space-y-3">
                                <span className="text-sm font-semibold">Storage</span>
                                <div className="flex flex-wrap gap-3">
                                    {storage.map((s, i) => (
                                        <button key={s} className={`px-5 py-2 rounded-full border text-sm font-medium transition-colors ${i === 1 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-700'}`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="pt-2">
                            <p className="text-base text-muted-foreground leading-relaxed">
                                The new {phone.model} features a stunning display, powerful performance, and an advanced camera system. Quality checked and verified by our brokers.
                            </p>
                        </div>

                        {/* Desktop Actions - Inline Inquiry Form */}
                        <div className="pt-4 p-6 bg-slate-50 border rounded-2xl md:block hidden">
                            <h3 className="font-semibold mb-4 text-lg">Interested in this phone?</h3>
                            <InquiryForm phoneId={phone.id} isAvailable={isAvailable} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Bar - Mobile Only */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t pb-safe z-50 flex gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex-1 flex flex-col justify-center">
                    <span className="text-xs text-muted-foreground">Total Price</span>
                    <span className="text-lg font-bold text-foreground">{priceFormatted}</span>
                </div>
                <button className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200">
                    Buy Now
                </button>
            </div>
        </>
    );
}

export default async function PhonePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <main className="min-h-screen bg-background pb-32 md:pb-20">
            {/* Mobile Header - Hidden on Desktop */}
            <div className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-md flex items-center justify-between px-5 py-3">
                <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </Link>
                <div className="flex gap-2">
                    <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <Heart className="w-5 h-5 text-foreground" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <Share2 className="w-5 h-5 text-foreground" />
                    </button>
                </div>
            </div>

            {/* Desktop Breadcrumb */}
            <div className="hidden md:block container mx-auto px-4 py-8">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to phones
                </Link>
            </div>

            <Suspense fallback={<div className="container mx-auto px-5 py-20 text-center">Loading phone details...</div>}>
                <PhoneDetailsContent id={id} />
            </Suspense>
        </main>
    );
}
