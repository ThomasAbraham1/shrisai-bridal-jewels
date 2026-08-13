import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Products } from '@/entities';
import { useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { SEOMeta } from '@/components/SEOMeta';
import { SEO_PAGES, generateBreadcrumbSchema } from '@/lib/seo';

export default function CollectionsPage() {
  const [newArrivalProducts, setNewArrivalProducts] = useState<Products[]>([]);
  const [isLoadingNewArrivals, setIsLoadingNewArrivals] = useState(true);
  const { currency } = useCurrency();

  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        setIsLoadingNewArrivals(true);
        // OPTIMIZED: Added limit to reduce data transfer and improve performance
        const result = await BaseCrudService.getAll<Products>('jewelleryproducts', {}, { limit: 50 });
        const newArrivals = result.items.filter(product => product.newArrival === true);
        setNewArrivalProducts(newArrivals);
      } catch (error) {
        // Silently handle error - UI will show empty states
      } finally {
        setIsLoadingNewArrivals(false);
      }
    };
    loadNewArrivals();
  }, []);

  // SEO Configuration
  const seoConfig = {
    ...SEO_PAGES.collections,
    canonical: 'https://shrisaibridal.com/collections',
    ogImage: '/media/b9ec8c_ad402c9d262649c48c12a048372247de_mv2.png',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        generateBreadcrumbSchema([
          { name: 'Home', url: 'https://shrisaibridal.com/' },
          { name: 'Collections', url: 'https://shrisaibridal.com/collections' }
        ])
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOMeta config={seoConfig} pageUrl="https://shrisaibridal.com/collections" />
      <Header />

      {/* New Arrivals Hero Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-5xl text-foreground mb-4">New Arrivals</h1>
          <p className="text-lg text-foreground/70 font-paragraph">Latest additions to our exquisite jewellery collection</p>
        </motion.div>

        {isLoadingNewArrivals ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : newArrivalProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-foreground/70 font-paragraph">No New Arrivals Available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-6">
            {newArrivalProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 mb-4">
                    <div className="aspect-[3/4] overflow-hidden bg-gray-200">
                      {product.itemImage && (
                        <Image
                          src={product.itemImage}
                          alt={product.itemName || 'Product'}
                          width={350}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )}
                    </div>
                  </div>
                </Link>
                
                <div className="space-y-3">
                  <Link to={`/product/${product._id}`}>
                    <h2 className="font-heading text-xl text-foreground hover:text-primary transition-colors line-clamp-2">
                      {product.itemName}
                    </h2>
                  </Link>
                  
                  <div className="flex items-center justify-between">
                    {product.itemPrice && (
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(product.itemPrice, currency ?? DEFAULT_CURRENCY)}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 text-xs font-paragraph text-foreground/70">
                    {product.isAvailable && (
                      <>
                        {product.itemPrice && <span className="bg-light-gold/20 text-primary px-2 py-1 rounded">Purchase</span>}
                        {product.rentalPrice && <span className="bg-light-gold/20 text-primary px-2 py-1 rounded">Rental</span>}
                      </>
                    )}
                  </div>

                  <Link to={`/product/${product._id}`}>
                    <button className="w-full mt-3 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded font-bold uppercase tracking-wider transition-all text-sm">
                      View Details
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
