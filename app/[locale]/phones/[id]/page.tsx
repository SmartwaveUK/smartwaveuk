import { getPhone } from "@/lib/data";
import { getSiteSettings } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";
export const dynamic = "force-dynamic";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Heart, Share2, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductGallery } from "@/components/product-gallery";
import { ProductConfigurator } from "@/components/product-configurator";
import { getTranslations } from "next-intl/server";

async function PhoneDetailsContent({ id }: { id: string }) {
    const phone = await getPhone(id);
    const settings = await getSiteSettings();
    const t = await getTranslations("ProductPage");

    if (!phone) {
        notFound();
    }

    const isAvailable = phone.availability_status === 'in_stock';
    const displayCurrency = settings.site_currency || phone.currency;
    const priceFormatted = formatPrice(phone.price, displayCurrency);

    // Prepare Images
    let galleryImages: string[] = [];
    if (phone.images && phone.images.length > 0) {
        galleryImages = phone.images;
    } else if (phone.image_url) {
        galleryImages = [phone.image_url];
    } else {
        // Mock fallback if absolutely no images
        galleryImages = [];
    }

    // Determine colors
    // If phone.colors is present, use it. Else mock or empty.
    const colors = phone.colors && phone.colors.length > 0
        ? phone.colors
        : [];

    // Description fallback
    const description = phone.description || t('descriptionFallback', { model: phone.model });

    // Randomize rating deterministically based on ID
    const idNum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rating = (4.5 + (idNum % 5) / 10).toFixed(1); // 4.5 to 4.9
    const reviews = 50 + (idNum % 2000);

    return (
        <>
            <div className="container mx-auto px-5 md:px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

                    {/* Left Column: Image Area */}
                    <ProductGallery images={galleryImages} title={`${phone.brand} ${phone.model}`} />

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
                                <span>{t('byBrand', { brand: phone.brand })}</span>
                                {phone.category && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span>{phone.category}</span>
                                    </>
                                )}
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <div className="flex items-center text-amber-500">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span className="ml-1 text-foreground font-medium">{rating}</span>
                                    <span className="ml-1 text-muted-foreground">({reviews})</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Area */}
                        <div className="flex items-center justify-between py-2 border-y md:border-none md:py-0">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-blue-600">{priceFormatted}</span>
                                {phone.condition !== 'New' && (
                                    <span className="text-sm text-muted-foreground line-through opacity-70">
                                        {formatPrice(phone.price * 1.2, displayCurrency)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <ProductConfigurator
                            phone={{
                                id: phone.id,
                                model: phone.model,
                                brand: phone.brand,
                                price: phone.price,
                                currency: phone.currency,
                                image_url: galleryImages.length > 0 ? galleryImages[0] : (phone.image_url || null),
                                condition: phone.condition
                            }}
                            colors={colors}
                            storageOptions={phone.variant ? phone.variant.split(',').map(s => s.trim()) : []} // Allow comma-separated storage options
                            isAvailable={isAvailable}
                            priceFormatted={priceFormatted}
                        />

                        {/* Description */}
                        <div className="pt-2">
                            <h3 className="font-semibold text-lg mb-2">{t('aboutProduct')}</h3>
                            <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default async function PhonePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const t = await getTranslations("ProductPage");

    return (
        <main className="min-h-screen bg-background pb-32 md:pb-20 pt-8">
            {/* Mobile Header - Hidden on Desktop */}
            <div className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-md flex items-center justify-between px-5 py-3 -mt-8 mb-4 border-b">
                <Link href="/shop" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
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
            <div className="hidden md:block container mx-auto px-4 mb-8">
                <Link href="/shop" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('backToShop')}
                </Link>
            </div>

            <Suspense fallback={<div className="container mx-auto px-5 py-20 text-center animate-pulse">{t('loading')}</div>}>
                <PhoneDetailsContent id={id} />
            </Suspense>
        </main>
    );
}
