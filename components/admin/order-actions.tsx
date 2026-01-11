"use client";

import { useState } from "react";
import { Loader2, Truck } from "lucide-react";
import { processOrder } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { TrackingManager } from "@/components/admin/tracking-manager";

export function OrderActions({ orderId, status, trackingNumber }: { orderId: string, status: string, trackingNumber?: string | null }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleProcess = async () => {
        if (!confirm("Mark this order as Processing and generate tracking?")) return;
        setIsLoading(true);
        await processOrder(orderId);
        setIsLoading(false);
        // In a real app we'd use router.refresh() or verify revalidation
        window.location.reload();
    };

    if (trackingNumber) {
        return <TrackingManager trackingNumber={trackingNumber} />;
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
