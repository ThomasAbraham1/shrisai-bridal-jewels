import { CategoryImage } from '@/components/ui/CategoryImage';
import { categories } from '@wix/categories';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface CategoryCarouselRowProps {
  categoriesList: categories.Category[];
  isLoading: boolean;
  isMobile: boolean;
  isTablet: boolean;
}

export default function CategoryCarouselRow({ categoriesList, isLoading, isMobile, isTablet }: CategoryCarouselRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll, { passive: true });
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [categoriesList, isLoading]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getCardsToShow = () => {
    if (isMobile) return 2.5;
    if (isTablet) return 4.5;
    return 6;
  };

  const cardsToShow = getCardsToShow();
  const cardWidth = 100 / cardsToShow;
  
  const isCentered = !isLoading && categoriesList.length <= cardsToShow;

  return (
    <div className="relative group/carousel">
      <div 
        ref={scrollContainerRef}
        className={`flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 ${isCentered ? 'justify-center' : ''}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {Array.from({ length: isLoading ? Math.floor(cardsToShow) : categoriesList.length }).map((_, index) => {
          const category = !isLoading ? categoriesList[index] : null;

          return (
            <motion.div
              key={`cat-wrapper-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex-shrink-0 snap-start h-full"
              style={{ width: `${cardWidth}%`, paddingRight: '1rem' }}
            >
              {category ? (
                <Link to={`/shop?category=${category.slug}`} className="group block h-full">
                  <div className="h-full p-2 md:p-4 2xl:p-6 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500 group-hover:-translate-y-1 bg-light-gold">
                    <div className="aspect-square overflow-hidden bg-background mb-2 md:mb-4 2xl:mb-6 rounded-sm relative flex items-center justify-center">
                      {category.image ? (
                        <CategoryImage
                          src={category.image}
                          alt={category.name || 'Category'}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-4xl md:text-5xl 2xl:text-6xl text-secondary/30">💍</div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="font-heading text-sm md:text-lg 2xl:text-xl text-secondary mb-1">{category.name}</h3>
                      <span className="text-[8px] md:text-[10px] 2xl:text-xs font-paragraph uppercase tracking-widest text-secondary/50 group-hover:text-primary transition-colors flex items-center justify-center gap-1">
                        Explore Now <ArrowRight className="w-2 md:w-3 2xl:w-4 h-2 md:h-3 2xl:h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="h-full p-2 md:p-4 2xl:p-6 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-light-gold animate-pulse">
                  <div className="aspect-square bg-background mb-2 md:mb-4 2xl:mb-6 rounded-sm"></div>
                  <div className="text-center flex flex-col items-center gap-2">
                    <div className="h-4 md:h-5 2xl:h-6 w-24 bg-background rounded"></div>
                    <div className="h-2 md:h-3 2xl:h-3 w-16 bg-background rounded"></div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {!isLoading && canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 md:w-10 h-8 md:h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-secondary hover:text-primary hover:scale-110 transition-all z-10 opacity-0 group-hover/carousel:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {!isLoading && canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 md:w-10 h-8 md:h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-secondary hover:text-primary hover:scale-110 transition-all z-10 opacity-0 group-hover/carousel:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
