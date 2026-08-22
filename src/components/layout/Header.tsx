import { Link } from "@tanstack/react-router";
import { Phone, Menu, X, Heart, Mail, MessageCircle, Youtube, Instagram, Facebook, Languages, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/lib/theme-provider";

import logoAsset from "@/assets/logo.png.asset.json";
import { useSiteSettings } from "@/lib/temple.hooks";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: settings } = useSiteSettings();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { name: t('nav.home'), to: "/" },
    { name: t('nav.about'), to: "/about" },
    { name: t('nav.live'), to: "/live-darshan" },
    { name: t('nav.news'), to: "/news" },
    { name: t('nav.gallery'), to: "/gallery" },
    { name: t('nav.members'), to: "/members" },
    { name: t('nav.contact'), to: "/contact" },
  ];


  return (
    <header className="z-50 w-full border-b border-primary/10 bg-background">
      <div className="container mx-auto px-4 py-2 lg:py-3">
        <div className="flex items-center justify-between gap-3 lg:gap-4 xl:gap-8">
          {/* Logo & Branding */}
          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3 lg:shrink-0">
            <div className="aspect-square h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 min-[360px]:h-11 min-[360px]:w-11 sm:h-14 sm:w-14 border-secondary shadow-md md:h-20 md:w-20 bg-white">
              <img
                src={logoAsset.url}
                alt="Shital Shivalaya Samiti Logo"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-col justify-center">
              <span className="font-hindi text-[13px] font-bold leading-none text-primary whitespace-nowrap min-[360px]:text-[15px] min-[400px]:text-[16px] sm:text-lg md:text-2xl lg:text-xl xl:text-2xl">
                {settings?.site_name || t('brand.name')}
              </span>
              <span className="font-hindi mt-0.5 text-[9px] leading-tight text-muted-foreground/90 whitespace-normal line-clamp-1 min-[360px]:text-[10px] sm:text-xs md:text-sm lg:text-[11px] xl:text-xs">
                {settings?.address || t('brand.subtitle')}
              </span>
            </div>
          </Link>

          {/* Inline navigation - desktop */}
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-x-1 lg:flex xl:gap-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-hindi px-1 py-2 whitespace-nowrap text-[12px] font-bold text-foreground/80 transition-colors hover:text-primary min-[1100px]:text-[13px] min-[1200px]:px-2 xl:text-[15px]"
                activeProps={{ className: "text-primary font-bold" }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex shrink-0 items-center gap-2 lg:gap-3">
            <div className="hidden items-center gap-2 xl:flex">
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  aria-label="Call"
                  className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Phone className="h-4 w-4" />
                </a>
              )}
              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  aria-label="Email"
                  className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
              {settings?.facebook_enabled && settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground transition-colors hover:text-primary">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {settings?.instagram_enabled && settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground transition-colors hover:text-primary">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {settings?.youtube_enabled && settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-muted-foreground transition-colors hover:text-primary">
                  <Youtube className="h-4 w-4" />
                </a>
              )}
            </div>

            <div className="hidden items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-1.5 py-0.5 shadow-sm min-[1100px]:flex">
              <Languages className="h-3 w-3 text-primary shrink-0" />
              <button
                onClick={() => setLanguage('hi')}
                className={`text-[10px] font-bold transition-colors ${language === 'hi' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                हिन्दी
              </button>
              <span className="text-[9px] text-primary/30">|</span>
              <button
                onClick={() => setLanguage('en')}
                className={`text-[10px] font-bold transition-colors ${language === 'en' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                EN
              </button>
            </div>
            
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden items-center justify-center rounded-full border border-primary/20 bg-primary/5 p-1.5 shadow-sm text-primary transition-colors hover:bg-primary/10 min-[1150px]:flex"
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-3.5 w-3.5" />
              ) : (
                <Moon className="h-3.5 w-3.5" />
              )}
            </button>

            <Button
              size="sm"
              className="font-hindi shrink-0 bg-accent px-2 text-[11px] text-accent-foreground shadow-md hover:bg-accent/90 md:px-5 md:text-sm"
              onClick={() => window.dispatchEvent(new CustomEvent("open-donation-modal"))}
            >
              <Heart className="h-4 w-4 fill-current min-[360px]:mr-1.5 md:mr-2" />
              <span className="hidden min-[400px]:inline">{t('action.donate')}</span>
            </Button>


            <button
              className="-mr-1 p-1.5 text-foreground lg:hidden"
              aria-label="Menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="animate-in fade-in slide-in-from-top-4 border-b bg-background lg:hidden">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
            <div className="flex flex-wrap items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5">
                <Languages className="h-4 w-4 shrink-0 text-primary" />
                <button
                  onClick={() => setLanguage('hi')}
                  className={`text-xs font-bold transition-colors ${language === 'hi' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  हिन्दी
                </button>
                <span className="text-[10px] text-primary/30">|</span>
                <button
                  onClick={() => setLanguage('en')}
                  className={`text-xs font-bold transition-colors ${language === 'en' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  EN
                </button>
              </div>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-hindi flex items-center justify-between border-b border-border/50 py-3 text-base font-medium text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
                <div className="h-2 w-2 rounded-full bg-secondary/30" />
              </Link>
            ))}

            <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-4">
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} aria-label="Call" className="rounded-full bg-primary/5 p-3 text-primary">
                  <Phone className="h-5 w-5" />
                </a>
              )}
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="rounded-full bg-primary/5 p-3 text-primary">
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} aria-label="Email" className="rounded-full bg-primary/5 p-3 text-primary">
                  <Mail className="h-5 w-5" />
                </a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full bg-primary/5 p-3 text-primary">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full bg-primary/5 p-3 text-primary">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="rounded-full bg-primary/5 p-3 text-primary">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
