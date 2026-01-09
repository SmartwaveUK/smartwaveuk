"use client";

import { useCart } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Loader2, Lock, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { handleCheckoutOrder } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { items, clearCart, cartTotal } = useCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<{ newAccount: boolean, bankDetails: boolean } | null>(null);

    // Form State for pre-filling
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

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
                    bankDetails: true
                });
                clearCart();
            }
        } catch (e) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (items.length === 0 && !successData) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Your bag is empty</h2>
                <Link href="/" className="text-blue-600 hover:underline">Go back to shopping</Link>
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

                    <h1 className="text-3xl font-bold text-slate-900">Order Placed Successfully!</h1>

                    {successData.newAccount && (
                        <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm">
                            <p className="font-semibold mb-1">Account Created</p>
                            <p>An account has been created for you. Please check your email for login details to track your order.</p>
                        </div>
                    )}

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            Payment Details
                        </h3>
                        <div className="space-y-3 text-sm text-slate-700">
                            <p>Please make a bank transfer to the following broker account:</p>
                            <div className="grid grid-cols-3 gap-2 py-2">
                                <span className="text-slate-500">Bank:</span>
                                <span className="col-span-2 font-medium">PhoneBox UK Ltd</span>

                                <span className="text-slate-500">Sort Code:</span>
                                <span className="col-span-2 font-mono">00-11-22</span>

                                <span className="text-slate-500">Account:</span>
                                <span className="col-span-2 font-mono">12345678</span>

                                <span className="text-slate-500">Reference:</span>
                                <span className="col-span-2 font-mono">ORDER-{new Date().getTime().toString().slice(-6)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                * Your order will be processed once payment is received.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Link href="/" className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors">
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 md:py-16">
            <Link href="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
            </Link>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Checkout Form */}
                <div className="lg:col-span-7">
                    <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Contact Info */}
                        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                1. Contact Information
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-600 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-600 outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-600 outline-none"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                            <h2 className="text-xl font-semibold">2. Shipping Address</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="address" className="text-sm font-medium">Address Line 1</label>
                                    <input
                                        id="address"
                                        name="address"
                                        required
                                        className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-600 outline-none"
                                        placeholder="123 Main St"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="city" className="text-sm font-medium">City</label>
                                        <input
                                            id="city"
                                            name="city"
                                            required
                                            className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-600 outline-none"
                                            placeholder="London"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="postcode" className="text-sm font-medium">Postcode</label>
                                        <input
                                            id="postcode"
                                            name="postcode"
                                            required
                                            className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-600 outline-none"
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
                        <h2 className="text-xl font-bold">Order Summary</h2>

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
                            <span className="font-bold text-lg">Total</span>
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
                            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Proceed to Payment"}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <Lock className="w-3 h-3" />
                            Secure Encryption
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
