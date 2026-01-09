"use client";

import { useState } from "react";
import { submitInquiry } from "@/lib/actions";
import { Loader2 } from "lucide-react";

export function InquiryForm({ phoneId, isAvailable }: { phoneId: string, isAvailable: boolean }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        formData.append("phoneId", phoneId);

        const result = await submitInquiry(formData);

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
        }
        setIsSubmitting(false);
    }

    if (!isAvailable) {
        return (
            <button
                disabled
                className="w-full py-3 px-4 bg-muted text-muted-foreground font-medium rounded-lg cursor-not-allowed border"
            >
                Item Sold / Unavailable
            </button>
        );
    }

    if (success) {
        return (
            <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-xl text-center">
                <h3 className="font-semibold text-lg mb-2">Request Received!</h3>
                <p className="text-sm">
                    We have received your inquiry. A broker will contact you shortly to confirm availability and payment details.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card p-6 rounded-xl border shadow-xs">
            <h3 className="font-semibold text-lg mb-4">Request to Buy</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Full Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="John Doe"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="contact" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Contact (Phone or Email)
                    </label>
                    <input
                        id="contact"
                        name="contact"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="+1 234 567 8900"
                    />
                </div>

                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        "Submit Inquiry"
                    )}
                </button>
            </form>
            <p className="text-xs text-muted-foreground mt-4 text-center">
                No payment required yet. We confirm availability first.
            </p>
        </div>
    );
}
