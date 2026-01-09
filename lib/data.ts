import { createClient } from "@/lib/supabase/server";
import { Phone } from "./types";

export async function getPhones() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("phones")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching phones:", error);
        return [];
    }

    return data as Phone[];
}

export async function getPhone(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("phones")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching phone:", error);
        return null;
    }

    return data as Phone;
}
