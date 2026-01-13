"use client";

import { useCart } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Loader2, Lock, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { handleCheckoutOrder } from "@/lib/actions";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { PaymentUploadForm } from "@/components/payment-upload-form";

export default function CheckoutPage() {
    const { items, clearCart, cartTotal } = useCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<{ newAccount: boolean, bankDetails: boolean, orderId: string } | null>(null);

    // Form State for pre-filling
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const t = useTranslations("Checkout");

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setEmail(user.email || "");
                setName(user.user_metadata?.full_name || "");
                // Try to get more details from profile if possible, generally auth metadata is fastest
                if (user.user_metadata?.phone) {
                    setPhone(user.user_metadata.phone);
                }
            }
        };
        fetchUser();
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const cartItems = items.map(i => ({
            id: i.id,
            selectedOptions: {
                color: i.selectedColor,
                storage: i.selectedStorage
            }
        }));

        try {
            const result = await handleCheckoutOrder(formData, cartItems);

            if (result?.error) {
                setError(result.error);
                if (result.redirectToLogin) {
                    // Could redirect to login with a "next" param back to checkout
                    // router.push(`/auth/login?next=/checkout&email=${formData.get('email')}`);
                }
            } else if (result?.success) {
                setSuccessData({
                    newAccount: result.newAccount || false,
                    bankDetails: true,
                    orderId: result.orderId // Ensure this is returned from handleCheckoutOrder
                });
                clearCart();
            }
        } catch (e) {
            setError(t('somethingWentWrong'));
        } finally {
            setIsSubmitting(false);
        }
    }

    if (items.length === 0 && !successData) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">{t('bagEmpty')}</h2>
                <Link href="/" className="text-blue-600 hover:underline">{t('goBackShopping')}</Link>
            </div>
        )
    }

    if (successData) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-2xl">
                <div className="bg-white border rounded-2xl p-8 shadow-sm text-center space-y-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                        <ShoppingBag className="w-8 h-8" />
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900">{t('orderSuccess')}</h1>

                    {successData.newAccount && (
                        <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm">
                            <p className="font-semibold mb-1">{t('accountCreated')}</p>
                            <p>{t('accountCreatedDescription')}</p>
                        </div>
                    )}

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            {t('paymentDetails')}
                        </h3>
                        <div className="space-y-3 text-sm text-slate-700">
                            <p>{t('makeTransfer')}</p>
                            <div className="grid grid-cols-3 gap-2 py-2">
                                <span className="text-slate-500">{t('accountName')}</span>
                                <span className="col-span-2 font-medium">Jan Moliński</span>

                                <span className="text-slate-500">{t('bank')}</span>
                                <span className="col-span-2 font-medium">Millennium Bank</span>



                                <span className="text-slate-500">{t('accountNumber')}</span>
                                <span className="col-span-2 font-mono">PL32 1160 2202 0000 0006 3080 0055</span>

                                <span className="text-slate-500">{t('reference')}</span>
                                <span className="col-span-2 font-mono">ORDER-{new Date().getTime().toString().slice(-6)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {t('orderProcessed')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left">
                    <h3 className="font-semibold text-lg mb-4">{t('confirmPayment')}</h3>
                    <p className="text-sm text-slate-600 mb-4">{t('uploadReceiptDescription')}</p>

                    <PaymentUploadForm orderId={successData.orderId} />
                </div>

                <div className="pt-4">
                    <Link href="/account" className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors">
                        {t('goToOrders')}
                    </Link>
                </div>
            </div>

        );
    }

    return (
        <div className="container mx-auto px-4 py-10 md:py-16">
            <Link href="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('backToCart')}
            </Link>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Checkout Form */}
                <div className="lg:col-span-7">
                    <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Contact Info */}
                        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                1. {t('contactInfo')}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">{t('fullName')}</label>
                                    <input
                                        id="name"
                                        name="name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-600 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">{t('emailAddress')}</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-600 outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="phone" className="text-sm font-medium">{t('phoneNumber')}</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-600 outline-none"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                            <h2 className="text-xl font-semibold">2. {t('shippingAddress')}</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="address" className="text-sm font-medium">{t('addressLine1')}</label>
                                    <input
                                        id="address"
                                        name="address"
                                        required
                                        className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-600 outline-none"
                                        placeholder="123 Main St"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="city" className="text-sm font-medium">{t('city')}</label>
                                        <input
                                            id="city"
                                            name="city"
                                            required
                                            className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-600 outline-none"
                                            placeholder="London"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="postcode" className="text-sm font-medium">{t('postcode')}</label>
                                        <input
                                            id="postcode"
                                            name="postcode"
                                            required
                                            className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-600 outline-none"
                                            placeholder="SW1A 1AA"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Order Summary & Payment Button */}
                <div className="lg:col-span-5">
                    <div className="bg-slate-50 border rounded-2xl p-6 sticky top-24 space-y-6">
                        <h2 className="text-xl font-bold">{t('orderSummary')}</h2>

                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-3 text-sm">
                                    <div className="w-12 h-12 bg-white rounded border p-1 flex-shrink-0">
                                        {item.image_url && <img src={item.image_url} className="w-full h-full object-contain" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium truncate">{item.model}</p>
                                        <p className="text-muted-foreground">{item.condition}</p>
                                    </div>
                                    <p className="font-medium">{formatPrice(item.price, item.currency)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                            <span className="font-bold text-lg">{t('total')}</span>
                            <span className="font-bold text-2xl text-blue-600">{formatPrice(cartTotal, items[0]?.currency || 'USD')}</span>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            form="checkout-form"
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : t('proceedPayment')}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <Lock className="w-3 h-3" />
                            {t('secureEncryption')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


