import { createClient } from "@/lib/supabase/server";
import { Item } from "./types";

export async function getItems() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("availability_status", "in_stock")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching items:", error);
        return [];
    }

    return data as Item[];
}

export async function getItem(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching item:", error);
        return null;
    }

    return data as Item;
}

// Aliases for backward compatibility
export const getPhones = getItems;
export const getPhone = getItem;
