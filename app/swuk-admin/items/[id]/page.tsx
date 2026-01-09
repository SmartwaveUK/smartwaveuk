"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Item {
    id: string;
    category: string;
    brand: string;
    model: string;
    variant: string;
    condition: string;
    price: number;
    currency: string;
    availability_status: string;
    image_url: string;
    images?: string[]; // Array of strings
    colors?: string[];
    description?: string;
    internal_notes?: string;
}

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState<Item | null>(null);
    const [fetching, setFetching] = useState(true);

    // Dynamic fields state
    const [imageUrls, setImageUrls] = useState<string[]>([""]);
    const [colorInput, setColorInput] = useState("");

    useEffect(() => {
        async function fetchItem() {
            const { id } = await params;
            const supabase = createClient();
            const { data, error } = await supabase
                .from("items")
                .select("*")
                .eq("id", id)
                .single();

            if (data) {
                const fetchedItem = data as Item;
                setItem(fetchedItem);

                // Initialize rich fields
                if (fetchedItem.images && fetchedItem.images.length > 0) {
                    setImageUrls(fetchedItem.images);
                } else if (fetchedItem.image_url) {
                    setImageUrls([fetchedItem.image_url]);
                }

                if (fetchedItem.colors && Array.isArray(fetchedItem.colors)) {
                    setColorInput(fetchedItem.colors.join(", "));
                }
            }
            setFetching(false);
        }
        fetchItem();
    }, [params]);

    const addImageField = () => setImageUrls([...imageUrls, ""]);
    const removeImageField = (index: number) => {
        const newUrls = [...imageUrls];
        newUrls.splice(index, 1);
        setImageUrls(newUrls);
    };
    const updateImageUrl = (index: number, value: string) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!item) return;

        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const supabase = createClient();

        const validImages = imageUrls.filter(url => url.trim() !== "");
        const colors = colorInput.split(",").map(c => c.trim()).filter(c => c !== "");

        const itemData = {
            category: formData.get("category"),
            brand: formData.get("brand"),
            model: formData.get("model"),
            variant: formData.get("variant"),
            condition: formData.get("condition"),
            price: parseFloat(formData.get("price") as string),
            currency: formData.get("currency"),
            availability_status: formData.get("status"),
            internal_notes: formData.get("internal_notes"),
            description: formData.get("description"),
            images: validImages,
            // Main image is first one, or fallback to what we had if none provided (logic can vary)
            image_url: validImages.length > 0 ? validImages[0] : item.image_url,
            colors: colors
        };

        const { error } = await supabase
            .from("items")
            .update(itemData)
            .eq("id", item.id);

        if (error) {
            alert("Error updating item: " + error.message);
        } else {
            router.push("/swuk-admin/items");
            router.refresh();
        }
        setLoading(false);
    }

    async function handleDelete() {
        if (!item || !confirm("Are you sure you want to delete this listing?")) return;

        setLoading(true);
        const supabase = createClient();
        const { error } = await supabase.from("items").delete().eq("id", item.id);

        if (error) {
            alert("Error deleting item: " + error.message);
            setLoading(false);
        } else {
            router.push("/swuk-admin/items");
            router.refresh();
        }
    }

    if (fetching) return <div className="p-8 flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
    if (!item) return <div className="p-8 text-center text-muted-foreground">Item not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-bold">Edit Item</h1>
                    <p className="text-muted-foreground">Manage listing for {item.model}</p>
                </div>
                <Button variant="destructive" onClick={handleDelete} className="gap-2">
                    <Trash className="w-4 h-4" /> Delete
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl border shadow-sm">

                <div className="grid md:grid-cols-2 gap-8">
                    {/* LEFT COLUMN */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold border-b pb-2">Core Details</h3>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select name="category" defaultValue={item.category || "Smartphone"}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Smartphone">Smartphone</SelectItem>
                                    <SelectItem value="Tablet">Tablet</SelectItem>
                                    <SelectItem value="Laptop">Laptop</SelectItem>
                                    <SelectItem value="Smartwatch">Smartwatch</SelectItem>
                                    <SelectItem value="Headphones">Headphones</SelectItem>
                                    <SelectItem value="Gaming Console">Gaming Console</SelectItem>
                                    <SelectItem value="Camera">Camera</SelectItem>
                                    <SelectItem value="Accessory">Accessory</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Brand</Label>
                                <Input name="brand" defaultValue={item.brand} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Model</Label>
                                <Input name="model" defaultValue={item.model} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Price</Label>
                                <Input name="price" type="number" step="0.01" defaultValue={item.price} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Currency</Label>
                                <Select name="currency" defaultValue={item.currency || "USD"}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD ($)</SelectItem>
                                        <SelectItem value="GBP">GBP (£)</SelectItem>
                                        <SelectItem value="EUR">EUR (€)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Variant / Specs</Label>
                            <Input name="variant" defaultValue={item.variant} required />
                        </div>

                        <div className="space-y-2">
                            <Label>Condition</Label>
                            <Select name="condition" defaultValue={item.condition}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="New">New</SelectItem>
                                    <SelectItem value="Like New">Like New</SelectItem>
                                    <SelectItem value="Good">Good</SelectItem>
                                    <SelectItem value="Fair">Fair</SelectItem>
                                    <SelectItem value="For Parts">For Parts</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select name="status" defaultValue={item.availability_status}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="in_stock">In Stock</SelectItem>
                                    <SelectItem value="limited">Limited</SelectItem>
                                    <SelectItem value="request">Request Only</SelectItem>
                                    <SelectItem value="sold">Sold Out</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold border-b pb-2">Media & Description</h3>

                        <div className="space-y-4">
                            <Label>Image Gallery</Label>

                            {/* File Upload Area */}
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    id="image-upload"
                                    onChange={async (e) => {
                                        if (!e.target.files?.length) return;
                                        setLoading(true);
                                        const supabase = createClient();

                                        const newUrls: string[] = [];

                                        // Upload each file
                                        for (const file of Array.from(e.target.files)) {
                                            const fileExt = file.name.split('.').pop();
                                            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                                            const filePath = `${fileName}`;

                                            // Upload to Supabase
                                            const { error: uploadError } = await supabase.storage
                                                .from('item-images')
                                                .upload(filePath, file);

                                            if (uploadError) {
                                                console.error('Error uploading file:', uploadError);
                                                alert(`Failed to upload ${file.name}`);
                                                continue;
                                            }

                                            // Get Public URL
                                            const { data: { publicUrl } } = supabase.storage
                                                .from('item-images')
                                                .getPublicUrl(filePath);

                                            newUrls.push(publicUrl);
                                        }

                                        // Append new URLs to existing list (filtering out initial empty one if used)
                                        setImageUrls(prev => {
                                            const cleaned = prev.filter(u => u !== "");
                                            return [...cleaned, ...newUrls];
                                        });
                                        setLoading(false);
                                        // Reset input
                                        e.target.value = "";
                                    }}
                                />
                                <Label htmlFor="image-upload" className="cursor-pointer block w-full h-full py-4 text-sm text-muted-foreground flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <span>Click to upload images</span>
                                    <span className="text-xs text-slate-400 font-normal">JPG, PNG, WebP supported</span>
                                </Label>
                            </div>

                            {/* Image List */}
                            <div className="space-y-3">
                                {imageUrls.map((url, idx) => (
                                    <div key={idx} className="flex gap-2 items-start">
                                        <div className="w-10 h-10 bg-slate-100 rounded border flex-shrink-0 overflow-hidden">
                                            {url && <img src={url} className="w-full h-full object-cover" alt="" />}
                                        </div>
                                        <Input
                                            placeholder="https://..."
                                            value={url}
                                            onChange={(e) => updateImageUrl(idx, e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeImageField(idx)}>
                                            <Trash className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={addImageField} className="gap-2 w-full">
                                    <Plus className="w-3.5 h-3.5" /> Add URL Manually
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Available Colors (comma separated)</Label>
                            <Input
                                value={colorInput}
                                onChange={(e) => setColorInput(e.target.value)}
                                placeholder="Silver, Space Gray..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Detailed Description</Label>
                            <Textarea
                                name="description"
                                defaultValue={item.description || ""}
                                className="min-h-[150px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Internal Notes</Label>
                            <Textarea name="internal_notes" defaultValue={item.internal_notes || ""} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <Button type="submit" disabled={loading} className="w-full md:w-auto">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Listing
                    </Button>
                </div>
            </form>
        </div>
    );
}
