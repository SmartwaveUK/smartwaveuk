export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
            <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using the SmartwaveUK website, you agree to comply with and be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">2. Products and Services</h2>
                    <p>
                        We strive to display our products as accurately as possible. However, we do not warrant that product descriptions,
                        images, or other content on the site are accurate, complete, reliable, current, or error-free.
                        All products are subject to availability.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">3. Pricing and Payments</h2>
                    <p>
                        All prices are listed in the currency displayed at checkout. We reserve the right to change prices at any time without notice.
                        Payments must be received in full before orders are dispatched.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">4. Returns and Refunds</h2>
                    <p>
                        We offer a return policy for defective or unsatisfactory items within the timeframe specified in our Shipping & Returns policy.
                        Items must be returned in their original condition.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">5. Limitation of Liability</h2>
                    <p>
                        SmartwaveUK shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection
                        with the use of our website or products.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">6. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these Terms of Service at any time. Your continued use of the website following any changes
                        indicates your acceptance of the new terms.
                    </p>
                </section>
            </div>
        </div>
    )
}
