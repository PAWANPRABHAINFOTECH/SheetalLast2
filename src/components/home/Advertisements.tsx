import { useAdvertisements } from "@/lib/temple.hooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

export function Advertisements() {
  const { data: ads, isLoading } = useAdvertisements();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isLoading || !ads || ads.length === 0) return null;

  return (
    <div className="bg-secondary/5 py-12 border-y border-secondary/20">
      <div className="container mx-auto px-4">
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="max-w-[90vw] md:max-w-4xl p-0 border-none bg-black/90 shadow-2xl overflow-hidden rounded-2xl">
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/80"
              >
                <X className="h-6 w-6" />
              </button>
              <img 
                src={selectedImage || ""} 
                alt="Enlarged Poster" 
                className="max-w-full max-h-[80vh] object-contain shadow-2xl"
              />
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex flex-col gap-8">
          {ads.map((ad) => (
            <Card key={ad.id} className="overflow-hidden border-none shadow-none bg-transparent">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2">
                  <button 
                    onClick={() => setSelectedImage(ad.image_url)}
                    className="w-full cursor-pointer transition-transform hover:scale-[1.02]"
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
