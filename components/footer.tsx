import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/language-switcher";

export function Footer() {
    const tNav = useTranslations("Navigation");
    const t = useTranslations("Footer");

    return (
        <footer className="hidden md:block bg-gradient-to-r from-blue-900 to-indigo-900 text-slate-200" style={{ background: "linear-gradient(to bottom, rgba(184, 212, 255, 1), rgba(204, 229, 255, 1))" }}>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="text-transparent bg-clip-text font-bold text-2xl tracking-tight" style={{
                            backgroundImage: "linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                        }}>
                            Smart<span className="">waveUK</span>
                        </Link>
                        <p className="text-slate-800 text-sm leading-relaxed">
                            {t('description')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-black">{t('quickLinks')}</h3>
                        <ul className="space-y-2 text-sm text-slate-800">
                            <li><Link href="/shop" className="text-blue-800 hover:text-blue-400 transition-colors">{tNav('shop')}</Link></li>
                            <li><Link href="/shop?condition=New" className="text-blue-800 hover:text-blue-400 transition-colors">{t('newArrivals')}</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-black">{t('support')}</h3>
                        <ul className="space-y-3 text-sm text-slate-800">
                            <li className="flex items-start gap-3">
                                {/* <MapPin className="w-5 h-5 text-blue-500 shrink-0" /> */}
                                <span>123 Tech Avenue, Silicon Valley<br />CA 94025, USA</span>
                            </li>
                            <li className="flex items-center gap-3">
                                {/* <Phone className="w-5 h-5 text-blue-500 shrink-0" /> */}
                                <span>+44 726 408 767</span>
                            </li>
                            <li className="flex items-center gap-3">
                                {/* <Mail className="w-5 h-5 text-blue-500 shrink-0" /> */}
                                <span>support@smartwaveuk.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-black">{t('stayUpdated')}</h3>
                        <p className="text-sm text-slate-800">{t('subscribeText')}</p>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder={t('emailPlaceholder')}
                                className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-full"
                            />
                            <Button size="default" className="w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-full">
                                <Mail className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-400 flex flex-row md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-4">
                        <p>© {new Date().getFullYear()} SmartwaveUK. {t('rightsReserved')}</p>
                        <LanguageSwitcher />
                    </div>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-slate-300 transition-colors">{t('privacy')}</Link>
                        <Link href="/terms" className="hover:text-slate-300 transition-colors">{t('terms')}</Link>
                        <Link href="/shipping" className="hover:text-slate-300 transition-colors">{t('shipping')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
