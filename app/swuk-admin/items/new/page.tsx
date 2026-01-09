"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash, X } from "lucide-react";

export default function NewItemPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    // Local state for dynamic fields
    const [imageUrls, setImageUrls] = useState<string[]>([""]); // Start with 1 empty input
    const [colorInput, setColorInput] = useState("");

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
        setLoading(true);

        const formData = new FormData(event.currentTarget);

        // Filter out empty image strings
        const validImages = imageUrls.filter(url => url.trim() !== "");
        // Process colors
        const colors = colorInput.split(",").map(c => c.trim()).filter(c => c !== "");

        const itemData = {
            category: formData.get("category") as string,
            brand: formData.get("brand") as string,
            model: formData.get("model") as string,
            price: formData.get("price"),
            currency: formData.get("currency") as string,
            condition: formData.get("condition") as string,
            variant: formData.get("variant") as string,
            internal_notes: formData.get("internal_notes") as string,
            description: formData.get("description") as string,
            // Use the first image as the main 'image_url' for backward compatibility/listings
            image_url: validImages.length > 0 ? validImages[0] : null,
            images: validImages,
            colors: colors,
            availability_status: "in_stock"
        };

        const { error } = await supabase.from("items").insert(itemData);

        if (error) {
            alert("Error creating item: " + error.message);
        } else {
            router.push("/swuk-admin/items");
            router.refresh();
        }
        setLoading(false);
    }

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Add New Gadget</h1>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl border shadow-sm">

                <div className="grid md:grid-cols-2 gap-8">
                    {/* LEFT COLUMN: Core Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold border-b pb-2">Core Details</h3>

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select name="category" defaultValue="Smartphone">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
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
                                <Label htmlFor="brand">Brand</Label>
                                <Input id="brand" name="brand" placeholder="Apple" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="model">Model</Label>
                                <Input id="model" name="model" placeholder="iPhone 15" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" name="price" type="number" step="0.01" placeholder="999.00" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Currency</Label>
                                <Select name="currency" defaultValue="USD">
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
                            <Label htmlFor="variant">Variant / Specs</Label>
                            <Input id="variant" name="variant" placeholder="128GB, 16GB RAM..." required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="condition">Condition</Label>
                            <Select name="condition" defaultValue="New">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select condition" />
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
                    </div>

                    {/* RIGHT COLUMN: Rich Media & Desc */}
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
                                            placeholder="https://example.com/image.jpg"
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
                            <p className="text-[10px] text-muted-foreground">Top image will be the main cover.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Available Colors (comma separated)</Label>
                            <Input
                                value={colorInput}
                                onChange={(e) => setColorInput(e.target.value)}
                                placeholder="Silver, Space Gray, Gold"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Detailed Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Product features, condition details..."
                                className="min-h-[150px]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Internal Notes</Label>
                            <Textarea name="internal_notes" placeholder="Supplier info, IMEI..." className="h-20" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={loading} className="min-w-[150px]">
                        {loading ? "Creating..." : "Create Gadget"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
