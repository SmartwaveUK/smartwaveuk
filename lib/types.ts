export type Item = {
    id: string;
    created_at: string;
    category: string; // Added
    brand: string;
    model: string;
    variant: string;
    condition: string;
    price: number;
    currency: string;
    availability_status: string;
    seller_region?: string;
    internal_notes?: string;
    image_url?: string;
    images?: string[];
    colors?: string[];
    description?: string;
    specs?: any; // Added JSONB field
};

// Deprecated alias for backward compatibility during refactor
export type Phone = Item;
