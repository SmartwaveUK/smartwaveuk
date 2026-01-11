"use client";

import { useState } from "react";
import { Loader2, Truck, Check } from "lucide-react";
import { processOrder } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";

export function OrderActions({ orderId, status }: { orderId: string, status: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleProcess = async () => {
        if (!confirm("Mark this order as Processing and generate tracking?")) return;
        setIsLoading(true);
        await processOrder(orderId);
        setIsLoading(false);
        // In a real app we'd use router.refresh() or verify revalidation
        window.location.reload();
    };

    if (status === 'processing' || status === 'shipped') {
        return (
            <span className="text-xs text-green-600 font-medium flex items-center justify-end gap-1">
                <Check className="w-3 h-3" /> Tracking Active
            </span>
        );
    }

    if (status === 'cancelled') return null;

    return (
        <Button
            size="sm"
            variant="outline"
            onClick={handleProcess}
            disabled={isLoading}
            className="h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
        >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Truck className="w-3 h-3 mr-1" />}
            Ship Order
        </Button>
    );
}
