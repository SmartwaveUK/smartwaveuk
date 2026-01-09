import { getUserAccountData } from "@/lib/account";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Package, User, LogOut, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
    const data = await getUserAccountData();

    if (!data) {
        redirect("/auth/login?next=/account");
    }

    const { profile, orders, user } = data;

    // Simple logout action (inline for now or we use a client component for the button)
    // Server Actions are best for forms.
    const signOut = async () => {
        "use server";
        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect("/");
    };

    return (
        <div className="container mx-auto px-4 py-10 md:py-16 pb-32">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>

            <div className="grid md:grid-cols-12 gap-10">
                {/* Sidebar / Profile Summary */}
                <div className="md:col-span-4 lg:col-span-3 space-y-6">
                    <div className="bg-white border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                                {profile?.full_name ? profile.full_name[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U')}
                            </div>
                            <div className="overflow-hidden">
                                <h2 className="font-bold text-lg truncate">{profile?.full_name || 'Valued Customer'}</h2>
                                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-sm font-medium text-slate-700">
                                <User className="w-4 h-4" />
                                Profile
                            </div>
                            {/* Placeholder for future links */}
                            {/* <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-sm font-medium text-muted-foreground cursor-pointer transition-colors">
                                 <Heart className="w-4 h-4" />
                                 Wishlist
                             </div> */}
                        </div>

                        <div className="mt-8 pt-6 border-t">
                            <form action={signOut}>
                                <button className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors w-full">
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Main Content / Orders */}
                <div className="md:col-span-8 lg:col-span-9 space-y-8">

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Package className="w-5 h-5 text-blue-600" />
                            Order History
                        </h2>

                        {orders.length === 0 ? (
                            <div className="bg-slate-50 border rounded-2xl p-10 text-center">
                                <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
                                <p className="text-muted-foreground mb-6">Start exploring our collection to find your next gadgets.</p>
                                <Link href="/" className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
                                    Browse Items
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order: any) => (
                                    <div key={order.id} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4 border-b border-dashed pb-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Order <span className="font-mono text-xs">{order.id.slice(0, 8)}</span></p>
                                                <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg">{formatPrice(order.total_amount, order.currency)}</p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                    ${order.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-slate-100 text-slate-800'}`}>
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {order.items.map((orderItem: any) => (
                                                <div key={orderItem.id} className="flex gap-4">
                                                    <div className="w-12 h-12 bg-slate-50 rounded border flex-shrink-0 p-1 flex items-center justify-center">
                                                        {orderItem.item?.image_url ? (
                                                            <img src={orderItem.item.image_url} className="w-full h-full object-contain" alt={orderItem.item.model} />
                                                        ) : (
                                                            <div className="w-full h-full bg-slate-200" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{orderItem.item?.model || 'Unknown Device'}</p>
                                                        <p className="text-xs text-muted-foreground">{orderItem.item?.brand}</p>
                                                        {orderItem.selected_options && (orderItem.selected_options.color || orderItem.selected_options.storage) && (
                                                            <div className="flex gap-2 mt-1">
                                                                {orderItem.selected_options.color && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                                        {orderItem.selected_options.color}
                                                                    </span>
                                                                )}
                                                                {orderItem.selected_options.storage && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                                        {orderItem.selected_options.storage}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-sm font-medium">
                                                        {formatPrice(orderItem.price, order.currency)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
