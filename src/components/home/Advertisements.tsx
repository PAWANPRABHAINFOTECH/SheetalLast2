import { useAdvertisements } from "@/lib/temple.hooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImageLightbox } from "@/components/shared/ImageLightbox";

export function Advertisements() {
  const { data: ads, isLoading } = useAdvertisements();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string | null } | null>(null);

  if (isLoading || !ads || ads.length === 0) return null;

  return (
    <div className="bg-secondary/5 py-12 border-y border-secondary/20">
      <ImageLightbox src={lightbox?.src ?? null} alt={lightbox?.alt} onClose={() => setLightbox(null)} />
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8">
          {ads.map((ad) => (
            <Card key={ad.id} className="overflow-hidden border-none shadow-none bg-transparent">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2">
                  <button
                    type="button"
                    onClick={() => setLightbox({ src: ad.image_url, alt: ad.title ?? null })}
                    className="block w-full cursor-zoom-in"
                    aria-label={ad.title || "Poster"}
                  >
                    <img
                      src={ad.image_url}
                      alt={ad.title || "Advertisement"}
                      className="w-full h-auto rounded-3xl shadow-xl border-4 border-white"
                    />
                  </button>
                </div>
                <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                  {ad.title && (
                    <h2 className="font-hindi text-3xl md:text-5xl font-bold text-primary leading-tight">
                      {ad.title}
                    </h2>
                  )}
                  {ad.description && (
                    <p className="font-hindi text-lg md:text-xl text-foreground/80 leading-relaxed">
                      {ad.description}
                    </p>
                  )}
                  {ad.button_text && ad.button_url && (
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-hindi px-8" asChild>
                      <a href={ad.button_url}>{ad.button_text}</a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
