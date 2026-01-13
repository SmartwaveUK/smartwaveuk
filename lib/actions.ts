"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
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
        item_id: phoneId,
        customer_name: name,
        customer_contact: contact,
        status: "pending",
    });

    if (error) {
        console.error("Error submitting inquiry:", error);
        return { error: "Failed to submit inquiry. Please try again." };
    }

    return { success: true };
}

export async function submitOrder(formData: FormData, phoneIds: string[]) {
    // Legacy function support if needed, but we are switching to handleCheckoutOrder generally
    // leaving here if imported elsewhere temporarily, but can redirect to handleCheckoutOrder logic if needed
    // or just keep for "cart" without full auth if we revert. 
    // For now we will just use basic logic similar to handleCheckoutOrder or deprecate.
    return handleCheckoutOrder(formData, phoneIds);
}

// Update signature to accept array of objects or strings (backward compat if needed, but we updated caller)
export async function handleCheckoutOrder(formData: FormData, cartItems: any[]) {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const postcode = formData.get("postcode") as string;

    if (!name || !email || !cartItems.length) {
        return { error: "Missing required fields." };
    }

    let userId = user?.id;
    let newAccount = false;

    // Logic 1: If not logged in, try to auto-create account or check existence
    if (!userId) {
        // Try to sign up with a temporary password
        const tempPassword = Math.random().toString(36).slice(-10) + "Aa1!";
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password: tempPassword,
            options: {
                data: {
                    full_name: name,
                    phone: phone
                }
            }
        });

        if (authError) {
            console.error("Auth Error:", authError);
            if (authError.message.includes("registered") || authError.message.includes("exists")) {
                return { error: "An account with this email already exists. Please log in to complete your order.", redirectToLogin: true };
            }
            // For privacy, sometimes we don't want to reveal... but for UX we do.
            return { error: "Could not create account. Please contact support." };
        }

        if (authData.user) {
            userId = authData.user.id;
            newAccount = true;
        }
    }

    // 2. Fetch Items to calculate total and get prices
    // Extract IDs (handle if cartItems are just strings for legacy safety, though we changed call site)
    const phoneIds = cartItems.map(item => typeof item === 'string' ? item : item.id);

    const { data: phones, error: phonesError } = await supabase
        .from('items')
        .select('id, price, currency')
        .in('id', phoneIds);

    if (phonesError || !phones) {
        return { error: "Could not retrieve item details." };
    }

    // Calculate total
    // We iterate over cartItems to honor quantity/duplicates if any (though currently our UI prevents dups of exact same ID+opts maybe? No, UI prevents ID dup. So logic holds)
    // Actually, if we send {id: 1, opts: A} and {id: 1, opts: B}, phoneIds has duplicates. 'phones' result will be unique.
    // So we must look up price from 'phones' array.
    const totalAmount = cartItems.reduce((sum, item) => {
        const id = typeof item === 'string' ? item : item.id;
        const phone = phones.find(p => p.id === id);
        return sum + (phone ? Number(phone.price) : 0);
    }, 0);

    const currency = phones[0]?.currency || 'USD';

    // 3. Create Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: userId,
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            shipping_address: {
                line1: address,
                city: city,
                postcode: postcode
            },
            total_amount: totalAmount,
            currency: currency,
            status: 'pending'
        })
        .select()
        .single();

    if (orderError || !order) {
        console.error("Order Creation Error:", orderError);
        return { error: "Failed to create order record." };
    }

    // 4. Create Order Items
    const orderItemsRecord = cartItems.map(item => {
        const id = typeof item === 'string' ? item : item.id;
        const phone = phones.find(p => p.id === id);
        return {
            order_id: order.id,
            item_id: id,
            price: phone?.price || 0,
            selected_options: typeof item === 'object' ? item.selectedOptions : {}
        };
    });

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsRecord);

    if (itemsError) {
        console.error("Order Items Error:", itemsError);
        return { error: "Failed to add items to order." };
    }

    // Send Admin Notification asynchronously
    try {
        const { sendNewOrderAdminEmail } = await import("@/lib/tracking");
        await sendNewOrderAdminEmail(order);
    } catch (e) {
        console.error("Failed to trigger admin email:", e);
    }

    return { success: true, newAccount, orderId: order.id };
}

export async function confirmPayment(orderId: string, formData: FormData) {
    const supabase = await createClient();
    const adminClient = await createAdminClient();
    const file = formData.get("receipt") as File;

    if (!file || !orderId) {
        return { error: "Missing file or order ID" };
    }

    // 1. Upload File (User can upload if authenticated - verified by RLS)
    const fileExt = file.name.split('.').pop();
    const fileName = `${orderId}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file);

    if (uploadError) {
        console.error("Upload Error:", uploadError);
        return { error: "Failed to upload receipt" };
    }

    // 2. Get Public URL (Use Admin Client to bypass RLS for reading/signing)
    const { data, error: signedUrlError } = await adminClient.storage
        .from('payment-proofs')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year access for admin

    if (signedUrlError || !data?.signedUrl) {
        console.error("Signed URL Error:", signedUrlError);
        return { error: "Failed to generate receipt URL" };
    }

    const signedUrl = data.signedUrl;

    // 3. Update Order
    const { error: updateError } = await supabase
        .from('orders')
        .update({
            payment_proof: filePath, // Store path or URL? Let's store path so we can generate signed urls later if needed, but signedUrl is good for email.
            // Actually, let's just update a status like 'awaiting_payment_approval' or just keep 'pending' but add proof?
            // Let's keep 'pending' but valid proof acts as a signal. Or arguably 'awaiting_payment'. 
            // Schema comment said: 'pending', 'awaiting_payment', 'paid'...
            // 'pending' usually means "created but no attempt yet". 
            // Let's set to 'awaiting_verify' if we had that, or just keep it as is. 
            // The user didn't ask for status change, just confirmation.
            // Updating a specific 'payment_proof' column is what we did in migration.

        })
        .eq('id', orderId);

    if (updateError) {
        console.error("Update Order Error:", updateError);
        return { error: "Failed to update order with receipt" };
    }

    // 4. Send Email
    try {
        const { sendPaymentConfirmationEmail } = await import("@/lib/tracking");
        await sendPaymentConfirmationEmail(orderId, signedUrl);
    } catch (e) {
        console.error("Failed to trigger payment email:", e);
    }

    revalidatePath("/account");
    return { success: true };
}
