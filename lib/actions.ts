"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitInquiry(formData: FormData) {
    const supabase = await createClient();

    const phoneId = formData.get("phoneId") as string;
    const name = formData.get("name") as string;
    const contact = formData.get("contact") as string;

    if (!phoneId || !name || !contact) {
        return { error: "Please fill in all fields" };
    }

    const { error } = await supabase.from("inquiries").insert({
        phone_id: phoneId,
        customer_name: name,
        customer_contact: contact,
        status: "pending",
    });

    if (error) {
        console.error("Error submitting inquiry:", error);
        return { error: "Failed to submit inquiry. Please try again." };
    }

    // Generate a random success ID to show a unique success message or just redirect
    // For MVP, we can just return success or redirect to a thank you page
    // But since we want to stay on the page or show a toast, returning state is better.
    // However, Server Actions usually work well with forms.

    return { success: true };
}
