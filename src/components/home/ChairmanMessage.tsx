import { useChairmanMessage } from "@/lib/temple.hooks";
import { Quote } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function ChairmanMessage() {
  const { data: chairman, isLoading } = useChairmanMessage();

  if (isLoading) return <div className="h-64 w-full animate-pulse bg-muted rounded-3xl" />;
  if (!chairman) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="relative shrink-0">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-white shadow-2xl overflow-hidden relative z-10">
            <Avatar className="w-full h-full">
              <AvatarImage src={chairman.photo_url || ""} className="object-cover" />
              <AvatarFallback className="font-hindi text-2xl">{chairman.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          {/* Decorative Ring */}
          <div className="absolute -inset-4 border-4 border-dashed border-secondary/30 rounded-full animate-spin-slow z-0" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <Quote className="h-12 w-12 text-secondary mb-6 mx-auto md:mx-0 opacity-50" />
          <h2 className="font-hindi text-3xl md:text-4xl font-bold text-primary mb-2">अध्यक्ष का संदेश</h2>
          <div className="prose prose-lg max-w-none text-foreground/80 font-hindi italic mb-8 leading-relaxed">
            "{chairman.message}"
          </div>
          <div>
            <h4 className="font-hindi text-xl font-bold text-primary">{chairman.name}</h4>
            <p className="font-hindi text-secondary font-semibold">{chairman.designation}</p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
