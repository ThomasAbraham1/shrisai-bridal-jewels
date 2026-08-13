import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { ShopbyCategory } from '@/entities';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<ShopbyCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        // OPTIMIZED: Added limit to reduce data transfer and improve performance
        const result = await BaseCrudService.getAll<ShopbyCategory>('jewellerycategories', {}, { limit: 50 });
        const foundCategory = result.items.find((cat) => cat.slug === slug);
        
        if (foundCategory) {
          setCategory(foundCategory);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        // Silently handle error - show not found state
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Header />
        <LoadingSpinner />
      </div>
    );
  }

  if (notFound || !category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-24 text-center">
          <h1 className="font-heading text-4xl md:text-5xl text-secondary mb-4">Category Not Found</h1>
          <p className="text-secondary/70 font-paragraph mb-8">The category you're looking for doesn't exist.</p>
          <Button asChild className="bg-primary hover:bg-light-gold text-secondary font-paragraph uppercase tracking-widest text-xs h-12 md:h-14 px-8 rounded-none">
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO SECTION - Category Banner */}
      <section className="relative w-full h-[40vh] md:h-[60vh] min-h-[400px] overflow-hidden flex items-center justify-center bg-secondary">
        <div className="absolute inset-0 w-full h-full">
          {category.categoryImage && (
            <Image
              src={category.categoryImage}
              alt={category.categoryName || 'Category'}
              width={1920}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-dark-background/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-background/40 to-dark-background/80" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl mx-auto px-4 sm:px-6"
        >
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 md:mb-6">
            {category.categoryName}
          </h1>
          <div className="w-12 h-[2px] bg-primary mx-auto"></div>
        </motion.div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-12 md:py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            {category.description && (
              <p className="text-base md:text-lg text-secondary/80 font-paragraph leading-relaxed mb-8 md:mb-12">
                {category.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-light-gold text-secondary font-paragraph uppercase tracking-widest text-xs md:text-sm h-12 md:h-14 px-8 md:px-10 rounded-none transition-all duration-500 flex items-center justify-center gap-2"
              >
                <Link to="/shop">
                  Shop this category <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-secondary text-secondary hover:bg-secondary hover:text-white font-paragraph uppercase tracking-widest text-xs md:text-sm h-12 md:h-14 px-8 md:px-10 rounded-none transition-all duration-500"
              >
                <Link to="/contact">Book Consultation</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* RELATED CATEGORIES SECTION */}
      <section className="py-12 md:py-24 bg-secondary">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-8 md:mb-16">
            <span className="text-primary text-[9px] md:text-xs font-paragraph uppercase tracking-[0.2em] mb-2 md:mb-4 block">
              Explore More
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary-foreground">
              Other Collections
            </h2>
            <div className="w-12 h-[1px] bg-primary mx-auto mt-3 md:mt-6"></div>
          </div>

          <div className="text-center">
            <Button
              asChild
              className="bg-primary hover:bg-light-gold text-secondary font-paragraph uppercase tracking-widest text-xs md:text-sm h-12 md:h-14 px-8 md:px-10 rounded-none transition-all duration-500"
            >
              <Link to="/collections">View All Collections</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
