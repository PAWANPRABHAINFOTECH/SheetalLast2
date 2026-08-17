import { useState, useEffect } from "react";
import { useHeroSlides } from "@/lib/temple.hooks";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HeroSlider() {
  const { data: slides, isLoading } = useHeroSlides();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  if (isLoading) {
    return <div className="h-[60vh] md:h-[80vh] w-full bg-muted animate-pulse" />;
  }

  if (!slides || slides.length === 0) {
    return (
      <div className="h-[60vh] md:h-[80vh] w-full bg-primary/10 flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="font-hindi text-3xl md:text-5xl font-bold text-primary mb-4">
            शीतल शिवालय समिति
          </h2>
          <p className="font-hindi text-lg text-foreground/80">
            मंडीदीप, जिला-रायसेन (मध्यप्रदेश)
          </p>
        </div>
      </div>
    );
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden group">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image_url})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
            <div className={`max-w-4xl transform transition-transform duration-1000 ${
              index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}>
              {slide.title && (
                <h1 className="font-hindi text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                  {slide.title}
                </h1>
              )}
              {slide.subtitle && (
                <p className="font-hindi text-lg md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
                  {slide.subtitle}
                </p>
              )}
              {slide.button_text && slide.button_url && (
                <Button 
                  size="lg" 
                  className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-xl font-hindi rounded-full shadow-xl"
                  asChild
                >
                  <Link to={slide.button_url as any}>{slide.button_text}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? "w-8 bg-accent" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
