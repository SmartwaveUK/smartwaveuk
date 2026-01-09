import { createClient } from "@/lib/supabase/server";

export async function getUserAccountData() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    // Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Fetch Orders
    const { data: orders } = await supabase
        .from('orders')
        .select(`
            *,
            items: order_items (
                id,
                price,
                selected_options,
                item: items (
                    brand,
                    model,
                    image_url
                )
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return {
        user,
        profile,
        orders: orders || []
    };
}
