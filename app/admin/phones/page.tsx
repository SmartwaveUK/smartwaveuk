import { getPhones } from "@/lib/data";
import { getSiteSettings } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Suspense } from "react";

// ...

async function PhonesTable() {
    const phones = await getPhones();
    const settings = await getSiteSettings();

    return (
        <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Model</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Condition</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {phones.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                    No phones listings yet.
                                </td>
                            </tr>
                        ) : (
                            phones.map((phone) => (
                                <tr key={phone.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">
                                        <div>{phone.model}</div>
                                        <div className="text-xs text-muted-foreground">{phone.brand} • {phone.variant}</div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        {formatPrice(phone.price, settings.site_currency || phone.currency)}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge variant={phone.availability_status === 'in_stock' ? 'default' : 'secondary'}>
                                            {phone.availability_status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle">{phone.condition}</td>
                                    <td className="p-4 align-middle text-right">
                                        {/* Placeholder for Edit/Delete buttons */}
                                        <Link href={`/admin/phones/${phone.id}`} className="text-blue-500 hover:underline">Edit</Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default function AdminPhonesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Phones</h1>
                <Link href="/admin/phones/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Phone
                </Link>
            </div>

            <Suspense fallback={<div>Loading phones...</div>}>
                <PhonesTable />
            </Suspense>
        </div>
    );
}
