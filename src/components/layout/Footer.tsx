import { Link } from "@tanstack/react-router";
import { useSiteSettings, useTempleInfo } from "@/lib/temple.hooks";
import logoAsset from "@/assets/logo.png.asset.json";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, ChevronRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer() {
  const { data: settings } = useSiteSettings();
  const { data: templeInfo } = useTempleInfo();
  
  const aboutContent = templeInfo?.find(info => info.section_name === 'about')?.content || 
    "यह मुख्य रूप से भगवान शिव का मंदिर है जो शीतल सिटी मंडीदीप में स्थित है। मंदिर समिति के मार्गदर्शन में निरंतर सेवा कार्य जारी हैं।";

  const handleDonateClick = () => {
    window.dispatchEvent(new CustomEvent("open-donation-modal"));
  };

  const socialLinks = [
    { id: 'facebook', icon: Facebook, url: settings?.facebook_url, enabled: settings?.facebook_enabled },
    { id: 'instagram', icon: Instagram, url: settings?.instagram_url, enabled: settings?.instagram_enabled },
    { id: 'youtube', icon: Youtube, url: settings?.youtube_url, enabled: settings?.youtube_enabled },
  ].filter(link => link.enabled && link.url);

  const quickLinks = [
    { name: "मुख्य पृष्ठ", to: "/" },
    { name: "मंदिर के बारे में", to: "/about" },
    { name: "लाइव दर्शन", to: "/live-darshan" },
    { name: "समाचार", to: "/news" },
    { name: "गैलरी", to: "/gallery" },
    { name: "सदस्य सूची", to: "/members" },
    { name: "संपर्क", to: "/contact" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t border-secondary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: About Us */}
          <div className="space-y-6">
            <h4 className="font-hindi text-xl font-bold text-secondary flex items-center gap-2">
              About Us
            </h4>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="font-hindi text-primary-foreground/90 leading-relaxed line-clamp-4">
                {aboutContent}
              </p>
              <Link 
                to="/about" 
                className="inline-flex items-center gap-1 mt-4 text-secondary hover:text-secondary/80 font-hindi text-sm font-bold transition-colors"
              >
                और पढ़ें <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Column 2: त्वरित लिंक */}
          <div>
            <h4 className="font-hindi text-xl font-bold text-secondary mb-6 flex items-center gap-2">
              त्वरित लिंक
            </h4>
            <ul className="space-y-3 font-hindi">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to as any} 
                    className="flex items-center gap-2 text-primary-foreground/80 hover:text-secondary transition-colors group text-sm py-1"
                  >
                    <ChevronRight className="h-3 w-3 text-secondary/50 group-hover:text-secondary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: संपर्क विवरण */}
          <div className="space-y-6">
            <h4 className="font-hindi text-xl font-bold text-secondary flex items-center gap-2">
              संपर्क विवरण
            </h4>
            <ul className="space-y-4 font-hindi">
              <li className="flex gap-4">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
                  <MapPin className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <span className="text-[10px] text-white/50 block uppercase tracking-wider">पता</span>
                  <span className="text-sm leading-relaxed">{settings?.address || "शीतल सिटी, मंडीदीप, जिला-रायसेन (म.प्र.) – 462046"}</span>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
                  <Phone className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <span className="text-[10px] text-white/50 block uppercase tracking-wider">मोबाइल नंबर</span>
                  <a href={`tel:${settings?.phone?.replace(/\s/g, "") || "+918319322374"}`} className="text-sm hover:text-secondary transition-colors font-inter">
                    {settings?.phone || "+91 831 932 2374"}
                  </a>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-secondary">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] text-white/50 block uppercase tracking-wider">WhatsApp</span>
                  <a 
                    href={`https://wa.me/${settings?.whatsapp?.replace(/\D/g, "") || "918319322374"}?text=नमस्कार, मुझे शीतल शिवालय समिति के संबंध में जानकारी चाहिए।`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm hover:text-secondary transition-colors font-inter"
                  >
                    {settings?.whatsapp || "+91 831 932 2374"}
                  </a>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
                  <Mail className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <span className="text-[10px] text-white/50 block uppercase tracking-wider">ईमेल</span>
                  <a href={`mailto:${settings?.email || "info@sheetalshivayalaya.org"}`} className="text-sm hover:text-secondary transition-colors font-inter">
                    {settings?.email || "info@sheetalshivayalaya.org"}
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: सहयोग करें */}
          <div className="space-y-6">
            <h4 className="font-hindi text-xl font-bold text-secondary flex items-center gap-2">
              सहयोग करें
            </h4>
            <div className="space-y-4">
              <p className="font-hindi text-sm text-primary-foreground/90 leading-relaxed italic border-l-2 border-secondary/30 pl-4">
                मंदिर के विकास और धार्मिक कार्यों में अपना योगदान देकर पुण्य के भागी बनें।
              </p>
              
              <button 
                onClick={handleDonateClick}
                className="w-full flex items-center justify-center gap-2 font-hindi bg-accent hover:bg-accent/90 text-accent-foreground py-4 px-6 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 group"
              >
                <Heart className="h-5 w-5 fill-current group-hover:animate-pulse" />
                ऑनलाइन दान दें
              </button>

              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <h5 className="font-hindi text-sm font-bold text-secondary">फॉलो करें</h5>
                  <div className="flex items-center gap-3">
                    {socialLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <a 
                          key={link.id}
                          href={link.url || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-foreground/80 hover:text-secondary transition-colors"
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      );
                    })}
                    {socialLinks.length === 0 && (
                      <p className="text-[10px] text-white/30 italic font-hindi">लिंक एडमिन पैनल से जोड़ें</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-white/5">
              <p className="text-[10px] font-inter text-white/40 uppercase tracking-widest">Registration</p>
              <p className="text-xs text-white/60 font-inter">Reg No: {settings?.registration_no || "01/02/03/43247/26"}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left space-y-2">
              <p className="font-hindi text-sm text-primary-foreground/60">
                © 2026 शीतल शिवालय समिति. सर्वाधिकार सुरक्षित।
              </p>
              <div className="text-[10px] md:text-xs font-inter tracking-[0.2em] text-primary-foreground/30 text-center md:text-left uppercase">
                Designed & Developed by{" "}
                <a 
                  href="https://pawanprabhainfotech.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors font-bold text-primary-foreground/50"
                >
                  PAWANPRABHA INFOTECH
                </a>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-hindi text-xs text-primary-foreground/50">
              <Link to="/privacy-policy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
              <span className="opacity-20 hidden md:inline">|</span>
              <Link to="/terms-and-conditions" className="hover:text-secondary transition-colors">Terms & Conditions</Link>
              <span className="opacity-20 hidden md:inline">|</span>
              <Link to="/refund-policy" className="hover:text-secondary transition-colors">Refund Policy</Link>
              <span className="opacity-20 hidden md:inline">|</span>
              <Link to="/admin/login" className="hover:text-secondary transition-colors font-medium opacity-80">Admin Login</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

