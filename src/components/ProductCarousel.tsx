import { Image } from '@/components/ui/image';
import { Products } from '@/entities';
import { DEFAULT_CURRENCY, formatPrice, useCart, useCurrency } from '@/integrations';
import { calculateDiscount, getDisplayPrice, hasValidDiscount } from '@/lib/pricing';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface ProductCarouselProps {
  products: Products[];
  badgeLabel: string;
  badgeColor: string;
}

export default function ProductCarousel({ products, badgeLabel, badgeColor }: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const { currency } = useCurrency();
  const { addingItemId, actions } = useCart();

  // Determine responsive card count
  const getCardsToShow = () => {
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 5;
  };

  const cardsToShow = getCardsToShow();
  const cardWidth = 100 / cardsToShow;

  useEffect(() => {
    const checkResponsive = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    checkResponsive();
    const handleResize = () => checkResponsive();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Render each CMS product exactly once - no duplication
  // The carousel scrolls naturally without duplicating data
  const infiniteProducts = products;

  return (
    <div className="relative group">
      {/* Desktop Navigation Arrows */}
      {!isMobile && !isTablet && (
        <>
          <button
            onClick={() => scroll('left')}
            className={`absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              canScrollLeft
                ? 'bg-primary hover:bg-light-gold text-secondary shadow-lg'
                : 'bg-primary/30 text-secondary/50 cursor-not-allowed'
            }`}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            className={`absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              canScrollRight
                ? 'bg-primary hover:bg-light-gold text-secondary shadow-lg'
                : 'bg-primary/30 text-secondary/50 cursor-not-allowed'
            }`}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 md:gap-4 2xl:gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {infiniteProducts.map((product, index) => (
          <motion.div
            key={`${product._id}-${index}`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
            style={{ width: `calc(${cardWidth}% - ${(4 - cardsToShow) * 0.5}px)` }}
          >
            <div className="group/card h-full flex flex-col bg-white rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-500 overflow-hidden">
              {/* Image Container */}
              <div className="relative overflow-hidden bg-background aspect-[3/4] flex items-center justify-center">
                {/* Badge */}
                <div className={`absolute top-2 left-2 z-10 ${badgeColor} px-2 py-1 rounded-full text-white text-[8px] md:text-[9px] font-bold uppercase tracking-wider`}>
                  {badgeLabel}
                </div>

                {/* Wishlist Icon */}
                <button
                  className="absolute top-2 right-2 z-10 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-300 shadow-md"
                  aria-label="Add to wishlist"
                >
                  <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary hover:fill-primary transition-all" />
                </button>

                {/* Product Image */}
                <Image
                  src={product.itemImage || '/media/978e03_933b74b3e10f4088949a15851f603622_mv2.png'}
                  alt={product.itemName || 'Product'}
                  width={400}
                  height={533}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 p-2.5 md:p-3 2xl:p-4 flex flex-col justify-between">
                {/* Product Info */}
                <div>
                  {/* Product Name */}
                  <h3 className="font-heading text-xs md:text-sm 2xl:text-base text-secondary line-clamp-2 mb-2">
                    {product.itemName}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                    <span className="font-heading text-xs md:text-sm 2xl:text-base text-primary">
                      {formatPrice(getDisplayPrice(product), currency ?? DEFAULT_CURRENCY)}
                    </span>
                    {hasValidDiscount(product) && (
                      <>
                        <span className="text-[8px] md:text-[9px] text-secondary/50 line-through">
                          {formatPrice(product.mrp || 0, currency ?? DEFAULT_CURRENCY)}
                        </span>
                        <span className="text-[7px] md:text-[8px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">
                          -{calculateDiscount(product.mrp || 0, product.ourPrice || 0)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-2">
                  <Link
                    to={`/product/${product._id}`}
                    className="flex-1 px-2 py-2.5 md:py-3 bg-primary hover:bg-light-gold text-secondary font-paragraph text-[11px] md:text-xs 2xl:text-sm uppercase tracking-wider rounded-[10px] transition-all duration-300 text-center font-bold flex items-center justify-center h-11 md:h-12"
                  >
                    VIEW
                  </Link>
                  <button
                    onClick={() =>
                      actions.addToCart({
                        collectionId: 'jewelleryproducts',
                        itemId: product._id,
                        quantity: 1,
                      })
                    }
                    disabled={addingItemId === product._id}
                    className="w-11 h-11 md:w-12 md:h-12 rounded-[10px] bg-primary hover:bg-light-gold text-secondary flex items-center justify-center transition-all duration-300 disabled:opacity-50 flex-shrink-0"
                    aria-label="Add to cart"
                  >
                    {addingItemId === product._id ? (
                      <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ShoppingCart className="w-4 h-4 md:w-4.5 md:h-4.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
