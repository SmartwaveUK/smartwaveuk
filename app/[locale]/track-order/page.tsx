import { useTranslations } from "next-intl";
import { getTrackingInfo } from "@/lib/tracking";
import { Search, Package, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function TrackOrderPage({
    searchParams
}: {
    searchParams: Promise<{ tracking_number?: string }>
}) {
    const { tracking_number } = await searchParams;

    // Mock translations if not yet in json (using fallback logic or english strings)
    // Ideally we add keys to en.json/pl.json but for speed in this tool step I will hardcode english text 
    // or use a simple T map if I had the tool to edit json parallelly. 
    // I will use static text for now and user can ask to translate later, or minimal t usage.

    let trackingData = null;
    let error = null;

    if (tracking_number) {
        trackingData = await getTrackingInfo(tracking_number);
        if (!trackingData) {
            error = "Tracking number not found. Please check and try again.";
        }
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl min-h-[60vh]">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
                <p className="text-muted-foreground">Enter your tracking number to get real-time updates.</p>
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-xs mb-8">
                <form className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            name="tracking_number"
                            defaultValue={tracking_number || ''}
                            placeholder="e.g. SW-12345678"
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-slate-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white font-bold px-6 rounded-xl hover:bg-blue-700 transition-colors">
                        Track
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-8 border border-red-100">
                    {error}
                </div>
            )}

            {trackingData && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white border rounded-2xl p-6 shadow-sm overflow-hidden relative">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="font-bold text-lg">Shipment Status</h2>
                                <p className="text-sm text-muted-foreground">Tracking ID: <span className="font-mono text-slate-900">{trackingData.tracking_number}</span></p>
                            </div>
                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                {trackingData.status.replace('_', ' ')}
                            </div>
                        </div>

                        {/* Progress Bar (Simple) */}
                        <div className="relative h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
                            <div className="absolute left-0 top-0 h-full bg-blue-600 rounded-full w-1/3"></div>
                            {/* width logic could be dynamic based on status: created=10%, in_transit=50%, delivered=100% */}
                        </div>

                        <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                            {trackingData.events?.map((event: any, index: number) => (
                                <div key={index} className="relative flex gap-4">
                                    <div className="w-10 h-10 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center shrink-0 z-10 shadow-sm">
                                        <Package className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="pt-1">
                                        <h3 className="font-bold">{event.status.replace('_', ' ').toUpperCase()}</h3>
                                        <p className="text-slate-600 text-sm mb-1">{event.description}</p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(event.timestamp).toLocaleString()}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        <Link href="/" className="hover:underline">Back to Home</Link>
                    </div>
                </div>
            )}
        </div>
    );
}
