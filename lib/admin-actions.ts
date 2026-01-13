import { createClient } from "@/lib/supabase/server";
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
