import { getPhones } from "@/lib/data";
import { getSiteSettings } from "@/lib/settings";
import { StoreDashboard } from "@/components/store-dashboard";

export default async function Home() {
  const phones = await getPhones();
  const settings = await getSiteSettings();

  return (
    <main>
      <StoreDashboard
        initialPhones={phones}
        currency={settings.site_currency}
      />
    </main>
  );
}

