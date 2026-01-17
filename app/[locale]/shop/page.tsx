import { getPhones } from "@/lib/data";
import { getSiteSettings } from "@/lib/settings";
import { PhoneGrid } from "@/components/phone-grid";
import { ShopLayout } from "@/components/shop/shop-layout";
import { MobileFilterDrawer } from "@/components/shop/mobile-filters";
import { SortOptions } from "@/components/shop/sort-options";
import { ActiveFilters } from "@/components/shop/active-filters";
import { Phone } from "@/lib/types";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const t = await getTranslations("ShopPage");
    const allPhones = await getPhones();
    const settings = await getSiteSettings();
    const currency = settings?.site_currency || 'USD';

    // Await params
    const params = await searchParams;

    // Parse params
    const minPrice = Number(params.min_price) || 0;
    const maxPrice = Number(params.max_price) || Infinity;

    // Handle array params which can be string or string[]
    const _brands = params.brand;
    const brands = Array.isArray(_brands) ? _brands : _brands ? [_brands] : [];

    const _conditions = params.condition;
    const conditions = Array.isArray(_conditions) ? _conditions : _conditions ? [_conditions] : [];

    const _categories = params.category;
    const categories = Array.isArray(_categories) ? _categories : _categories ? [_categories] : [];

    const availability = params.availability;
    const sort = (params.sort as string) || 'newest';

    // Filter Logic
    let filteredPhones = allPhones.filter((phone: Phone) => {
        // Price
        if (phone.price < minPrice) return false;
        if (maxPrice !== Infinity && phone.price > maxPrice) return false;

        // Brand
        if (brands.length > 0 && !brands.includes(phone.brand)) return false;

        // Condition
        if (conditions.length > 0 && !conditions.includes(phone.condition)) return false;

        // Category
        if (categories.length > 0 && !categories.includes(phone.category)) return false;

        // Availability
        if (availability === 'in_stock' && phone.availability_status !== 'in_stock') return false;

        return true;
    });

    // Sort Logic
    filteredPhones.sort((a, b) => {
        switch (sort) {
            case 'price_asc':
                return a.price - b.price;
            case 'price_desc':
                return b.price - a.price;
            case 'newest':
            default:
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
    });

    return (
        <ShopLayout>
            <div className="space-y-6">
                {/* Mobile Header / Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {t('resultsFound', { count: filteredPhones.length })}
                        </p>
                    </div>

                    <div className="flex w-full sm:w-auto items-center gap-2">
                        <MobileFilterDrawer />
                        <SortOptions />
                    </div>
                </div>

                <ActiveFilters />

                <PhoneGrid phones={filteredPhones} currency={currency} />
            </div>
        </ShopLayout>
    );
}
