import { useTempleInfo } from "@/lib/temple.hooks";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function AboutTempleSection() {
  const { data: info, isLoading } = useTempleInfo();
  
  const aboutContent = info?.find(i => i.section_name === 'about')?.content || 
    "यह मुख्य रूप से भगवान शिव का मंदिर है जो शीतल सिटी में स्थित है। वर्तमान में मंदिर का निर्माण कार्य जारी है। मंदिर की पहली मंजिल में देवताओं के चार गर्भगृह हैं...";

  return (
    <div className="space-y-6">
      <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-hindi text-sm font-semibold mb-2">
        परिचय
      </div>
      <h2 className="font-hindi text-3xl md:text-4xl font-bold text-primary leading-tight">
        शीतल शिवालय मंदिर के बारे में जानें
      </h2>
      
      <div className="prose prose-lg max-w-none text-foreground/80 font-hindi leading-relaxed">
        <p className="whitespace-pre-line line-clamp-6">
          {aboutContent}
        </p>
      </div>
      
      <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-hindi px-8" asChild>
        <Link to="/about">विस्तार से पढ़ें</Link>
      </Button>
      
      <div className="pt-8 border-t border-border/50 grid grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <p className="text-3xl font-bold text-primary">2026</p>
          <p className="font-hindi text-sm text-muted-foreground">निर्माण वर्ष</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-primary">24/7</p>
          <p className="font-hindi text-sm text-muted-foreground">आध्यात्मिक सेवा</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-primary">{useSiteSettings().data?.devotee_count || "1000+"}</p>
          <p className="font-hindi text-sm text-muted-foreground">भक्त जुड़ाव</p>
        </div>
      </div>
    </div>
  );
}
