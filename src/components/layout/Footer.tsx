import { Link } from "@tanstack/react-router";
import { useSiteSettings, useTempleTimings, useChairmanMessage } from "@/lib/temple.hooks";
import logoAsset from "@/assets/logo.png.asset.json";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  const { data: settings } = useSiteSettings();
  const { data: timings } = useTempleTimings();
  const { data: chairman } = useChairmanMessage();

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* About Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-white rounded-full p-2">
                <img 
                  src={logoAsset.url} 
                  alt="Logo" 
                  className="h-12 w-12 object-contain"
                />
              </div>
              <span className="font-hindi text-xl font-bold">शीतल शिवालय समिति</span>
            </Link>
            <p className="font-hindi text-primary-foreground/80 leading-relaxed">
              यह मुख्य रूप से भगवान शिव का मंदिर है जो शीतल सिटी मंडीदीप में स्थित है। मंदिर समिति के मार्गदर्शन में निरंतर सेवा कार्य जारी हैं।
            </p>
            <div className="flex gap-4">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-hindi text-xl font-bold mb-6 border-b border-white/10 pb-2 inline-block">त्वरित लिंक</h4>
            <ul className="space-y-4 font-hindi">
              <li><Link to="/about" className="hover:text-secondary transition-colors">मंदिर के बारे में</Link></li>
              <li><Link to="/live-darshan" className="hover:text-secondary transition-colors">लाइव दर्शन</Link></li>
              <li><Link to="/news" className="hover:text-secondary transition-colors">समाचार</Link></li>
              <li><Link to="/gallery" className="hover:text-secondary transition-colors">गैलरी</Link></li>
              <li><Link to="/donate" className="hover:text-secondary transition-colors">दान करें</Link></li>
              <li><Link to="/contact" className="hover:text-secondary transition-colors">संपर्क करें</Link></li>
            </ul>
          </div>

          {/* Timings Column */}
          <div>
            <h4 className="font-hindi text-xl font-bold mb-6 border-b border-white/10 pb-2 inline-block">दर्शन समय</h4>
            <ul className="space-y-4 font-hindi text-sm">
              {timings?.map((t) => (
                <li key={t.id} className="flex justify-between gap-4">
                  <span className="font-semibold">{t.title}:</span>
                  <span className="text-primary-foreground/80">{t.timing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-hindi text-xl font-bold mb-6 border-b border-white/10 pb-2 inline-block">संपर्क विवरण</h4>
            <ul className="space-y-4 font-hindi">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-secondary" />
                <span className="text-sm">{settings?.address || "शीतल सिटीज, मंडीदीप, रायसेन"}</span>
              </li>
              {settings?.phone && (
                <li className="flex gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-secondary" />
                  <a href={`tel:${settings.phone}`} className="hover:text-secondary transition-colors">{settings.phone}</a>
                </li>
              )}
              {settings?.email && (
                <li className="flex gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-secondary" />
                  <a href={`mailto:${settings.email}`} className="hover:text-secondary transition-colors">{settings.email}</a>
                </li>
              )}
            </ul>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs font-inter text-white/60">Reg No: {settings?.registration_no}</p>
            </div>
          </div>
        </div>

        {/* Chairman Compact */}
        {chairman && (
          <div className="bg-white/5 rounded-2xl p-6 mb-12 border border-white/10">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img src={chairman.photo_url || ""} alt="Chairman" className="h-16 w-16 rounded-full border-2 border-secondary object-cover" />
              <div className="flex-1 text-center md:text-left">
                <p className="font-hindi italic text-sm text-primary-foreground/70 mb-2">"{chairman.message.substring(0, 150)}..."</p>
                <p className="font-hindi text-xs font-bold">— {chairman.name} ({chairman.designation})</p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-hindi text-sm text-primary-foreground/60 text-center">
            © 2026 शीतल शिवालय समिति. सर्वाधिकार सुरक्षित।
          </p>
          <div className="flex gap-6 font-hindi text-xs text-primary-foreground/60">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
