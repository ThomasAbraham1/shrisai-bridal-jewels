import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { RentalProducts, RentByCategory } from '@/entities';
import { useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNavigate, Link } from 'react-router-dom';
import { SEOMeta } from '@/components/SEOMeta';
import { SEO_PAGES, generateBreadcrumbSchema } from '@/lib/seo';

export default function RentalPage() {
  const [products, setProducts] = useState<RentalProducts[]>([]);
  const [allProducts, setAllProducts] = useState<RentalProducts[]>([]);
  const [categories, setCategories] = useState<RentByCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const { currency } = useCurrency();
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
    loadRentalProducts();
  }, []);

  useEffect(() => {
    filterProductsByCategory();
  }, [selectedCategory, allProducts]);

  const loadCategories = async () => {
    try {
      setIsCategoriesLoading(true);
      const result = await BaseCrudService.getAll<RentByCategory>('rentbycategory', {}, { limit: 100 });
      const sortedCategories = result.items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      setCategories(sortedCategories);
    } catch (error) {
      // Silently handle error - UI will show empty states
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const loadRentalProducts = async () => {
    try {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<RentalProducts>('rentalproducts', {}, { limit: 100 });
      
      setAllProducts(result.items);
      setProducts(result.items);
      setHasNext(false);
    } catch (error) {
      // Silently handle error - UI will show empty states
    } finally {
      setIsLoading(false);
    }
  };

  const filterProductsByCategory = () => {
    if (!selectedCategory) {
      setProducts(allProducts);
      setHasNext(false);
    } else {
      const filtered = allProducts.filter(product => product.slug === selectedCategory);
      setProducts(filtered);
      setHasNext(false);
    }
    setSkip(0);
  };

  const loadMore = () => {
    setSkip(prev => prev + 12);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Page Header / Hero */}
      <section className="py-20 bg-emerald-green">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-6xl text-white mb-4"
          >
            Rental Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 font-paragraph"
          >
            Premium imitation bridal jewellery rentals at affordable prices
          </motion.p>
        </div>
      </section>
      {/* Browse by Category */}
      <section className="bg-white py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-5xl text-foreground mb-4">Browse by Category</h2>
            <p className="text-lg text-foreground/70 font-paragraph">Find the perfect jewellery for your style</p>
          </motion.div>

          {isCategoriesLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center">
              {/* All Categories Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-3 rounded-full font-paragraph font-semibold transition-all duration-300 ${
                  selectedCategory === null
                    ? 'bg-secondary text-white shadow-lg'
                    : 'bg-white text-secondary border-2 border-secondary hover:bg-secondary/5'
                }`}
              >
                All Categories
              </motion.button>

              {/* Category Buttons */}
              {categories.map((category, index) => (
                <motion.button
                  key={category._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedCategory(category.slug || '')}
                  className={`px-6 py-3 rounded-full font-paragraph font-semibold transition-all duration-300 ${
                    selectedCategory === category.slug
                      ? 'bg-secondary text-white shadow-lg'
                      : 'bg-white text-secondary border-2 border-secondary hover:bg-secondary/5'
                  }`}
                >
                  {category.categoryName}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Rental Products */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-5xl text-foreground mb-4">Available for Rent</h2>
          <p className="text-lg text-foreground/70 font-paragraph">Premium jewellery pieces ready for your special day</p>
        </motion.div>

        <div style={{ minHeight: '600px' }}>
          {isLoading ? (
            <div className="flex items-center justify-center" style={{ minHeight: '600px' }}>
              <LoadingSpinner />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="font-heading text-3xl text-foreground mb-4">No rental jewellery available in this category.</h3>
              <p className="text-foreground/70 font-paragraph mb-6">Try selecting a different category</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-6 mb-8">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${product.availabilityStatus !== false ? 'hover:shadow-2xl hover:-translate-y-2 cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
                    onClick={() => product.availabilityStatus !== false && navigate(`/rental-booking/${product._id}`)}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-background">
                      <Image
                        src={product.image || '/media/b9ec8c_46c93e43a9f3488d916f12200eb5b759_mv2.png'}
                        alt={product.name || 'Product'}
                        width={400}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Rental Badge */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-paragraph uppercase tracking-wider shadow-sm">
                          For Rent
                        </span>
                        {product.availabilityStatus === false && (
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-paragraph uppercase tracking-wider shadow-sm">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                        <span className="text-sm text-foreground/60 font-paragraph ml-2">(18)</span>
                      </div>

                      <h3 className="font-paragraph font-semibold text-foreground mb-2 line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-heading font-bold text-primary">
                            {formatPrice(product.price || 0, currency ?? DEFAULT_CURRENCY)}
                          </span>
                          <span className="text-sm text-foreground/60 font-paragraph">/ rental</span>
                        </div>
                      </div>

                      {product.availabilityStatus !== false ? (
                        <Link to={`/rental-booking/${product._id}`} className="w-full" onClick={(e) => e.stopPropagation()}>
                          <Button
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider"
                          >
                            View & Book
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          disabled
                          className="w-full bg-gray-300 text-gray-500 font-bold uppercase tracking-wider cursor-not-allowed"
                        >
                          Out of Stock
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              {hasNext && (
                <div className="text-center">
                  <Button
                    onClick={loadMore}
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold uppercase tracking-wider"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      {/* How Rental Works */}
      <section className="bg-background py-24">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-5xl text-foreground mb-4">How Rental Works</h2>
            <p className="text-lg text-foreground/70 font-paragraph">Simple and hassle-free rental process</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Choose Jewellery', description: 'Browse and select your favorite pieces' },
              { step: '02', title: 'Book Online', description: 'Pay 25% advance to confirm booking' },
              { step: '03', title: 'Receive & Enjoy', description: 'Get delivery on your specified date' },
              { step: '04', title: 'Return', description: 'Return after your event, get deposit back' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="font-heading text-2xl text-white">{item.step}</span>
                  </div>
                  <h3 className="font-heading text-2xl text-foreground mb-3">{item.title}</h3>
                  <p className="text-foreground/70 font-paragraph">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Terms Section */}
      <section className="bg-white py-24">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-5xl text-foreground mb-4">Rental Terms</h2>
            <p className="text-lg text-foreground/70 font-paragraph">Important information about our rental service</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { title: 'Advance Payment', description: "Pay % of rental price to confirm your booking" },
              { title: 'Rental Duration', description: 'Minimum 3 days, maximum 15 days rental period' },
              { title: 'Delivery & Pickup', description: 'Free delivery and pickup within city limits' },
              { title: 'Cancellation', description: 'Cancel up to 7 days before event for full refund' },
              { title: 'Damage Policy', description: 'Minor wear covered, major damage deducted from deposit' }
            ].map((term, index) => (
              <motion.div
                key={term.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-xl text-foreground mb-2">{term.title}</h3>
                  <p className="text-foreground/70 font-paragraph">{term.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
