import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SiteSettings = {
    site_currency: string;
};

export async function getSiteSettings(): Promise<SiteSettings> {
    const supabase = await createClient();

    // Default settings
    const defaultSettings: SiteSettings = {
        site_currency: 'USD'
    };

    try {
        const { data, error } = await supabase
            .from('settings')
            .select('key, value');

        if (error || !data) {
            console.warn('Error fetching settings, using defaults:', error);
            return defaultSettings;
        }

        // Convert array of key-value pairs to object
        const settingsMap = data.reduce((acc: Record<string, string>, curr: { key: string, value: string }) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        return {
            site_currency: settingsMap['site_currency'] || defaultSettings.site_currency,
        };
    } catch (e) {
        console.error('Exception fetching settings:', e);
        return defaultSettings;
    }
}

export async function updateSiteSetting(key: string, value: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('settings')
        .upsert({ key, value, updated_at: new Date().toISOString() });

    if (error) {
        throw new Error(`Failed to update setting ${key}: ${error.message}`);
    }

    revalidatePath('/', 'layout'); // Revalidate everything as settings are global
}
