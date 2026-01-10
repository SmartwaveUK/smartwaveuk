import { Link } from "@/i18n/routing";
import { cn, formatPrice } from "@/lib/utils";
import { Phone } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export function PhoneCard({ phone, currency }: { phone: Phone, currency?: string }) {
    const t = useTranslations("Common");
    const isAvailable = phone.availability_status === 'in_stock';
    const displayCurrency = currency || phone.currency;

    // Helper to get color for condition
    const getConditionStyle = (condition: string): React.CSSProperties | undefined => {
        const c = condition.toLowerCase().trim();
        if (c === 'new') return { backgroundColor: '#2563eb', color: 'white', borderColor: 'transparent' }; // blue-600
        if (c.includes('refurbished')) return { backgroundColor: '#16a34a', color: 'white', borderColor: 'transparent' }; // green-600
        if (c.includes('used') || c.includes('grade')) return { backgroundColor: '#ea580c', color: 'white', borderColor: 'transparent' }; // orange-600
        return undefined;
    };

    return (
        <Link href={`/phones/${phone.id}`} className="group block">
            <div className="border rounded-xl overflow-hidden bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:scale-[1.02]">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {phone.image_url ? (
                        <img
                            src={phone.image_url}
                            alt={`${phone.brand} ${phone.model}`}
                            className="object-contain w-full h-full transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/30">
                            <span className="text-sm">{t('noImage')}</span>
                        </div>
                    )}

                    <div className="absolute top-2 right-2">
                        <Badge
                            className="font-medium hover:opacity-90 transition-opacity"
                            style={getConditionStyle(phone.condition)}
                        >
                            {phone.condition}
                        </Badge>
                    </div>
                </div>

                <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg leading-none">{phone.model}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{phone.brand} • {phone.variant}</p>
                        </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                        <div className="font-bold text-xl">
                            {formatPrice(phone.price, displayCurrency)}
                        </div>
                        {phone.availability_status !== 'in_stock' && (
                            <span className="text-xs font-medium text-amber-600 px-2 py-1 bg-amber-50 rounded-full border border-amber-200">
                                {phone.availability_status.replace('_', ' ')}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
