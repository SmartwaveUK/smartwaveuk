"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { createShipment, sendTrackingUpdateEmail } from "@/lib/tracking";
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

    // Send Email Notification
    // We need to fetch the order email. We can join tables but for simplicity let's just get the order_id from shipment then email from order.
    // Or assume we fetched it with the shipment if we change the query.
    // Let's do a quick lookup.
    const { data: shipmentData } = await supabase.from("tracking_shipments").select("order_id").eq("tracking_number", trackingNumber).single();

    if (shipmentData?.order_id) {
        const { data: order } = await supabase.from("orders").select("customer_email").eq("id", shipmentData.order_id).single();
        if (order?.customer_email) {
            await sendTrackingUpdateEmail(order.customer_email, trackingNumber, event);
        }
    }

    revalidatePath("/swuk-admin/orders");
    revalidatePath("/track-order"); // Update public page
    return { success: true };
}

export async function deleteItem(itemId: string, forceArchive: boolean = false) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
        return { error: "Server Error: Missing Service Role Key. Cannot perform admin action." };
    }

    const supabase = await createAdminClient();

    // 1. Check dependencies
    // using select + limit(1) instead of count/head for better stability
    const { data: existingOrders, error: countError } = await supabase
        .from("order_items")
        .select("id")
        .eq("item_id", itemId)
        .limit(1);

    if (countError) {
        console.error("Error checking dependencies full object:", JSON.stringify(countError, null, 2));
        return { error: `Failed to check item dependencies: ${countError.message || JSON.stringify(countError)}` };
    }

    const hasOrders = existingOrders && existingOrders.length > 0;

    // 2. Handle Logic
    if (hasOrders) {
        if (!forceArchive) {
            return { requires_archive_confirmation: true };
        }

        // Perform Archive
        const { error } = await supabase
            .from("items")
            .update({ availability_status: "archived" })
            .eq("id", itemId);

        if (error) {
            return { error: "Failed to archive item: " + error.message };
        }
    } else {
        // No orders, safe to hard delete
        const { error } = await supabase
            .from("items")
            .delete()
            .eq("id", itemId);

        if (error) {
            return { error: "Failed to delete item: " + error.message };
        }
    }

    revalidatePath("/swuk-admin/items");
    revalidatePath(`/swuk-admin/items/${itemId}`);
    return { success: true };
}
