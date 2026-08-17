import { Link } from "@tanstack/react-router";
import { Info, Video, Heart, MapPin, Newspaper, ImageIcon, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useDonationModal } from "@/components/shared/DonationModal";

export function QuickActions() {
  const { openModal } = useDonationModal();
  
  const actions = [
    { icon: Info, label: "मंदिर के बारे में", to: "/about", color: "bg-primary/10 text-primary" },
    { icon: Video, label: "लाइव दर्शन", to: "/live-darshan", color: "bg-accent/10 text-accent" },
    { icon: Heart, label: "दान करें", color: "bg-red-500/10 text-red-500", onClick: openModal },
    { icon: MapPin, label: "मंदिर लोकेशन", to: "/location", color: "bg-blue-500/10 text-blue-500" },
    { icon: Newspaper, label: "समाचार", to: "/news", color: "bg-orange-500/10 text-orange-500" },
    { icon: ImageIcon, label: "गैलरी", to: "/gallery", color: "bg-purple-500/10 text-purple-500" },
    { icon: Phone, label: "संपर्क करें", to: "/contact", color: "bg-green-500/10 text-green-500" },
  ];

  return (
    <div className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {actions.map((action, idx) => {
            const content = (
              <Card 
                className="flex flex-col items-center justify-center p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border-primary/10 bg-card cursor-pointer h-full"
                onClick={action.onClick}
              >
                <div className={`p-3 rounded-full mb-3 ${action.color}`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <span className="font-hindi text-sm font-semibold text-foreground">
                  {action.label}
                </span>
              </Card>
            );

            if (action.to) {
              return (
                <Link key={idx} to={action.to} className="h-full">
                  {content}
                </Link>
              );
            }

            return <div key={idx} className="h-full">{content}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
