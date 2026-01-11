import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function DashboardStats() {
    const supabase = await createClient();

    // Fetch stats in parallel
    const [
        { count: totalPhones },
        { count: pendingInquiries },
        { data: totalRevenueData },
        { count: activeOrders }
    ] = await Promise.all([
        supabase.from("items").select("*", { count: 'exact', head: true }),
        supabase.from("inquiries").select("*", { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from("orders").select("total_amount, currency"),
        supabase.from("orders").select("*", { count: 'exact', head: true }).or('status.eq.paid,status.eq.processing')
    ]);

    // Calculate total revenue safely
    // Note: This is a simple sum. In a real app with multiple currencies, you'd need normalization.
    const totalRevenue = totalRevenueData?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;
    // Assuming mostly GBP or USD for now, just formatting as number
    const formattedRevenue = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(totalRevenue);


    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex flex-col space-y-1.5">
                    <h3 className="font-semibold leading-none tracking-tight">Total Revenue</h3>
                </div>
                <div className="p-0 pt-4">
                    <div className="text-2xl font-bold">{formattedRevenue}</div>
                    <p className="text-xs text-muted-foreground">Lifetime sales</p>
                </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex flex-col space-y-1.5">
                    <h3 className="font-semibold leading-none tracking-tight">Active Orders</h3>
                </div>
                <div className="p-0 pt-4">
                    <div className="text-2xl font-bold">{activeOrders || 0}</div>
                    <p className="text-xs text-muted-foreground">Paid & Processing</p>
                </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex flex-col space-y-1.5">
                    <h3 className="font-semibold leading-none tracking-tight">Total Phones</h3>
                </div>
                <div className="p-0 pt-4">
                    <div className="text-2xl font-bold">{totalPhones || 0}</div>
                    <p className="text-xs text-muted-foreground">In inventory</p>
                </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex flex-col space-y-1.5">
                    <h3 className="font-semibold leading-none tracking-tight">Pending Inquiries</h3>
                </div>
                <div className="p-0 pt-4">
                    <div className="text-2xl font-bold">{pendingInquiries || 0}</div>
                    <p className="text-xs text-muted-foreground">Requires attention</p>
                </div>
            </div>
        </div>
    )
}

export default async function AdminDashboard() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your store performance.
                </p>
            </div>

            <Suspense fallback={<div>Loading stats...</div>}>
                <DashboardStats />
            </Suspense>
        </div>
    );
}
