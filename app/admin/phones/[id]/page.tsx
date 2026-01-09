"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Trash } from "lucide-react";
import { Phone } from "@/lib/types";

export default function EditPhonePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState<Phone | null>(null);
    const [fetching, setFetching] = useState(true);

    // We need to unwrap params in a client component too if using Next.js 15 async params, 
    // but for client components usually we unwrap via use() or await in useEffect.  
    // Actually, since this is a client component, `params` is a promise in Next.js 15.
    // We'll handle it inside useEffect.

    useEffect(() => {
        async function fetchPhone() {
            const { id } = await params;
            const supabase = createClient();
            const { data, error } = await supabase
                .from("phones")
                .select("*")
                .eq("id", id)
                .single();

            if (data) {
                setPhone(data as Phone);
            }
            setFetching(false);
        }
        fetchPhone();
    }, [params]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!phone) return;

        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const supabase = createClient();

        const phoneData = {
            brand: formData.get("brand"),
            model: formData.get("model"),
            variant: formData.get("variant"),
            condition: formData.get("condition"),
            price: parseFloat(formData.get("price") as string),
            availability_status: formData.get("status"),
            image_url: formData.get("image_url"),
        };

        const { error } = await supabase
            .from("phones")
            .update(phoneData)
            .eq("id", phone.id);

        if (error) {
            alert("Error updating phone: " + error.message);
        } else {
            router.push("/admin/phones");
            router.refresh();
        }
        setLoading(false);
    }

    async function handleDelete() {
        if (!phone || !confirm("Are you sure you want to delete this listing?")) return;

        setLoading(true);
        const supabase = createClient();
        const { error } = await supabase.from("phones").delete().eq("id", phone.id);

        if (error) {
            alert("Error deleting phone: " + error.message);
            setLoading(false);
        } else {
            router.push("/admin/phones");
            router.refresh();
        }
    }

    if (fetching) return <div className="p-8"><Loader2 className="animate-spin" /></div>;
    if (!phone) return <div className="p-8">Phone not found</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-bold">Edit Phone</h1>
                    <p className="text-muted-foreground">Manage listing for {phone.model}</p>
                </div>
                <button
                    onClick={handleDelete}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20 h-10 px-4 py-2"
                >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded-lg bg-card">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Brand</label>
                        <input name="brand" defaultValue={phone.brand} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Model</label>
                        <input name="model" defaultValue={phone.model} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Variant (RAM/Storage)</label>
                        <input name="variant" defaultValue={phone.variant} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Condition</label>
                        <select name="condition" defaultValue={phone.condition} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                            <option value="New">New</option>
                            <option value="Used - Grade A">Used - Grade A</option>
                            <option value="Used - Grade B">Used - Grade B</option>
                            <option value="Refurbished">Refurbished</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Price (USD)</label>
                        <input name="price" type="number" defaultValue={phone.price} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select name="status" defaultValue={phone.availability_status} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                            <option value="in_stock">In Stock</option>
                            <option value="limited">Limited</option>
                            <option value="request">Request Only</option>
                            <option value="sold">Sold Out</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Image URL</label>
                    <input name="image_url" defaultValue={phone.image_url} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Listing
                </button>
            </form>
        </div>
    );
}
