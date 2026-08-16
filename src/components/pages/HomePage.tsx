// HPI 1.7-V - Performance Optimized
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import VideoShowcase from '@/components/VideoShowcase';
import ProductCarousel from '@/components/ProductCarousel';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { HeroImage } from '@/components/ui/HeroImage';
import { CategoryImage } from '@/components/ui/CategoryImage';
import CategoryCarouselRow from '@/components/CategoryCarouselRow';
import { Products } from '@/entities';
import { categories } from '@wix/categories';
import { BaseCrudService, DEFAULT_CURRENCY, formatPrice, useCurrency } from '@/integrations';
import wixClient from '@/wixClient';
import { calculateDiscount, getDisplayPrice, hasValidDiscount } from '@/lib/pricing';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Clock, MapPin, Phone, Star } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  // --- CANONICAL DATA SOURCES ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [bestSellerProducts, setBestSellerProducts] = useState<Products[]>([]);
  const [isLoadingBestSellers, setIsLoadingBestSellers] = useState(true);
  const [newArrivalProducts, setNewArrivalProducts] = useState<Products[]>([]);
  const [isLoadingNewArrivals, setIsLoadingNewArrivals] = useState(true);
  const [categoriesList, setCategoriesList] = useState<categories.Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const { currency } = useCurrency();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Desktop hero slides
  const desktopHeroSlides = useMemo(() => [
    { image: 'https://static.wixstatic.com/media/b9ec8c_ad402c9d262649c48c12a048372247de~mv2.png' },
    { image: 'https://static.wixstatic.com/media/b9ec8c_b32ae76fd4cc4c4486515eea848cf1c6~mv2.png' },
    { image: 'https://static.wixstatic.com/media/b9ec8c_24dca6d054f34101bcf0850bfa8f44bb~mv2.png' },
    { image: 'https://static.wixstatic.com/media/b9ec8c_20b91092ebf84c75b1eace8a10d8e983~mv2.png' },
    { image: 'https://static.wixstatic.com/media/b9ec8c_43c97667553d45a090df381177ffca6d~mv2.png' }
  ], []);

  // We use the tablet hero slides (1086x1448) for mobile as well
  const mobileHeroSlides = useMemo(() => [
    { image: '/media/tablet-hero-1.webp' },
    { image: '/media/tablet-hero-2.webp' },
    { image: '/media/tablet-hero-3.webp' },
    { image: '/media/tablet-hero-4.webp' },
    { image: '/media/tablet-hero-5.webp' }
  ], []);

  // Tablet hero slides
  const tabletHeroSlides = useMemo(() => [
    { image: '/media/tablet-hero-1.webp' },
    { image: '/media/tablet-hero-2.webp' },
    { image: '/media/tablet-hero-3.webp' },
    { image: '/media/tablet-hero-4.webp' },
    { image: '/media/tablet-hero-5.webp' }
  ], []);

  const heroSlides = isMobile ? mobileHeroSlides : desktopHeroSlides;

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    checkViewport();
    const handleResize = () => checkViewport();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isPaused, heroSlides.length]);

  // OPTIMIZED: Combined fetch for all data in parallel - NO LIMIT on Best Sellers and New Arrivals
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResult = await BaseCrudService.getAll<Products>('jewelleryproducts', {}, { limit: 200 });
        const bestSellers = productsResult.items.filter((product) => product.isBestSeller === true);
        const newArrivals = productsResult.items.filter((product) => product.newArrival === true);

        setBestSellerProducts(bestSellers);
        setNewArrivalProducts(newArrivals);
      } catch (error) {
        console.error('Error fetching products:', error);
        setBestSellerProducts([]);
        setNewArrivalProducts([]);
      } finally {
        setIsLoadingBestSellers(false);
        setIsLoadingNewArrivals(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const result = await wixClient.categories.queryCategories({
          treeReference: { appNamespace: '@wix/stores' }
        }).eq('visible', true).find();
        setCategoriesList(result.items);
      } catch (error) {
        console.error('Error fetching categories from Wix Stores:', error);
        setCategoriesList([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const nextSlide = useCallback(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), [heroSlides.length]);
  const prevSlide = useCallback(() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length), [heroSlides.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown, { passive: true });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = useCallback(() => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    }
    if (touchEndX.current - touchStartX.current > 50) {
      prevSlide();
    }
  }, [nextSlide, prevSlide]);

  const featuredCollections = useMemo(() => [
    { name: 'Temple Jewellery', image: '/media/b9ec8c_815754f089d2465fa579a3d392b49e00_mv2.png', link: '/shop?search=temple' },
    { name: 'Bridal Sets', image: '/media/b9ec8c_faa99e6dd21c428383c253c355229de0_mv2.png', link: '/shop?search=bridal' },
    { name: 'Rental Collection', image: '/media/b9ec8c_9301edac0d73423990280485eb03bbed_mv2.png', link: '/rental' },
    { name: 'New Arrivals', image: '/media/b9ec8c_c771218359754412910d9f5992565a0e_mv2.png', link: '/collections' }
  ], []);

  const testimonials = useMemo(() => [
    { name: 'Priya S | Madurai', rating: 5, review: 'The jewellery was absolutely stunning! Perfect for my big day. Highly recommended.' },
    { name: 'Anitha R | Chennai', rating: 4, review: 'Such beautiful designs and excellent service. Rental process was so easy and smooth.' },
    { name: 'Kavya M | Thoothukudi', rating: 5, review: 'Top quality premium imitation jewellery with amazing finishing. Loved it!' },
    { name: 'Divya K | Trichy', rating: 5, review: 'Exceptional craftsmanship and attention to detail. The rental experience was seamless and professional.' },
    { name: 'Sneha P | Coimbatore', rating: 4, review: 'Absolutely worth every penny! The collection is diverse and the customer service is outstanding.' }
  ], []);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonialsPaused, setTestimonialsPaused] = useState(false);

  useEffect(() => {
    if (!testimonialsPaused) {
      const timer = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [testimonialsPaused, testimonials.length]);

  const features = useMemo(() => [
    { icon: '💍', title: 'Purchase & Rental', description: 'Flexible options for your special day' },
    { icon: '✨', title: 'Premium Quality', description: 'Premium Imitation Jewellery with Finest Craftsmanship' },
    { icon: '💰', title: 'Affordable Pricing', description: 'Luxury you can trust at best prices' },
    { icon: '🤝', title: 'Trusted by Brides', description: '1200+ Happy Brides and growing' },
    { icon: '🚚', title: 'Fast Delivery', description: 'Safe & Secure Delivery' },
    { icon: '💬', title: 'Customer Support', description: 'We are here to help you' }
  ], []);

  const marqueeCategories = useMemo(() => [
    'Bridal Sets', 'Temple Jewellery', 'Long Haaram', 'Short Necklace', 'Choker',
    'Vanki', 'Jhumkaa', 'Oddiyanam', 'Matha Patti', 'Bangles', 'Rental Collection',
    'New Arrivals', 'Best Sellers', 'Book Now'
  ], []);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  const midPoint = Math.ceil(categoriesList.length / 2);
  const row1Categories = categoriesList.slice(0, midPoint);
  const row2Categories = categoriesList.slice(midPoint);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-secondary">
      <Header />
      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="relative w-full aspect-[1086/1448] md:aspect-[1983/793] lg:aspect-auto lg:h-[85vh] lg:min-h-[500px] overflow-hidden flex items-center bg-black/5"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="absolute inset-0 w-full h-full flex"
          style={{ y: heroY, opacity: heroOpacity }}
          animate={{ x: `${-currentSlide * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {heroSlides.map((slide, index) => (
            <div key={`slide-${index}`} className="w-full h-full flex-shrink-0">
              <HeroImage
                src={slide.image}
                alt={`Hero Banner ${index + 1}`}
                width={isMobile ? 1086 : 1983}
                height={isMobile ? 1448 : 793}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
          <div className="w-full h-full flex-shrink-0">
            <HeroImage
              src={heroSlides[0].image}
              alt="Hero Banner 1 (Loop)"
              width={isMobile ? 1086 : 1983}
              height={isMobile ? 1448 : 793}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* Slider Controls */}
        <div className="absolute left-2 md:left-4 lg:left-6 2xl:left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 md:gap-2 lg:gap-4 z-20">
          <button onClick={prevSlide} className="w-7 md:w-8 lg:w-10 h-7 md:h-8 lg:h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-secondary transition-colors" aria-label="Previous slide">
            <ChevronLeft className="w-3 md:w-3 lg:w-4 h-3 md:h-3 lg:h-4" />
          </button>
        </div>
        <div className="absolute right-2 md:right-4 lg:right-6 2xl:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 md:gap-2 lg:gap-4 z-20">
          <button onClick={nextSlide} className="w-7 md:w-8 lg:w-10 h-7 md:h-8 lg:h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-secondary transition-colors" aria-label="Next slide">
            <ChevronRight className="w-3 md:w-3 lg:w-4 h-3 md:h-3 lg:h-4" />
          </button>
        </div>

        {/* Pagination */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 transition-all duration-500 ${currentSlide === index ? 'w-8 bg-primary' : 'w-2 bg-white/30'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <Link to="/shop" className="absolute inset-0 z-5" aria-label="Go to shop" onClick={(e) => e.stopPropagation()} />
      </section>
      {/* CATEGORY MARQUEE */}
      <section className="py-2 md:py-3 2xl:py-4 overflow-hidden border-y border-primary/20 bg-light-gold">
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {[...marqueeCategories, ...marqueeCategories, ...marqueeCategories].map((category, index) => (
            <React.Fragment key={index}>
              <span className="inline-flex items-center mx-4 md:mx-6 2xl:mx-8 text-secondary font-paragraph text-[9px] md:text-xs 2xl:text-sm font-bold uppercase tracking-[0.15em]">
                {category}
              </span>
              <span className="text-secondary/50 text-[8px] md:text-[10px] 2xl:text-xs">✦</span>
            </React.Fragment>
          ))}
        </div>
      </section>
      {/* SHOP BY CATEGORY */}
      <section className="py-12 md:py-24 2xl:py-32 relative bg-secondary">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 2xl:px-16">
          <div className="text-center mb-8 md:mb-16 2xl:mb-20 bg-secondary">
            <span className="text-[9px] md:text-xs 2xl:text-sm font-paragraph uppercase tracking-[0.2em] mb-2 md:mb-4 2xl:mb-6 block text-primary-foreground">Discover</span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl-lg text-primary-foreground">Shop by Category</h2>
            <div className="w-12 2xl:w-16 h-[1px] mx-auto mt-3 md:mt-6 2xl:mt-8 bg-secondary"></div>
          </div>

          <div className="flex flex-col gap-4">
            {isMobile || isTablet ? (
              <>
                <CategoryCarouselRow 
                  categoriesList={row1Categories} 
                  isLoading={isLoadingCategories} 
                  isMobile={isMobile} 
                  isTablet={isTablet} 
                />
                {row2Categories.length > 0 && (
                  <CategoryCarouselRow 
                    categoriesList={row2Categories} 
                    isLoading={isLoadingCategories} 
                    isMobile={isMobile} 
                    isTablet={isTablet} 
                  />
                )}
              </>
            ) : (
              <CategoryCarouselRow 
                categoriesList={categoriesList} 
                isLoading={isLoadingCategories} 
                isMobile={isMobile} 
                isTablet={isTablet} 
              />
            )}
          </div>
        </div>
      </section>
      {/* BEST SELLERS SECTION - CAROUSEL */}
      {!isLoadingBestSellers && bestSellerProducts.length > 0 && (
        <section className="py-12 md:py-24 2xl:py-32 relative border-t border-secondary/5 bg-primary-foreground">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 2xl:px-16">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8 mb-12 md:mb-20 2xl:mb-28">
              <div>
                <span className="text-primary text-[9px] md:text-xs 2xl:text-sm font-paragraph uppercase tracking-[0.2em] mb-2 md:mb-4 2xl:mb-6 block">Explore Our</span>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl-lg text-secondary">Best Sellers</h2>
                <div className="w-12 2xl:w-16 h-[1px] bg-primary mt-3 md:mt-6 2xl:mt-8"></div>
              </div>
              <p className="text-xs md:text-sm 2xl:text-base text-secondary/70 font-paragraph max-w-xs">
                Our most loved jewellery pieces chosen by thousands of happy customers.
              </p>
              <Link
                to="/shop?bestseller=true"
                className="px-6 md:px-8 2xl:px-10 py-3 md:py-4 2xl:py-5 bg-primary hover:bg-light-gold text-secondary font-paragraph text-[10px] md:text-xs 2xl:text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300 whitespace-nowrap"
              >
                View All
              </Link>
            </div>

            <ProductCarousel products={bestSellerProducts} badgeLabel="BEST SELLER" badgeColor="bg-primary" />
          </div>
        </section>
      )}
      {/* NEW ARRIVALS SECTION - CAROUSEL */}
      {!isLoadingNewArrivals && newArrivalProducts.length > 0 && (
        <section className="py-12 md:py-24 2xl:py-32 bg-white relative border-t border-secondary/5">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 2xl:px-16">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8 mb-12 md:mb-20 2xl:mb-28">
              <div>
                <span className="text-primary text-[9px] md:text-xs 2xl:text-sm font-paragraph uppercase tracking-[0.2em] mb-2 md:mb-4 2xl:mb-6 block">Latest Additions</span>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl-lg text-secondary">New Arrivals</h2>
                <div className="w-12 2xl:w-16 h-[1px] bg-primary mt-3 md:mt-6 2xl:mt-8"></div>
              </div>
              <p className="text-xs md:text-sm 2xl:text-base text-secondary/70 font-paragraph max-w-xs">
                Discover the newest additions to our bridal jewellery collection.
              </p>
              <Link
                to="/collections"
                className="px-6 md:px-8 2xl:px-10 py-3 md:py-4 2xl:py-5 bg-primary hover:bg-light-gold text-secondary font-paragraph text-[10px] md:text-xs 2xl:text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300 whitespace-nowrap"
              >
                View All
              </Link>
            </div>

            <ProductCarousel products={newArrivalProducts} badgeLabel="NEW" badgeColor="bg-primary" />
          </div>
        </section>
      )}
      {/* FEATURED COLLECTIONS - Fallback */}
      {!isLoadingBestSellers && bestSellerProducts.length === 0 && !isLoadingNewArrivals && newArrivalProducts.length === 0 && (
        <section className="py-12 md:py-24 2xl:py-32 bg-white relative border-t border-secondary/5">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 2xl:px-16">
            <div className="text-center mb-8 md:mb-16 2xl:mb-20">
              <span className="text-primary text-[9px] md:text-xs 2xl:text-sm font-paragraph uppercase tracking-[0.2em] mb-2 md:mb-4 2xl:mb-6 block">Explore Our</span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl-lg text-secondary">Featured Collections</h2>
              <div className="w-12 2xl:w-16 h-[1px] bg-primary mx-auto mt-3 md:mt-6 2xl:mt-8"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6 2xl:gap-8">
              {featuredCollections.map((collection, index) => (
                <motion.div
                  key={collection.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.15 }}
                >
                  <Link to={collection.link} className="group block relative overflow-hidden rounded-sm aspect-square">
                    <CategoryImage
                      src={collection.image}
                      alt={collection.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-background/90 via-dark-background/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                    <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end">
                      <h3 className="font-heading text-lg md:text-2xl text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{collection.name}</h3>
                      <div className="overflow-hidden">
                        <span className="text-[8px] md:text-[10px] font-paragraph uppercase tracking-widest text-primary flex items-center gap-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-100">
                          Explore Now <ArrowRight className="w-2 md:w-3 h-2 md:h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* FEATURES STRIP */}
      <section className="py-8 md:py-12 2xl:py-16 border-y border-primary/20 bg-secondary">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 2xl:px-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 2xl:grid-cols-6 gap-4 md:gap-8 2xl:gap-12 divide-x divide-primary/10">
            {features.map((feature) => (
              <div key={feature.title} className="text-center px-2 md:px-4 2xl:px-6 group">
                <div className="text-lg md:text-2xl 2xl:text-3xl mb-2 md:mb-3 2xl:mb-4 text-primary flex justify-center group-hover:-translate-y-1 transition-transform duration-300">
                  <span className="opacity-80">{feature.icon}</span>
                </div>
                <h3 className="font-paragraph text-[9px] md:text-xs 2xl:text-sm font-bold uppercase tracking-wider text-white mb-1">{feature.title}</h3>
                <p className="text-[8px] md:text-[10px] 2xl:text-xs text-white/50 font-paragraph leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* VIDEO SHOWCASE SECTION */}
      <VideoShowcase />
      {/* TESTIMONIALS */}
      <section
        className="py-12 md:py-24 2xl:py-32 relative overflow-hidden bg-emerald-green"
        onMouseEnter={() => setTestimonialsPaused(true)}
        onMouseLeave={() => setTestimonialsPaused(false)}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 2xl:px-16">
          <div className="text-center mb-8 md:mb-16 2xl:mb-20">
            <span className="text-primary text-[9px] md:text-xs 2xl:text-sm font-paragraph uppercase tracking-[0.2em] mb-2 md:mb-4 2xl:mb-6 block">Testimonials</span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl-lg text-primary-foreground">Our Happy Brides</h2>
            <div className="w-12 2xl:w-16 h-[1px] bg-primary mx-auto mt-3 md:mt-6 2xl:mt-8"></div>
          </div>

          <div className="relative h-[320px] md:h-[280px] 2xl:h-[320px] flex items-center justify-center">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full max-w-2xl"
            >
              <div className="bg-white p-6 md:p-10 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-secondary/5 text-center">
                <div className="flex justify-center gap-1 mb-4 md:mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-3 md:w-4 h-3 md:h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm md:text-base text-secondary/70 font-paragraph italic mb-6 md:mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].review}"
                </p>
                <h4 className="font-heading text-lg md:text-xl text-secondary">{testimonials[currentTestimonial].name}</h4>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-center gap-2 mt-8 md:mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2 transition-all duration-300 rounded-full ${currentTestimonial === index ? 'w-8 bg-primary' : 'w-2 bg-white/30'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
      {/* STORE LOCATION */}
      <section className="py-12 md:py-24 2xl:py-32 bg-white border-t border-secondary/5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 2xl:px-16">
          <div className="text-center mb-8 md:mb-16 2xl:mb-20">
            <span className="text-primary text-[9px] md:text-xs 2xl:text-sm font-paragraph uppercase tracking-[0.2em] mb-2 md:mb-4 2xl:mb-6 block">Find Us</span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl-lg text-secondary">Visit Our Store</h2>
            <div className="w-12 2xl:w-16 h-[1px] bg-primary mx-auto mt-3 md:mt-6 2xl:mt-8"></div>
          </div>

          <div className="grid lg:grid-cols-12 gap-0 rounded-sm overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-secondary/10">
            <div className="lg:col-span-4 bg-background p-6 md:p-10 lg:p-14 2xl:p-16 flex flex-col justify-center">
              <h3 className="font-heading text-2xl md:text-3xl 2xl:text-4xl text-secondary mb-6 md:mb-8 2xl:mb-10">Shri Sai Bridal Jewels</h3>

              <div className="space-y-4 md:space-y-6 2xl:space-y-8 mb-8 md:mb-10 2xl:mb-12">
                <div className="flex items-start gap-3 md:gap-4 2xl:gap-6">
                  <MapPin className="w-4 md:w-5 2xl:w-6 h-4 md:h-5 2xl:h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-xs md:text-sm 2xl:text-base text-secondary/80 font-paragraph leading-relaxed">85, Vadakku Radha St, Near Sivan Kovil , Ezhil Nagar, Thoothukudi, Tamil Nadu 628002</p>
                </div>
                <div className="flex items-center gap-3 md:gap-4 2xl:gap-6">
                  <Phone className="w-4 md:w-5 2xl:w-6 h-4 md:h-5 2xl:h-6 text-primary flex-shrink-0" />
                  <a href="tel:09080242663" className="text-xs md:text-sm 2xl:text-base text-secondary/80 font-paragraph hover:text-primary transition-colors">
                    +91 090802 42663
                  </a>
                </div>
                <div className="flex items-start gap-3 md:gap-4 2xl:gap-6">
                  <Clock className="w-4 md:w-5 2xl:w-6 h-4 md:h-5 2xl:h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="text-xs md:text-sm 2xl:text-base text-secondary/80 font-paragraph">
                    <p>Mon - Sun : 9:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 2xl:gap-6">
                <Button asChild className="flex-1 bg-primary hover:bg-light-gold text-secondary font-paragraph uppercase tracking-widest text-[10px] md:text-xs 2xl:text-sm h-10 md:h-12 2xl:h-14 rounded-none transition-all">
                  <a href="https://maps.app.goo.gl/YmRPo3fj3HbkYwP18" target="_blank" rel="noopener noreferrer">Get Directions</a>
                </Button>
                <Button asChild variant="outline" className="flex-1 border-secondary text-secondary hover:bg-secondary hover:text-white font-paragraph uppercase tracking-widest text-[10px] md:text-xs 2xl:text-sm h-10 md:h-12 2xl:h-14 rounded-none transition-all">
                  <a href="tel:09080242663">Call Now</a>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-8 h-[250px] md:h-[400px] lg:h-auto relative bg-secondary/5">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.77784954275!2d78.14470907477784!3d8.806929591245822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b03ef003c1baa1d%3A0x1c8b38b086e7c02!2sShrisai%20bridal%20jewels!5e0!3m2!1sen!2sin!4v1785526138841!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shri Sai Bridal Jewels Location"
                className="absolute inset-0 w-full h-full grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      {/* NEWSLETTER */}
      <section className="bg-primary py-12 md:py-20 2xl:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/media/b9ec8c_69572dd2008e4ab0b7d5dd30465c91e8_mv2.png')] opacity-5 mix-blend-overlay object-cover bg-primary" />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 2xl:px-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 2xl:gap-16 bg-white/10 backdrop-blur-sm p-6 md:p-10 lg:p-14 2xl:p-16 rounded-sm border border-white/20">
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl text-secondary mb-2 md:mb-3 2xl:mb-4">Stay Updated</h2>
              <p className="text-xs md:text-sm 2xl:text-base text-secondary/80 font-paragraph">
                Subscribe to our newsletter for the latest collections, offers and bridal inspiration.
              </p>
            </div>
            <div className="flex-1 w-full max-w-md 2xl:max-w-lg">
              <form className="flex flex-col sm:flex-row gap-0 w-full shadow-lg">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 md:px-6 2xl:px-8 py-3 md:py-4 2xl:py-5 bg-white text-secondary font-paragraph text-xs md:text-sm 2xl:text-base focus:outline-none rounded-t-sm sm:rounded-l-sm sm:rounded-tr-none"
                  required
                />
                <Button type="submit" className="bg-secondary hover:bg-dark-background text-white font-paragraph uppercase tracking-widest text-[10px] md:text-xs 2xl:text-sm h-auto py-3 md:py-4 2xl:py-5 px-6 md:px-8 2xl:px-10 rounded-b-sm sm:rounded-r-sm sm:rounded-bl-none transition-colors">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919080242663"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-15 h-15 bg-[#25D366] rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.18)] z-50 flex items-center justify-center transition-transform duration-250 hover:scale-[1.08]"
        aria-label="Chat on WhatsApp"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <image
            href="/media/b9ec8c_99631cac519442758e4385ffd79bb383.svg"
            width="30"
            height="30"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </a>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
          width: max-content;
        }
        .w-15 {
          width: 60px;
        }
        .h-15 {
          height: 60px;
        }
        .duration-250 {
          transition-duration: 250ms;
        }
      `}</style>
    </div>
  );
}
