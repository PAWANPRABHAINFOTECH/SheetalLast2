import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n";
import { User, Quote } from "lucide-react";

export function TestimonialsSection() {
  const { t } = useLanguage();
  
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="font-hindi text-3xl md:text-4xl font-bold text-primary mb-4">
          {t('testimonials.title', 'भक्तों के अनुभव')}
        </h2>
        <div className="h-1 w-20 bg-secondary mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((item) => (
          <div 
            key={item.id} 
            className="bg-card border border-primary/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative"
          >
            <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
            
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                {item.photo_url ? (
                  <img src={item.photo_url} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-hindi font-bold text-primary">{item.name}</h3>
                <p className="text-[10px] text-muted-foreground">शीतल शिवालय भक्त</p>
              </div>
            </div>

            <p className="font-hindi text-foreground/80 italic leading-relaxed">
              "{item.content}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
