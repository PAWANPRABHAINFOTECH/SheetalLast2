import { useTempleTimings } from "@/lib/temple.hooks";
import { Clock, Sun, Moon, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function TempleTimings() {
  const { data: timings, isLoading } = useTempleTimings();

  const iconMap: Record<string, any> = {
    "दर्शन": Clock,
    "प्रातःकालीन आरती": Sun,
    "संध्या आरती": Moon,
    "हवन एवं पूजन": (props: any) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c1 2 2 3.5 2 5.5 0 2.21-1.79 4-4 4s-4-1.79-4-4c0-2 1-3.5 2-5.5 1 2 2 3.5 2 5.5"/>
        <path d="M18 10c1 2 2 3.5 2 5.5 0 2.21-1.79 4-4 4s-4-1.79-4-4c0-2 1-3.5 2-5.5 1 2 2 3.5 2 5.5"/>
        <path d="M6 10c1 2 2 3.5 2 5.5 0 2.21-1.79 4-4 4s-4-1.79-4-4c0-2 1-3.5 2-5.5 1 2 2 3.5 2 5.5"/>
      </svg>
    ),
    "default": Sparkles
  };

  return (
    <Card className="border-secondary border-2 shadow-xl overflow-hidden bg-card">
      <CardHeader className="bg-primary text-primary-foreground text-center py-6">
        <CardTitle className="font-hindi text-2xl flex items-center justify-center gap-2">
          <Clock className="h-6 w-6 text-secondary" />
          दर्शन एवं आरती समय
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="p-6 animate-pulse bg-muted/20" />
            ))
          ) : timings?.map((item) => {
            const Icon = iconMap[item.title] || iconMap['default'];
            return (
              <div key={item.id} className="flex items-center gap-4 p-6 hover:bg-primary/5 transition-colors">
                <div className="p-3 rounded-full bg-secondary/10 text-secondary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-hindi text-lg font-bold text-primary">{item.title}</h4>
                  <p className="font-hindi text-foreground/80">{item.timing}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-6 bg-muted/30">
          <p className="font-hindi text-sm text-muted-foreground italic text-center">
            * समय धार्मिक त्योहारों और विशेष अवसरों पर परिवर्तित हो सकता है।
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
