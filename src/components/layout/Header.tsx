import { Link } from "@tanstack/react-router";
import { Phone, Menu, X, Heart } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={logoAsset.url} 
              alt="Shital Shivalaya Samiti Logo" 
              className="h-14 w-14 object-contain"
            />
            <div className="hidden flex-col md:flex">
              <span className="font-hindi text-xl font-bold text-primary">शीतल शिवालय समिति</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-inter">Mandideep, Raisen (M.P.)</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-hindi text-base font-medium text-foreground/80 transition-colors hover:text-primary"
                activeProps={{ className: "text-primary font-bold" }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {settings?.phone && (
              <Button variant="outline" size="sm" asChild className="hidden sm:flex border-primary text-primary hover:bg-primary/5">
                <a href={`tel:${settings.phone}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  कॉल करें
                </a>
              </Button>
            )}
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md" onClick={() => window.dispatchEvent(new CustomEvent("open-donation-modal"))}>
              <Heart className="mr-2 h-4 w-4 fill-current" />
              दान करें
            </Button>
            
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden rounded-md p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background border-b animate-in fade-in slide-in-from-top-4">
          <nav className="flex flex-col container mx-auto px-4 py-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-hindi text-lg font-medium text-foreground py-2 border-b border-border/50"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {settings?.phone && (
              <a 
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2 py-3 text-primary font-hindi font-medium"
              >
                <Phone className="h-5 w-5" />
                कॉल करें: {settings.phone}
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
