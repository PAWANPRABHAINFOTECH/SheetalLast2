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
    <header className="z-50 w-full border-b border-primary/10 bg-background">
      <div className="container mx-auto px-4 py-2 lg:py-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 lg:flex lg:gap-6">
          {/* Logo & Branding */}
          <Link to="/" className="flex min-w-0 items-center gap-3 lg:shrink-0">
            <div className="aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-secondary shadow-md md:h-20 md:w-20">
              <img
                src={logoAsset.url}
                alt="Shital Shivalaya Samiti Logo"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="font-hindi truncate text-base font-bold leading-tight text-primary md:text-xl">
                शीतल शिवालय समिति
              </span>
              <span className="font-hindi truncate text-[10px] text-foreground/70 md:text-xs">
                शीतल सिटी, मंडीदीप, जिला-रायसेन (म.प्र.)
              </span>
            </div>
          </Link>

          {/* Inline navigation - desktop */}
          <nav className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-x-4 gap-y-1 lg:flex xl:gap-x-5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-hindi whitespace-nowrap text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
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

            <Button
              size="sm"
              className="font-hindi bg-accent px-3 text-[11px] text-accent-foreground shadow-md hover:bg-accent/90 md:px-5 md:text-sm"
              onClick={() => window.dispatchEvent(new CustomEvent("open-donation-modal"))}
            >
              <Heart className="mr-1.5 h-4 w-4 fill-current md:mr-2" />
              दान करें
            </Button>

            <button
              className="p-2 text-foreground lg:hidden"
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
