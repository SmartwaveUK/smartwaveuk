import { getTranslations } from "next-intl/server";

export default async function TermsPage() {
    const t = await getTranslations("Terms");

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
            <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
                <p>{t("lastUpdated", { date: new Date().toLocaleDateString() })}</p>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">{t("sections.acceptance.title")}</h2>
                    <p>
                        {t("sections.acceptance.content")}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">{t("sections.products.title")}</h2>
                    <p>
                        {t("sections.products.content")}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">{t("sections.pricing.title")}</h2>
                    <p>
                        {t("sections.pricing.content")}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">{t("sections.returns.title")}</h2>
                    <p>
                        {t("sections.returns.content")}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">{t("sections.liability.title")}</h2>
                    <p>
                        {t("sections.liability.content")}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">{t("sections.changes.title")}</h2>
                    <p>
                        {t("sections.changes.content")}
                    </p>
                </section>
            </div>
        </div>
    )
}
