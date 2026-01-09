import { Truck, Clock, Globe, ShieldCheck } from "lucide-react";

export default function ShippingPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Shipping & Delivery</h1>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex gap-4">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-blue-600">
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-blue-900">Free Next Day Delivery</h3>
                        <p className="text-blue-700 text-sm mt-1">On all UK orders over £200 placed before 2 PM.</p>
                    </div>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex gap-4">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-green-600">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-green-900">Insured Shipping</h3>
                        <p className="text-green-700 text-sm mt-1">All packages are fully insured against loss or damage.</p>
                    </div>
                </div>
            </div>

            <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">Domestic Shipping (UK)</h2>
                    <p>
                        We use reliable couriers like Royal Mail and DPD for all domestic shipments.
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Standard Delivery (2-3 working days):</strong> Free for all orders.</li>
                        <li><strong>Next Day Delivery:</strong> £5.99 (Free on orders over £200). Order by 2 PM Mon-Fri.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">International Shipping</h2>
                    <p>
                        We ship to select international destinations. Shipping costs and times vary by location and will be calculated at checkout.
                        Please note that international customers are responsible for any customs duties or import taxes.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">Order Processing</h2>
                    <p>
                        Orders placed before 2 PM GMT on business days are typically processed and dispatched the same day.
                        Orders placed after this time or on weekends/holidays will be dispatched the next business day.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">Returns Policy</h2>
                    <p>
                        We want you to be completely happy with your purchase. If you are not satisfied, you can return items within 14 days of receipt
                        for a refund or exchange, provided they are in their original condition and packaging.
                    </p>
                    <p className="mt-2">
                        To initiate a return, please contact our support team with your order number.
                    </p>
                </section>
            </div>
        </div>
    )
}
