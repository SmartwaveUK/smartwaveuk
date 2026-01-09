import { getSiteSettings, updateSiteSetting } from "@/lib/settings";
import { revalidatePath } from "next/cache";

async function updateCurrency(formData: FormData) {
    "use server";
    const currency = formData.get("currency") as string;
    if (currency) {
        await updateSiteSetting('site_currency', currency);
        revalidatePath('/admin/settings');
    }
}

export default async function SettingsPage() {
    const settings = await getSiteSettings();
    const currencies = [
        { code: 'USD', label: 'US Dollar ($)' },
        { code: 'EUR', label: 'Euro (€)' },
        { code: 'GBP', label: 'British Pound (£)' },
        { code: 'JPY', label: 'Japanese Yen (¥)' },
        { code: 'CAD', label: 'Canadian Dollar (C$)' },
        { code: 'AUD', label: 'Australian Dollar (A$)' },
    ];

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage global site configuration.</p>
            </div>

            <div className="rounded-lg border p-6 space-y-4">
                <div>
                    <h3 className="text-lg font-medium">Store Currency</h3>
                    <p className="text-sm text-muted-foreground">
                        Select the currency symbol to display across the store.
                        <strong> Note:</strong> This does not convert prices; it only changes the symbol.
                    </p>
                </div>

                <form action={updateCurrency} className="flex gap-4 items-end">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <select
                            name="currency"
                            defaultValue={settings.site_currency}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {currencies.map(c => (
                                <option key={c.code} value={c.code}>
                                    {c.code} - {c.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}
