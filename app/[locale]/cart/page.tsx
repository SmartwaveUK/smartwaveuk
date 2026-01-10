"use client";

import { useCart } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBasket03Icon } from "@hugeicons/core-free-icons";
import { useTranslations } from "next-intl";

export default function CartPage() {
    const { items, removeItem, itemCount, cartTotal } = useCart();
    const t = useTranslations("Cart");
    const tCommon = useTranslations("Common");

    // Calculate total price based on first item currency or default
    const currency = items.length > 0 ? items[0].currency : 'USD';

    if (itemCount === 0) {
        return (
            <div className="container mx-auto px-4 py-20 max-w-2xl text-center space-y-6" style={{ minHeight: "calc(100vh - 10rem)" }}>
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HugeiconsIcon icon={ShoppingBasket03Icon} />
                </div>
                <h2 className="text-2xl font-bold">{t('bagEmptyTitle')}</h2>
                <p className="text-muted-foreground">
                    {t('bagEmptyDescription')}
                </p>
                <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors">
                    {t('browsePhones')}
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 md:py-16" style={{ minHeight: "calc(100vh - 10rem)" }}>
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('continueShopping')}
            </Link>

            <h1 className="text-3xl font-bold mb-8">{t('yourRequestBag', { count: itemCount })}</h1>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Cart Items List */}
                <div className="lg:col-span-7 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <div className="w-24 h-24 bg-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center p-2">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.model} className="w-full h-full object-contain" />
                                ) : (
                                    <div className="text-xs text-muted-foreground">{tCommon('noImage')}</div>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-lg">{item.model}</h3>
                                        <p className="font-bold text-blue-600">{formatPrice(item.price, item.currency)}</p>
                                    </div>
                                    <div className="text-sm text-muted-foreground space-y-1 mt-1">
                                        <p>{item.brand} • {item.condition}</p>
                                        {(item.selectedColor || item.selectedStorage) && (
                                            <p className="flex gap-2">
                                                {item.selectedColor && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                                        {item.selectedColor}
                                                    </span>
                                                )}
                                                {item.selectedStorage && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                                        {item.selectedStorage}
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button onClick={() => removeItem(item.id)} className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                        {t('remove')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Checkout Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-slate-50 border rounded-2xl p-6 md:p-8 sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Summary</h2>

                        <div className="flex justify-between items-center mb-6 py-4 border-y border-dashed border-slate-200">
                            <span className="font-medium text-slate-600">{t('totalValue')}</span>
                            <span className="text-2xl font-bold text-slate-900">{formatPrice(cartTotal, currency)}</span>
                        </div>

                        <Link
                            href="/checkout"
                            className="w-full flex items-center justify-center py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200/50"
                        >
                            {t('proceedToCheckout')}
                        </Link>

                        <p className="text-xs text-center text-muted-foreground mt-4">
                            {t('taxesShippingCalculated')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
