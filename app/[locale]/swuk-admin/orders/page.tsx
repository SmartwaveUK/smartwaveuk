import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const supabase = await createClient();
    const params = await searchParams;
    const query = params?.q || "";

    let dbQuery = supabase
        .from("orders")
        .select(`
            *,
            items: order_items (count)
        `)
        .order("created_at", { ascending: false });

    if (query) {
        // Simple search by order ID or customer name/email
        dbQuery = dbQuery.or(`id.eq.${query},customer_name.ilike.%${query}%,customer_email.ilike.%${query}%`);
    }

    const { data: orders, error } = await dbQuery;

    if (error) {
        return <div className="text-red-500">Error loading orders: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground">Manage customer orders and shipments.</p>
                </div>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <form className="flex-1">
                    <Input
                        name="q"
                        placeholder="Search order ID, email, name..."
                        defaultValue={query}
                        className="h-9"
                    />
                </form>
            </div>

            <div className="rounded-md border bg-white">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground pl-8">Items</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {orders && orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-mono text-xs">{order.id.slice(0, 8)}...</td>
                                        <td className="p-4 align-middle">
                                            {new Date(order.created_at).toLocaleDateString()}
                                            <div className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="font-medium">{order.customer_name}</div>
                                            <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                                        </td>
                                        <td className="p-4 align-middle pl-8">
                                            {order.items?.[0]?.count || 0}
                                        </td>
                                        <td className="p-4 align-middle font-medium">
                                            {formatPrice(order.total_amount, order.currency)}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge variant={
                                                order.status === 'paid' ? 'default' :
                                                    order.status === 'shipped' ? 'secondary' :
                                                        order.status === 'cancelled' ? 'destructive' : 'outline'
                                            } className="capitalize">
                                                {order.status.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            {/* We can link to a detail page later if needed, for now just placeholder or maybe nothing as user just asked to display users */}
                                            {/* Assuming detail view will be requested next, but for now just row display */}
                                            <span className="text-muted-foreground text-xs">View</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-muted-foreground h-24">
                                        No recent orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
