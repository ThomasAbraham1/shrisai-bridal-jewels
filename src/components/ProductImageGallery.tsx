import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductImage } from '@/components/ui/ProductImage';

interface ProductImageGalleryProps {
  mainImage: string;
  productGallery?: string;
  productGallery2?: string;
  productGallery3?: string;
  productGallery4?: string;
  productGallery5?: string;
  productName: string;
}

export default function ProductImageGallery({
  mainImage,
  productGallery,
  productGallery2,
  productGallery3,
  productGallery4,
  productGallery5,
  productName
}: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Collect all images from all possible fields
  const allImages = useMemo(() => {
    const collectAllImages = (): string[] => {
      const images: string[] = [];
      
      // Add main image first
      if (mainImage && typeof mainImage === 'string' && mainImage.trim()) {
        images.push(mainImage.trim());
      }

      // Add individual gallery fields (productGallery, productGallery2, etc.)
      const galleryFields = [productGallery, productGallery2, productGallery3, productGallery4, productGallery5];
      galleryFields.forEach(field => {
        if (field && typeof field === 'string' && field.trim()) {
          images.push(field.trim());
        }
      });

      // Remove duplicates while preserving order
      const uniqueImages: string[] = [];
      const seen = new Set<string>();
      images.forEach(img => {
        if (!seen.has(img)) {
          seen.add(img);
          uniqueImages.push(img);
        }
      });

      return uniqueImages;
    };
    return collectAllImages();
  }, [mainImage, productGallery, productGallery2, productGallery3, productGallery4, productGallery5]);
  const hasMultipleImages = allImages.length > 1;

  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    setIsDragging(false);
    handleSwipe();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart(e.clientX);
    setIsDragging(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const dragEnd = e.clientX;
    const dragDistance = dragStart - dragEnd;
    
    if (Math.abs(dragDistance) > 50) {
      if (dragDistance > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  const handleSwipe = useCallback(() => {
    if (!hasMultipleImages) return;
    
    const swipeDistance = touchStart - touchEnd;
    const isLeftSwipe = swipeDistance > 50;
    const isRightSwipe = swipeDistance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  }, [touchStart, touchEnd, hasMultipleImages, goToNext, goToPrevious]);

  // Scroll thumbnail into view when image changes
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const thumbnails = thumbnailContainerRef.current.querySelectorAll('button');
      const activeThumbnail = thumbnails[currentImageIndex];
      
      if (activeThumbnail) {
        activeThumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [currentImageIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown, { passive: true });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  return (
    <div className="w-full space-y-4 product-gallery-wrapper box-border">
      {/* Main Image Container - Mobile Optimized */}
      <div
        className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-white shadow-lg group cursor-grab active:cursor-grabbing product-gallery-main box-border select-none mx-auto"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        ref={galleryRef}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full flex items-center justify-center"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <ProductImage
              src={allImages[currentImageIndex] || mainImage}
              alt={`${productName} - Image ${currentImageIndex + 1}`}
              width={600}
              height={800}
              fittingType="fit"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 product-gallery-image"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Hidden on Mobile */}
        {hasMultipleImages && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-secondary p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10 hidden md:flex"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-secondary p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10 hidden md:flex"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter - Mobile Visible */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-paragraph">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery - Mobile Optimized */}
      {hasMultipleImages && (
        <div className="space-y-3 product-gallery-thumbnails-container w-full box-border">
          <p className="text-xs font-paragraph text-foreground/60 uppercase tracking-wider">
            Gallery
          </p>
          <div 
            ref={thumbnailContainerRef}
            className="flex gap-2 md:gap-3 justify-center md:justify-start overflow-x-auto pb-2 product-gallery-thumbnails w-full box-border scroll-smooth"
          >
            {allImages.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all product-gallery-thumbnail box-border ${
                  currentImageIndex === index
                    ? 'border-primary shadow-md'
                    : 'border-secondary/10 hover:border-secondary/30'
                }`}
              >
                <ProductImage
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  fittingType="fit"
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
