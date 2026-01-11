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

export async function addTrackingEvent(trackingNumber: string, event: { status: string, location: string, description: string }) {
    const supabase = await createClient();

    // Fetch current events
    const { data: shipment } = await supabase
        .from("tracking_shipments")
        .select("events")
        .eq("tracking_number", trackingNumber)
        .single();

    if (!shipment) return { error: "Shipment not found" };

    const newEvent = {
        ...event,
        timestamp: new Date().toISOString()
    };

    const updatedEvents = [newEvent, ...(shipment.events || [])];

    const { error } = await supabase
        .from("tracking_shipments")
        .update({
            events: updatedEvents,
            status: event.status, // Update main status to match latest event
            updated_at: new Date().toISOString()
        })
        .eq("tracking_number", trackingNumber);

    if (error) {
        console.error("Error adding event:", error);
        return { error: "Failed to add event" };
    }

    revalidatePath("/swuk-admin/orders");
    revalidatePath("/track-order"); // Update public page
    return { success: true };
}
