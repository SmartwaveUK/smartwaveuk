"use client";

import { useState, useEffect } from "react";
import { Phone } from "@/lib/types";
import { PhoneGrid } from "@/components/phone-grid";
import { HeroBanner } from "@/components/hero-banner";
import { Categories } from "@/components/categories";
import { Search, ShoppingBag, Camera } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Navbar } from "./navbar";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/language-switcher";


export function StoreDashboard({
    initialPhones,
    currency
}: {
    initialPhones: Phone[],
    currency?: string
}) {
    const t = useTranslations('StoreDashboard');
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // Sync local state with URL param
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q")?.toString() || "");
    const [priceFilter, setPriceFilter] = useState<string>("all");

    // Dynamic price config based on currency
    const isNGN = currency === 'NGN';
    const thresholds = isNGN
        ? { budget: 500000, premium: 1000000, labelBudget: '500k', labelPremium: '1m' }
        : { budget: 500, premium: 1000, labelBudget: '500', labelPremium: '1000' };

    const PRICE_RANGES = [
        { id: 'all', label: t('all') },
        { id: 'budget', label: `${t('budget')} (<${thresholds.labelBudget})` },
        { id: 'mid', label: `${t('midRange')} (${thresholds.labelBudget}-${thresholds.labelPremium})` },
        { id: 'premium', label: `${t('premium')} (${thresholds.labelPremium}+)` },
    ];

    // Update local state when URL changes (e.g. from desktop navbar)
    useEffect(() => {
        setSearchQuery(searchParams.get("q")?.toString() || "");
    }, [searchParams]);

    const handleSearch = (term: string) => {
        setSearchQuery(term);
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const filteredPhones = initialPhones.filter(phone =>
        phone.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phone.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen pb-24 space-y-8">
            {/* Mobile Header with Search */}
            <div className="md:hidden sticky top-0 z-40 bg-background/10 backdrop-blur-md px-5 py-3 flex items-center gap-4 border-b">
                <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors md:hidden">
                    {/* Placeholder for user/menu */}
                    <Link href={'/'}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                            SW
                        </div>
                    </Link>
                </button>
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full h-10 bg-white rounded-full pl-10 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-muted-foreground"
                    />
                    {searchQuery ? (
                        <button
                            onClick={() => handleSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200"
                        >
                            <span className="sr-only">Clear</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-muted-foreground"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    ) : (
                        <Camera className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    )}
                </div>
                <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                    <LanguageSwitcher />
                </div>

            </div>

            <div className="px-5 md:container md:mx-auto md:px-4 space-y-8 pt-2 md:pt-8 min-h-[50vh]">

                {/* Hero & Categories - Hidden when searching */}
                {!searchQuery && (
                    <>
                        <section>
                            <HeroBanner />
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center justify-center">
                                <h3 className="font-bold text-lg">{t('categories')}</h3>
                            </div>
                            <div className="flex items-center justify-center">
                                <Categories />
                            </div>
                        </section>
                    </>
                )}

                <div className="h-10" />

                {/* Flash Deals / Latest Listings */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg" style={{ background: 'linear-gradient(to left, #90adecff, #f79a69ff)', color: 'white', padding: '5px 10px', borderRadius: '30px' }}>
                            {searchQuery ? `${t('resultsFor')} "${searchQuery}"` : t('flashDeals')}
                        </h3>
                        {!searchQuery && (
                            <Link href="/shop" className="bg-white px-2 py-1 rounded-full border border-blue-600 text-xs font-semibold text-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 shrink-0" style={{ border: '0.5px solid blue' }}>{t('seeAll')}</Link>
                        )}
                    </div>

                    <PhoneGrid phones={filteredPhones} currency={currency} />

                    {/* No Results State */}
                    {searchQuery && filteredPhones.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            <p>{t('noResults')}</p>
                            <button
                                onClick={() => handleSearch("")}
                                className="text-blue-600 hover:underline mt-2 text-sm"
                            >
                                {t('clearSearch')}
                            </button>
                        </div>
                    )}
                </section>

                {/* Latest Phones (New Condition Only) - Hidden when searching */}
                {!searchQuery && (
                    <>
                        <section className="space-y-4 py-8 px-4 rounded-lg"
                            style={{ background: 'linear-gradient(to left, #d3dceeff, #c4d4f5ff)' }}
                        >
                            <div
                                className="flex items-center justify-between gap-2 py-2 p-4 text-white"
                            >
                                <h3 className="font-bold text-lg shrink-0" style={{ background: 'linear-gradient(to left, #90adecff, #f79a69ff)', color: 'white', padding: '5px 10px', borderRadius: '30px' }}>{t('newItems')}</h3>
                                <div className="h-px bg-white/50 flex-1 mx-2" />
                                {/* <Link href="/shop" className="bg-white px-2 py-1 rounded-full border border-blue-600 text-xs font-semibold text-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 shrink-0" style={{ border: '0.5px solid blue' }}>{t('seeAll')}</Link> */}
                            </div>
                            <PhoneGrid phones={initialPhones.filter(p => p.condition.toLowerCase() === 'new')} currency={currency} mobileColumns={1} />
                        </section>


                        <div className="h-12" />

                        {/* Shop by Price */}
                        <section className="space-y-6">
                            <div className="flex flex-row items-center justify-between gap-4">
                                <h3 className="font-bold text-lg shrink-0 text-center sm:text-left" style={{ background: 'linear-gradient(to left, #90adecff, #f79a69ff)', color: 'white', padding: '5px 10px', borderRadius: '30px', width: '150px' }}>{t('shopByPrice')}</h3>
                                <div className="flex p-1 bg-slate-100 rounded-full overflow-x-auto gap-2 border border-slate-200 flex-1 min-w-0 w-auto">
                                    {PRICE_RANGES.map((range) => (
                                        <button
                                            key={range.id}
                                            onClick={() => setPriceFilter(range.id)}
                                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${priceFilter === range.id
                                                ? 'bg-white text-blue-600 shadow-sm border border-blue'
                                                : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <PhoneGrid
                                phones={initialPhones.filter(phone => {
                                    if (priceFilter === 'budget') return phone.price < thresholds.budget;
                                    if (priceFilter === 'mid') return phone.price >= thresholds.budget && phone.price <= thresholds.premium;
                                    if (priceFilter === 'premium') return phone.price > thresholds.premium;
                                    return true;
                                })}
                                currency={currency}
                                mobileLayout="slider"
                            />
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
