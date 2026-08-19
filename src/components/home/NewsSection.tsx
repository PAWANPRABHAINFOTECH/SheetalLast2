import { useNews } from "@/lib/temple.hooks";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export function NewsSection() {
  const { data: news, isLoading } = useNews();

  if (isLoading) {
    return <div className="h-96 w-full animate-pulse bg-muted rounded-3xl" />;
  }

  const displayNews = news?.slice(0, 3) || [];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-hindi text-sm font-semibold mb-2">
            अपडेट्स
          </div>
          <h2 className="font-hindi text-3xl md:text-5xl font-bold text-primary">
            महत्वपूर्ण विशेष सूचना
          </h2>
        </div>
        <Button variant="outline" className="border-primary text-primary font-hindi rounded-full" asChild>
          <Link to="/news">सभी विशेष सूचना देखें</Link>
        </Button>
      </div>

      {displayNews.length === 0 ? (
        <div className="bg-muted/30 rounded-3xl p-12 text-center">
          <p className="font-hindi text-lg text-muted-foreground">अभी कोई विशेष सूचना उपलब्ध नहीं है।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayNews.map((item) => (
            <Card key={item.id} className="overflow-hidden border-primary/10 hover:shadow-2xl transition-all hover:-translate-y-2 group">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={item.featured_image_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80"} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                  <Calendar className="h-4 w-4" />
                  <span className="font-inter">{new Date(item.publish_date || Date.now()).toLocaleDateString('hi-IN')}</span>
                </div>
                <h3 className="font-hindi text-xl font-bold text-primary mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="font-hindi text-foreground/70 text-sm line-clamp-3">
                  {item.short_description}
                </p>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0">
                <Link to="/news" className="text-primary font-hindi font-bold text-sm hover:underline">
                  विस्तार से पढ़ें →
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
