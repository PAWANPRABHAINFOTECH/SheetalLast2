import { useState, useEffect, useCallback } from "react";
import { useHeroSlides } from "@/lib/temple.hooks";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function HeroSlider() {
  const { data: slides, isLoading } = useHeroSlides();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    if (!slides || slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides]);

  const prevSlide = useCallback(() => {
    if (!slides || slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides]);

  useEffect(() => {
    if (!slides || slides.length === 0 || isHovered) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [slides, isHovered, nextSlide]);

  if (isLoading) {
    return (
      <div className="relative h-[300px] md:h-[450px] lg:h-[550px] w-full bg-muted animate-pulse overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-muted to-muted/50" />
      </div>
    );
  }

  // Filter to exactly 3 slides if we have more, or show what we have
  const displaySlides = slides?.slice(0, 3) || [];

  if (displaySlides.length === 0) {
    return (
      <div className="h-[300px] md:h-[450px] lg:h-[550px] w-full bg-primary/5 flex items-center justify-center border-b border-primary/10">
        <div className="text-center px-4 max-w-2xl">
          <h2 className="font-hindi text-3xl md:text-5xl font-bold text-primary mb-4">
            शीतल शिवालय समिति
          </h2>
          <p className="font-hindi text-lg md:text-xl text-foreground/80">
            मंडीदीप, जिला-रायसेन (मध्यप्रदेश)
          </p>
        </div>
      </div>
    );
  }

  return (
    <section 
      className="relative h-[320px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Temple Highlights"
    >
      {displaySlides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            )}
          >
            {/* Background Image with Ken Burns Effect */}
            <div 
              className={cn(
                "absolute inset-0 bg-cover transition-transform duration-[8000ms] ease-linear",
                isActive ? "scale-110" : "scale-100"
              )}
              style={{ 
                backgroundImage: `url(${slide.image_url})`,
                backgroundPosition: "center 40%" 
              }}
              role="img"
              aria-label={slide.title || "Temple View"}
            />
            
            {/* Elegant Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden md:block" />

            {/* Accent Gold Line at the bottom of the active slide */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent z-20" />
            
            <div className="relative z-20 h-full container mx-auto px-6 flex items-center">
              <div className={cn(
                "max-w-3xl transition-all duration-1000 delay-300 transform",
                isActive ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              )}>
                <div className="w-12 h-1 bg-accent mb-6 rounded-full" />
                
                {slide.title && (
                  <h1 className="font-hindi text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-2xl">
                    {slide.title}
                  </h1>
                )}
                
                {slide.subtitle && (
                  <p className="font-hindi text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-xl leading-relaxed drop-shadow-md border-l-2 border-accent/30 pl-4">
                    {slide.subtitle}
                  </p>
                )}
                
                {slide.button_text && slide.button_url && (
                  <Button 
                    size="lg" 
                    className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg font-hindi rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95"
                    asChild
                  >
                    <Link to={slide.button_url as any}>{slide.button_text}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Controls */}
      {displaySlides.length > 1 && (
        <>
          <div className="absolute inset-y-0 left-4 z-30 flex items-center md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button
              onClick={prevSlide}
              className="p-2 md:p-3 rounded-full bg-black/30 hover:bg-accent text-white transition-all backdrop-blur-sm border border-white/10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-4 z-30 flex items-center md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button
              onClick={nextSlide}
              className="p-2 md:p-3 rounded-full bg-black/30 hover:bg-accent text-white transition-all backdrop-blur-sm border border-white/10"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>

          {/* Slide Indicators / Dots */}
          <div className="absolute bottom-8 right-6 z-30 flex gap-3">
            {displaySlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "h-1.5 transition-all duration-300 rounded-full",
                  index === currentSlide 
                    ? "w-8 bg-accent" 
                    : "w-4 bg-white/30 hover:bg-white/50"
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
