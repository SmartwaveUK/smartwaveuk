export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
            <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">1. Introduction</h2>
                    <p>
                        Welcome to SmartwaveUK ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                        This Privacy Policy describes how we collect, use, and process your personal data when you use our website and services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">2. Information We Collect</h2>
                    <p>We collect personal information that you provide to us voluntarily when you register, make a purchase, or contact us. This may include:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Name, email address, phone number, and postal address.</li>
                        <li>Payment information and billing address.</li>
                        <li>Order history and preferences.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">3. How We Use Your Information</h2>
                    <p>We use your personal information to:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Process and fulfill your orders.</li>
                        <li>Communicate with you regarding your account or orders.</li>
                        <li>Improve our website and customer service.</li>
                        <li>Send you marketing communications (if you have opted in).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">4. Sharing Your Information</h2>
                    <p>
                        We do not sell your personal information. We may share your data with trusted third-party service providers
                        (such as payment processors and shipping couriers) solely for the purpose of fulfilling our services to you.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">5. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at support@smartwaveuk.com.
                    </p>
                </section>
            </div>
        </div>
    )
}
