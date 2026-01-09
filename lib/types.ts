export type Phone = {
    id: string;
    created_at: string;
    brand: string;
    model: string;
    variant: string;
    condition: string;
    price: number;
    currency: string;
    availability_status: 'in_stock' | 'limited' | 'request' | 'sold';
    seller_region?: string;
    internal_notes?: string;
    image_url?: string;
    description?: string;
    images?: string[];
    colors?: string[];
    specs?: Record<string, any>;
};

export type Inquiry = {
    id: string;
    created_at: string;
    customer_name: string;
    customer_contact: string;
    phone_id?: string;
    status: 'pending' | 'confirmed' | 'paid' | 'shipped' | 'cancelled';
    admin_notes?: string;
};
