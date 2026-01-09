"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function NewPhonePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Simple state for array inputs
    const [imageUrls, setImageUrls] = useState<string[]>([""]);
    const [colorInput, setColorInput] = useState("");

    const addImageUrlField = () => setImageUrls([...imageUrls, ""]);
    const updateImageUrl = (index: number, value: string) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };
    const removeImageUrl = (index: number) => {
        setImageUrls(imageUrls.filter((_, i) => i !== index));
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const supabase = createClient();

        // Process images: filter empty strings
        const images = imageUrls.filter(url => url.trim() !== "");
        // Process colors: split by comma
        const colors = colorInput.split(",").map(c => c.trim()).filter(c => c !== "");

        const phoneData = {
            brand: formData.get("brand"),
            model: formData.get("model"),
            variant: formData.get("variant"),
            condition: formData.get("condition"),
            price: parseFloat(formData.get("price") as string),
            currency: "USD",
            availability_status: formData.get("status"),
            image_url: images[0] || "", // Main image is the first one
            description: formData.get("description"),
            images: images,
            colors: colors,
            specs: {}, // Placeholder for future specs JSON
        };

        const { error } = await supabase.from("phones").insert(phoneData);

        if (error) {
            alert("Error creating phone: " + error.message);
        } else {
            router.push("/admin/phones");
            router.refresh();
        }
        setLoading(false);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-24">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Add New Phone</h1>
                <p className="text-muted-foreground">Create a new comprehensive listing for the store.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <h3 className="font-semibold text-lg">Basic Information</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Brand</Label>
                                    <Input name="brand" required placeholder="Apple" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Model</Label>
                                    <Input name="model" required placeholder="iPhone 13 Pro" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Variant (Storage)</Label>
                                    <Input name="variant" required placeholder="256GB" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Condition</Label>
                                    <Select name="condition" defaultValue="New">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="New">New</SelectItem>
                                            <SelectItem value="Refurbished">Refurbished</SelectItem>
                                            <SelectItem value="Used">Used</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Price (USD)</Label>
                                    <Input name="price" type="number" required placeholder="999" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select name="status" defaultValue="in_stock">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="in_stock">In Stock</SelectItem>
                                            <SelectItem value="limited">Limited</SelectItem>
                                            <SelectItem value="sold">Sold Out</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Colors (comma separated)</Label>
                                <Input
                                    value={colorInput}
                                    onChange={(e) => setColorInput(e.target.value)}
                                    placeholder="Blue, Graphite, Silver"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Media & Details */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <h3 className="font-semibold text-lg">Details & Media</h3>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    name="description"
                                    required
                                    placeholder="Detailed product description..."
                                    className="min-h-[120px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Image URLs</Label>
                                <div className="space-y-2">
                                    {imageUrls.map((url, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input
                                                value={url}
                                                onChange={(e) => updateImageUrl(idx, e.target.value)}
                                                placeholder={idx === 0 ? "Main Image URL" : "Gallery Image URL"}
                                            />
                                            {imageUrls.length > 1 && (
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeImageUrl(idx)}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={addImageUrlField} className="w-full">
                                        <Plus className="w-4 h-4 mr-2" /> Add Image
                                    </Button>
                                    <p className="text-xs text-muted-foreground">First image will be the main cover image.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading} size="lg" className="w-full md:w-auto">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Listing
                    </Button>
                </div>
            </form>
        </div>
    );
}
