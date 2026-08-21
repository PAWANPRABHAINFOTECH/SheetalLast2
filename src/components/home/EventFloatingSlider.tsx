import { useState, useEffect } from "react";
import { useAdvertisements } from "@/lib/temple.hooks";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ImageLightbox } from "@/components/shared/ImageLightbox";

export function EventFloatingSlider() {
  const { data: ads, isLoading } = useAdvertisements();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string | null>(null);

  const activeAds = ads?.filter(ad => ad.is_active) || [];

  useEffect(() => {
    if (activeAds.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    }, 5000); // 5 seconds rotation as per plan

    return () => clearInterval(timer);
  }, [activeAds.length]);

  if (isLoading || activeAds.length === 0 || !isVisible) return null;

  const currentAd = activeAds[currentIndex];
  if (!currentAd) return null;

  return (
    <div className="fixed bottom-24 left-4 z-40 w-32 sm:w-56 lg:w-64">
      <ImageLightbox src={lightboxSrc} alt={lightboxAlt} onClose={() => setLightboxSrc(null)} />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAd.id}
          initial={{ opacity: 0, x: -20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square overflow-hidden rounded-2xl border-2 border-accent/20 bg-card shadow-2xl group"
        >
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-1 top-1 z-50 h-6 w-6 rounded-full bg-background/50 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsVisible(false);
            }}
          >
            <X className="h-3 w-3" />
          </Button>

          <button
            type="button"
            aria-label={currentAd.title || "Poster"}
            onClick={() => {
              setLightboxSrc(currentAd.image_url);
              setLightboxAlt(currentAd.title ?? null);
            }}
            className="block h-full w-full"
          >
            <img
              src={currentAd.image_url}
              alt={currentAd.title || "Event"}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {currentAd.title && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                <p className="line-clamp-2 font-hindi text-sm font-bold text-white sm:text-base">
                  {currentAd.title}
                </p>
              </div>
            )}
          </button>
        </motion.div>
      </AnimatePresence>
      <div className="mt-2 flex justify-center gap-1.5">
        {activeAds.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              idx === currentIndex ? "w-4 bg-accent" : "w-1 bg-accent/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}