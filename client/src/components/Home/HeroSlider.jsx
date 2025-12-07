import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Premium Electronics",
      subtitle: "Discover the latest tech innovations",
      description:
        "Up to 50% off on premium headphones, smartwatches, and more",
      image: "/electronics.jpg",
      cta: "Shop Electronics",
      url: "/products?category=Electronics",
    },
    {
      id: 2,
      title: "Fashion Forward",
      subtitle: "Style meets comfort",
      description: "New arrivals in designer clothing and accessories",
      image: "/fashion.jpg",
      cta: "Explore Fashion",
      url: "/products?category=Fashion",
    },
    {
      id: 3,
      title: "Home & Garden",
      subtitle: "Transform your space",
      description: "Beautiful furniture and decor for every home",
      image: "/furniture.jpg",
      cta: "Shop Home",
      url: `/products?category=Home & Garden`,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div className="relative h-[500px] lg:h-[600px] overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-muted/50">
      {/* Single Active Slide */}
      <div className="relative h-full flex items-center">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">
              {slide.subtitle}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-tight">
              {slide.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              {slide.description}
            </p>
            <Link
              to={slide.url}
              className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-xl font-bold text-lg hover:bg-foreground/90 transition-all hover:scale-105 shadow-lg"
            >
              {slide.cta}
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="hidden sm:block absolute left-6 top-1/2 transform -translate-y-1/2 p-3 glass-card hover:glow-on-hover animate-smooth"
      >
        <ChevronLeft className="w-6 h-6 text-primary" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden sm:block absolute right-6 top-1/2 transform -translate-y-1/2 p-3 glass-card hover:glow-on-hover animate-smooth"
      >
        <ChevronRight className="w-6 h-6 text-primary" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
              ? "bg-primary glow-primary"
              : "bg-white/30 hover:bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
