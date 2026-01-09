import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function AdminItemsPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const supabase = await createClient(); // Wait for promise
    const params = await searchParams; // Wait for searchParams if in Next 15, safe in 14 too usually
    const query = params?.q || "";

    let dbQuery = supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

    if (query) {
        dbQuery = dbQuery.ilike("model", `%${query}%`);
    }

    const { data: items, error } = await dbQuery;

    if (error) {
        return <div className="text-red-500">Error loading items: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Inventory Items</h1>
                <Link href="/swuk-admin/items/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                </Link>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <form className="flex-1">
                    <Input
                        name="q"
                        placeholder="Search items..."
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
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Image</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Model / Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Brand</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {items && items.length > 0 ? (
                                items.map((item) => (
                                    <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle">
                                            <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center overflow-hidden">
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt={item.model} className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="text-[10px] text-muted-foreground">No img</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle font-medium text-muted-foreground">{item.category || 'N/A'}</td>
                                        <td className="p-4 align-middle font-medium">{item.model}</td>
                                        <td className="p-4 align-middle">{item.brand}</td>
                                        <td className="p-4 align-middle">{formatPrice(item.price, item.currency)}</td>
                                        <td className="p-4 align-middle capitalize">{item.availability_status?.replace('_', ' ')}</td>
                                        <td className="p-4 align-middle text-right">
                                            <Link href={`/swuk-admin/items/${item.id}`} className="text-blue-600 hover:underline font-medium">Edit</Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-muted-foreground h-24">
                                        No items found. Add your first gadget!
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
