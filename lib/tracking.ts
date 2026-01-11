"use server";

import { createClient } from "@/lib/supabase/server";

export interface TrackingEvent {
    status: string;
    location: string;
    timestamp: string;
    description: string;
}

export async function generateTrackingNumber() {
    // Generate a random string like SW-12345678
    const random = Math.floor(10000000 + Math.random() * 90000000);
    return `SW-${random}`;
}

export async function createShipment(orderId: string) {
    const supabase = await createClient();
    const trackingNumber = await generateTrackingNumber();

    const initialEvent: TrackingEvent = {
        status: "created",
        location: "Warehouse",
        timestamp: new Date().toISOString(),
        description: "Shipment information received"
    };

    const { data, error } = await supabase
        .from("tracking_shipments")
        .insert({
            order_id: orderId,
            tracking_number: trackingNumber,
            status: "created",
            events: [initialEvent]
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating shipment:", error);
        return null;
    }

    // Also update order with tracking number link if you had a column, 
    // but we can join tables. For now just returning the tracking info.

    // Simulate Email Sending
    // Retrieve tracking email
    const { data: order } = await supabase.from("orders").select("customer_email").eq("id", orderId).single();
    if (order?.customer_email) {
        await sendTrackingEmail(order.customer_email, trackingNumber);
    }

    return data;
}

import { resend } from "@/lib/resend";

export async function sendTrackingEmail(email: string, trackingNumber: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'SmartWave UK <orders@smartwaveuk.com>',
            to: [email],
            subject: `Your Order has been shipped! (Tracking: ${trackingNumber})`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2563eb;">Good news! Your order is on the way.</h1>
                    <p>We've handed over your package to our logistics partner. You can track its journey using the link below.</p>
                    
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 24px 0; text-align: center;">
                        <p style="margin-bottom: 8px; color: #64748b; font-size: 0.875rem;">Tracking Number</p>
                        <p style="font-family: monospace; font-size: 1.5rem; font-weight: bold; margin: 0; letter-spacing: 0.05em;">${trackingNumber}</p>
                    </div>

                    <p style="text-align: center;">
                        <a href="https://smartwaveuk.com/track-order?tracking_number=${trackingNumber}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Track Shipment</a>
                    </p>

                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                    
                    <p style="color: #64748b; font-size: 0.875rem;">
                        If the button doesn't work, copy this link into your browser:<br>
                        https://smartwaveuk.com/track-order?tracking_number=${trackingNumber}
                    </p>
                </div>
            `
        });

        if (error) {
            console.error("Resend Error:", error);
            return;
        }

        console.log("Email sent successfully:", data?.id);

    } catch (e) {
        console.error("Failed to send email:", e);
    }
}

export async function getTrackingInfo(trackingNumber: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("tracking_shipments")
        .select(`
            *,
            order: orders (
                customer_name,
                shipping_address
            )
        `)
        .eq("tracking_number", trackingNumber)
        .single();

    if (error) return null;
    return data;
}
