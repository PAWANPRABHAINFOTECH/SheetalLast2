import { Phone, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/temple.hooks";
import { useDonationModal } from "./DonationModal";

export function FloatingActions() {
  const { data: settings } = useSiteSettings();
  const { openModal } = useDonationModal();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
      <Button 
        size="icon" 
        className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-2xl text-white transition-transform hover:scale-110"
        asChild
      >
        <a 
          href="https://wa.me/918319322374?text=नमस्कार, मुझे शीतल शिवालय समिति के संबंध में जानकारी चाहिए।" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <MessageCircle className="h-8 w-8" />
        </a>
      </Button>
      
      <Button 
        size="icon" 
        className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-2xl text-white transition-transform hover:scale-110"
        asChild
      >
        <a href="tel:+918319322374">
          <Phone className="h-8 w-8" />
        </a>
      </Button>

      <Button 
        size="icon" 
        className="h-14 w-14 rounded-full bg-accent hover:bg-accent/90 shadow-2xl text-accent-foreground animate-bounce transition-transform hover:scale-110"
        onClick={openModal}
      >
        <Heart className="h-8 w-8 fill-current" />
      </Button>
    </div>
  );
}
