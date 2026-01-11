"use server";

import { createClient } from "@/lib/supabase/server";
import { createShipment } from "@/lib/tracking";
import { revalidatePath } from "next/cache";

export async function processOrder(orderId: string) {
    const supabase = await createClient();

    // 1. Update Order Status
    const { error } = await supabase
        .from("orders")
        .update({ status: "processing" })
        .eq("id", orderId);

    if (error) {
        console.error("Error updating order status:", error);
        return { error: "Failed to update order" };
    }

    // 2. Generate Tracking & Send Email
    // We do this after updating status.
    const shipment = await createShipment(orderId);

    revalidatePath("/swuk-admin/orders");
    return { success: true, trackingNumber: shipment?.tracking_number };
}
