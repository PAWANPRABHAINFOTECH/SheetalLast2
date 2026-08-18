import { useSiteSettings } from "@/lib/temple.hooks";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationSection() {
  const { data: settings } = useSiteSettings();

  const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14686.046907722744!2d77.534882!3d23.041696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c40d1e57c61f7%3A0x6b86e0c7a5232c69!2sMandideep%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1712345678901!5m2!1sen!2sin";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-hindi text-sm font-semibold mb-2">
          लोकेशन
        </div>
        <h2 className="font-hindi text-3xl md:text-5xl font-bold text-primary mb-6">
          मंदिर कैसे पहुंचें
        </h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/5 text-primary">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-hindi text-xl font-bold text-primary">पता</h4>
              <p className="font-hindi text-lg text-foreground/80 leading-relaxed">
                {settings?.address || "शीतल सिटी, मंडीदीप, जिला-रायसेन (म.प्र.) – 462046"}
              </p>
            </div>
          </div>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-hindi px-8" asChild>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings?.address || "शीतल सिटी, मंडीदीप, रायसेन")}`}
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Navigation className="mr-2 h-5 w-5" />
              Google Maps पर दिशा देखें
            </a>
          </Button>
        </div>
      </div>
      
      <div className="aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
        <iframe
          src={settings?.google_maps_embed_url || defaultMapUrl}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
