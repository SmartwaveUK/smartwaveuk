import { getTranslations } from "next-intl/server";

export default async function PrivacyPage() {
    const t = await getTranslations("PrivacyPolicy");

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
            <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
                <p>{t("lastUpdated", { date: new Date().toLocaleDateString() })}</p>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">{t("sections.intro.title")}</h2>
                    <p>
                        {t("sections.intro.content")}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">{t("sections.infoCollect.title")}</h2>
                    <p>{t("sections.infoCollect.content")}</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>{t("sections.infoCollect.list.item1")}</li>
                        <li>{t("sections.infoCollect.list.item2")}</li>
                        <li>{t("sections.infoCollect.list.item3")}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">{t("sections.howUse.title")}</h2>
                    <p>{t("sections.howUse.content")}</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>{t("sections.howUse.list.item1")}</li>
                        <li>{t("sections.howUse.list.item2")}</li>
                        <li>{t("sections.howUse.list.item3")}</li>
                        <li>{t("sections.howUse.list.item4")}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">{t("sections.sharing.title")}</h2>
                    <p>
                        {t("sections.sharing.content")}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">{t("sections.contact.title")}</h2>
                    <p>
                        {t("sections.contact.content")}
                    </p>
                </section>
            </div>
        </div>
    )
}
