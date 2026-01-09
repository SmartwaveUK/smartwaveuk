import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Suspense } from "react";

async function InquiriesTable() {
    const supabase = await createClient();
    const { data: inquiries, error } = await supabase
        .from("inquiries")
        .select("*, phones(model, brand)")
        .order("created_at", { ascending: false });

    if (error) {
        return <div className="p-4 text-red-500">Error loading inquiries</div>;
    }

    return (
        <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Phone</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {!inquiries || inquiries.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                    No inquiries yet.
                                </td>
                            </tr>
                        ) : (
                            inquiries.map((inquiry) => (
                                <tr key={inquiry.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">
                                        <div>{inquiry.customer_name}</div>
                                        <div className="text-xs text-muted-foreground">{inquiry.customer_contact}</div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        {/* @ts-ignore */}
                                        {inquiry.phones?.brand} {inquiry.phones?.model}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge variant={inquiry.status === 'pending' ? 'outline' : 'default'}>
                                            {inquiry.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                        {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <button className="text-blue-500 hover:underline">View</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function AdminInquiriesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>
            </div>

            <Suspense fallback={<div className="p-4 text-muted-foreground">Loading inquiries...</div>}>
                <InquiriesTable />
            </Suspense>
        </div>
    );
}
