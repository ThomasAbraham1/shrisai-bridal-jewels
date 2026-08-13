import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Image } from '@/components/ui/image';
import { motion } from 'framer-motion';

interface MobileHeroSliderProps {
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
}

export default function MobileHeroSlider({ onTouchStart, onTouchEnd }: MobileHeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const mobileHeroSlides = useMemo(() => [
    {
      image: '/media/b9ec8c_161524c29aad4be1a70bacc239fddbd8_mv2.png'
    },
    {
      image: '/media/b9ec8c_2b0345575d5b480fae5d0ee3238dfab2_mv2.png'
    },
    {
      image: '/media/b9ec8c_21d7d416a73b4a218f8cf8208b0c4e78_mv2.png'
    },
    {
      image: '/media/b9ec8c_f6e3f8d25792483aaf61e6ae12004982_mv2.png'
    },
    {
      image: '/media/b9ec8c_d1ba9ab1cb3e4f74a6db51105ffaba97_mv2.png'
    }
  ], []);

  // Auto-slide every 3.5 seconds
  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % mobileHeroSlides.length);
      }, 3500);
      return () => clearInterval(timer);
    }
  }, [isPaused, mobileHeroSlides.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
    setIsPaused(true);
    onTouchStart?.(e);
  }, [onTouchStart]);

  const handleSwipe = useCallback(() => {
    const threshold = 50;
    if (touchStartX.current - touchEndX.current > threshold) {
      // Swiped left - next slide
      setCurrentSlide((prev) => (prev + 1) % mobileHeroSlides.length);
    }
    if (touchEndX.current - touchStartX.current > threshold) {
      // Swiped right - previous slide
      setCurrentSlide((prev) => (prev - 1 + mobileHeroSlides.length) % mobileHeroSlides.length);
    }
  }, [mobileHeroSlides.length]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
    setIsPaused(false);
    onTouchEnd?.(e);
  }, [handleSwipe, onTouchEnd]);

  return (
    <section
      className="relative w-full h-[480px] sm:h-[520px] overflow-hidden flex items-center md:hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Track */}
      <motion.div
        className="absolute inset-0 w-full h-full flex"
        animate={{ x: `${-currentSlide * 100}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Slides */}
        {mobileHeroSlides.map((slide, index) => (
          <div key={`mobile-slide-${index}`} className="w-full h-full flex-shrink-0">
            <Image
              src={slide.image}
              alt={`Mobile Hero Banner ${index + 1}`}
              width={1080}
              height={560}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Duplicate first slide for seamless loop */}
        <div className="w-full h-full flex-shrink-0">
          <Image
            src={mobileHeroSlides[0].image}
            alt="Mobile Hero Banner 1 (Loop)"
            width={1080}
            height={560}
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {mobileHeroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              currentSlide === index ? 'w-6 bg-primary' : 'w-1.5 bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
