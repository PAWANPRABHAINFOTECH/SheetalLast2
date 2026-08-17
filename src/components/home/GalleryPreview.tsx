import { useGallery } from "@/lib/temple.hooks";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

export function GalleryPreview() {
  const { data: gallery, isLoading } = useGallery();

  if (isLoading) return <div className="h-96 w-full animate-pulse bg-muted rounded-3xl" />;

  const displayImages = gallery?.slice(0, 6) || [];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 text-center md:text-left">
        <div>
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-hindi text-sm font-semibold mb-2">
            स्मृतियां
          </div>
          <h2 className="font-hindi text-3xl md:text-5xl font-bold text-primary">
            मंदिर गैलरी
          </h2>
        </div>
        <Button variant="outline" className="border-primary text-primary font-hindi rounded-full" asChild>
          <Link to="/gallery">पूरी गैलरी देखें</Link>
        </Button>
      </div>

      {displayImages.length === 0 ? (
        <div className="bg-muted/30 rounded-3xl p-12 text-center">
          <p className="font-hindi text-lg text-muted-foreground">गैलरी में सामग्री शीघ्र उपलब्ध होगी।</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {displayImages.map((item, index) => (
            <div 
              key={item.id} 
              className={`relative overflow-hidden rounded-2xl group ${
                index === 0 ? "col-span-2 row-span-2 md:col-span-1 md:row-span-1" : ""
              }`}
            >
              <img 
                src={item.image_url} 
                alt={item.title || "Gallery"}
                className="w-full h-full object-cover aspect-square transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="text-white">
                  <h4 className="font-hindi font-bold">{item.title}</h4>
                  <p className="font-hindi text-xs text-white/80">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
