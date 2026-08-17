import { Link } from "@tanstack/react-router";
import { useSiteSettings, useTempleTimings, useChairmanMessage } from "@/lib/temple.hooks";
import logoAsset from "@/assets/logo.png.asset.json";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, MessageCircle } from "lucide-react";

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
                <span className="text-sm">शीतल सिटीज, मंडीदीप, जिला-रायसेन (म.प्र.) – 462046</span>
              </li>
              
              <li className="flex gap-3">
                <Phone className="h-5 w-5 shrink-0 text-secondary" />
                <div className="flex flex-col">
                  <span className="text-xs text-white/60 font-hindi">मोबाइल नंबर</span>
                  <a href="tel:+918319322374" className="hover:text-secondary transition-colors">+91 831 932 2374</a>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="h-5 w-5 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-secondary">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-white/60 font-hindi">WhatsApp</span>
                  <a 
                    href="https://wa.me/918319322374?text=नमस्कार, मुझे शीतल शिवालय समिति के संबंध में जानकारी चाहिए।" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-secondary transition-colors"
                  >
                    +91 831 932 2374
                  </a>
                </div>
              </li>

              {settings?.email && (
                <li className="flex gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-secondary" />
                  <div className="flex flex-col">
                    <span className="text-xs text-white/60 font-hindi">ईमेल</span>
                    <a href={`mailto:${settings.email}`} className="hover:text-secondary transition-colors">{settings.email}</a>
                  </div>
                </li>
              )}
            </ul>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs font-inter text-white/60">Reg No: 01/02/03/43247/26</p>
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
        <div className="pt-8 border-t border-white/10 flex flex-col items-center gap-6">
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
            <p className="font-hindi text-sm text-primary-foreground/60 text-center">
              © 2026 शीतल शिवालय समिति. सर्वाधिकार सुरक्षित।
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 font-hindi text-xs text-primary-foreground/60">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
              <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>
          
          <div className="text-[10px] md:text-xs font-inter tracking-wider text-primary-foreground/40 text-center uppercase">
            Designed & Developed by{" "}
            <a 
              href="https://pawanprabhainfotech.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-secondary transition-colors font-semibold"
            >
              PAWAN PRABHA INFOTECH
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
