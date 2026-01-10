import { Phone } from "@/lib/types";
import { PhoneCard } from "./phone-card";
import { useTranslations } from "next-intl";

export function PhoneGrid({ phones, currency, mobileLayout = 'grid', mobileColumns = 2 }: {
    phones: Phone[],
    currency?: string,
    mobileLayout?: 'grid' | 'slider',
    mobileColumns?: 1 | 2
}) {
    const t = useTranslations("Common");

    if (!phones || phones.length === 0) {
        return (
            <div className="text-center py-20">
                <h3 className="text-lg font-medium">{t('noItems')}</h3>
                <p className="text-muted-foreground">{t('checkBack')}</p>
            </div>
        );
    }

    if (mobileLayout === 'slider') {
        return (
            <>
                {/* Mobile Slider View (Visible &lt; md) */}
                <div className="md:hidden">
                    <div className="flex -mx-5 px-5 overflow-x-auto snap-x snap-mandatory py-4 gap-4 pb-6">
                        {phones.map((phone) => (
                            <div key={phone.id} className="min-w-[50%] w-[50%] snap-start">
                                <PhoneCard phone={phone} currency={currency} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop Grid View (Visible >= md) */}
                <div className="hidden md:block">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                        {phones.map((phone) => (
                            <PhoneCard key={`desktop-${phone.id}`} phone={phone} currency={currency} />
                        ))}
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className={`grid ${mobileColumns === 1 ? 'grid-cols-1' : 'grid-cols-2'} sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`}>
            {phones.map((phone) => (
                <PhoneCard key={phone.id} phone={phone} currency={currency} />
            ))}
        </div>
    );
}
