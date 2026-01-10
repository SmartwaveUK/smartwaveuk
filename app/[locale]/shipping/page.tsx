import { Truck, Clock, Globe, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function ShippingPage() {
    const t = await getTranslations("Shipping");

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex gap-4">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-blue-600">
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-blue-900">{t("freeNextDay.title")}</h3>
                        <p className="text-blue-700 text-sm mt-1">{t("freeNextDay.description")}</p>
                    </div>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex gap-4">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-green-600">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-green-900">{t("insured.title")}</h3>
                        <p className="text-green-700 text-sm mt-1">{t("insured.description")}</p>
                    </div>
                </div>
            </div>

            <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">{t("domestic.title")}</h2>
                    <p>
                        {t("domestic.content")}
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>{t("domestic.standard")}:</strong> {t("domestic.standardDesc")}</li>
                        <li><strong>{t("domestic.nextDay")}:</strong> {t("domestic.nextDayDesc")}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">{t("international.title")}</h2>
                    <p>
                        {t("international.content")}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">{t("processing.title")}</h2>
                    <p>
                        {t("processing.content")}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-slate-900">{t("returns.title")}</h2>
                    <p>
                        {t("returns.content")}
                    </p>
                    <p className="mt-2">
                        {t("returns.contact")}
                    </p>
                </section>
            </div>
        </div>
    )
}
