"use client";

import { useState } from "react";
import { confirmPayment } from "@/lib/actions";
import { Loader2, UploadCloud } from "lucide-react";
import { useTranslations } from "next-intl";

export function PaymentUploadForm({ orderId }: { orderId: string }) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const t = useTranslations("Checkout");

    async function handleUpload(formData: FormData) {
        setIsUploading(true);
        // Append orderId because bind might be tricky with client component
        const result = await confirmPayment(orderId, formData);
        setIsUploading(false);

        if (result?.success) {
            setUploadSuccess(true);
        } else {
            alert(t('uploadError'));
        }
    }

    if (uploadSuccess) {
        return (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2 text-sm font-medium">
                <div className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center">✓</div>
                {t('receiptUploaded')}
            </div>
        );
    }

    return (
        <form action={handleUpload} className="flex gap-2">
            <input type="hidden" name="orderId" value={orderId} />
            <div className="relative flex-1">
                <input
                    type="file"
                    name="receipt"
                    accept="image/*,.pdf"
                    required
                    className="w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                    "
                />
            </div>
            <button
                type="submit"
                disabled={isUploading}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
            >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                {t('upload')}
            </button>
        </form>
    );
}
