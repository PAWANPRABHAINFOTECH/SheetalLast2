import { Link } from "@tanstack/react-router";
import { Phone, Menu, X, Heart, Mail, MessageCircle, Youtube, Instagram, Facebook } from "lucide-react";
import { useState } from "react";
import logoAsset from "@/assets/logo.png.asset.json";
import { useSiteSettings } from "@/lib/temple.hooks";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: settings } = useSiteSettings();

  const navLinks = [
    { name: "होम", to: "/" },
    { name: "मंदिर के बारे में", to: "/about" },
    { name: "लाइव दर्शन", to: "/live-darshan" },
    { name: "समाचार", to: "/news" },
    { name: "गैलरी", to: "/gallery" },
    { name: "सदस्य", to: "/members" },
    { name: "संपर्क", to: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-primary/10">
      <div className="container mx-auto px-4 py-2 md:py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link to="/" className="shrink-0">
              <div className="h-20 w-20 md:h-[100px] md:w-[100px] rounded-full overflow-hidden border-2 border-secondary shadow-lg aspect-square">
                <img 
                  src={logoAsset.url} 
                  alt="Shital Shivalaya Samiti Logo" 
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
            <div className="flex flex-col">
              <h1 className="font-hindi text-xl md:text-2xl font-bold text-primary leading-tight">शीतल शिवालय समिति</h1>
              <p className="font-hindi text-xs md:text-sm text-foreground/70">शीतल सिटीज, मंडीदीप, जिला-रायसेन (म.प्र.)</p>
            </div>
          </div>

          {/* Contact & Social - Desktop */}
          <div className="hidden md:flex flex-col items-end gap-3">
            <div className="flex items-center gap-6">
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 group transition-colors hover:text-primary">
                  <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-inter">Call Now</span>
                    <span className="text-sm font-bold font-inter">{settings.phone}</span>
                  </div>
                </a>
              )}
              {settings?.whatsapp && (
                <a 
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group transition-colors hover:text-green-600"
                >
                  <div className="bg-green-100 p-2 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-inter">WhatsApp</span>
                    <span className="text-sm font-bold font-inter">{settings.whatsapp}</span>
                  </div>
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 group transition-colors hover:text-primary">
                  <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-inter">Email Us</span>
                    <span className="text-sm font-bold font-inter">{settings.email}</span>
                  </div>
                </a>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 mr-4 border-r pr-4 border-border">
                {settings?.facebook_enabled && settings.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {settings?.instagram_enabled && settings.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {settings?.youtube_enabled && settings.youtube_url && (
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Youtube className="h-4 w-4" />
                  </a>
                )}
              </div>
              <Button 
                size="sm" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md font-hindi px-6" 
                onClick={() => window.dispatchEvent(new CustomEvent("open-donation-modal"))}
              >
                <Heart className="mr-2 h-4 w-4 fill-current" />
                दान करें
              </Button>
            </div>
          </div>

          {/* Mobile Actions Row */}
          <div className="flex md:hidden items-center justify-between w-full border-t border-b py-2 border-border/50">
            <div className="flex items-center gap-4">
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="text-primary p-2">
                  <Phone className="h-5 w-5" />
                </a>
              )}
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 p-2">
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="text-primary p-2">
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                className="bg-accent text-accent-foreground text-[10px] py-1 h-8 font-hindi" 

                onClick={() => window.dispatchEvent(new CustomEvent("open-donation-modal"))}
              >
                दान करें
              </Button>
              <button
                className="p-2 text-foreground"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Desktop */}
      <nav className="hidden md:block bg-primary py-2">
        <div className="container mx-auto px-4 flex justify-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-hindi text-sm font-medium text-white/90 transition-colors hover:text-secondary"
              activeProps={{ className: "text-secondary font-bold" }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b animate-in fade-in slide-in-from-top-4 fixed inset-x-0 top-[170px] bottom-0 z-[100] overflow-y-auto">
          <nav className="flex flex-col container mx-auto px-4 py-6 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-hindi text-lg font-medium text-foreground py-3 border-b border-border/50 flex items-center justify-between"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
                <div className="h-2 w-2 rounded-full bg-secondary/30" />
              </Link>
            ))}
            
            <div className="mt-6 pt-6 border-t flex flex-col gap-4">
              <p className="text-xs uppercase text-muted-foreground font-inter font-bold">Connect With Us</p>
              <div className="flex gap-6">
                {settings?.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="bg-primary/5 p-3 rounded-full text-primary">
                    <Facebook className="h-6 w-6" />
                  </a>
                )}
                {settings?.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="bg-primary/5 p-3 rounded-full text-primary">
                    <Instagram className="h-6 w-6" />
                  </a>
                )}
                {settings?.youtube_url && (
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="bg-primary/5 p-3 rounded-full text-primary">
                    <Youtube className="h-6 w-6" />
                  </a>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

