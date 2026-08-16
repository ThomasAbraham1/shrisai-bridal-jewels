import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductSkeleton from '@/components/ProductSkeleton';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/components/ui/ProductImage';
import { Products } from '@/entities';
import { categories } from '@wix/categories';
import { BaseCrudService, DEFAULT_CURRENCY, formatPrice, useCart, useCurrency } from '@/integrations';
import wixClient from '@/wixClient';
import { calculateDiscount, hasValidDiscount } from '@/lib/pricing';
import { motion } from 'framer-motion';
import { Eye, ShoppingCart, SlidersHorizontal, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ShopPage() {
  const [products, setProducts] = useState<Products[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [categoriesList, setCategoriesList] = useState<categories.Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isCategoryReady, setIsCategoryReady] = useState(false);
  const { addingItemId, actions } = useCart();
  const { currency } = useCurrency();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Load categories from Wix Stores
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
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

    fetchCategories();
  }, []);

  // Check for category and search in URL params on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const paramLower = categoryParam.toLowerCase().trim();
      
      // If categories are loaded, try to find matching category
      if (categoriesList.length > 0) {
        const matchedCategory = categoriesList.find(c =>
          c.slug?.toLowerCase().trim() === paramLower ||
          c.name?.toLowerCase().trim() === paramLower
        );

        // If found, use the slug; otherwise use the param as-is
        if (matchedCategory && matchedCategory.slug) {
          setSelectedCategory(matchedCategory.slug);
        } else {
          setSelectedCategory(paramLower);
        }
        setIsCategoryReady(true);
      } else {
        // Categories not loaded yet, use param as-is
        setSelectedCategory(paramLower);
        setIsCategoryReady(true);
      }
      setSkip(0);
    } else {
      setIsCategoryReady(true);
    }

    const searchParam = searchParams.get('search');
    if (searchParam) {
      // Search will be applied in loadProducts
      setSkip(0);
    }
  }, [searchParams, categoriesList]);

  const priceRanges = useMemo(() => [
    { value: 'all', label: 'All Prices' },
    { value: '0-500', label: "Under ₹500" },
    { value: '500-1000', label: "₹500 - ₹1000" },
    { value: '1000-3000', label: "₹1000 - ₹3000" },
    { value: '3000-999999', label: "Above ₹3000" }
  ], []);

  const sortOptions = useMemo(() => [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
  ], []);

  useEffect(() => {
    // Only load products when category is ready
    if (!isCategoryReady) {
      return;
    }

    // Reset skip when filters change
    if (skip !== 0) {
      setSkip(0);
    } else {
      loadProducts();
    }
  }, [selectedCategory, priceRange, sortBy, isCategoryReady]);

  useEffect(() => {
    if (isCategoryReady) {
      loadProducts();
    }
  }, [skip, isCategoryReady]);

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch more products to ensure we have enough after filtering
      const result = await BaseCrudService.getAll<Products>('jewelleryproducts', {}, { limit: 100, skip });

      let filtered = result.items;

      // Apply search filter if present in URL
      const searchParam = searchParams.get('search');
      if (searchParam) {
        const query = searchParam.toLowerCase().trim();
        filtered = filtered.filter(p =>
          p.itemName?.toLowerCase().includes(query) ||
          p.itemDescription?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query) ||
          (p as any).skuCode?.toLowerCase().includes(query)
        );
      }

      // Filter by category - match against category field in products (case-insensitive, trimmed)
      if (selectedCategory !== 'all') {
        let categoryNameToMatch;
        const selectedCat = categoriesList.find(c => c.slug?.toLowerCase().trim() === selectedCategory);
        if (selectedCat && selectedCat.name) {
          categoryNameToMatch = selectedCat.name.toLowerCase().trim();
        } else {
          const matchedByName = categoriesList.find(c => c.name?.toLowerCase().trim() === selectedCategory.toLowerCase().trim());
          if (matchedByName && matchedByName.name) {
            categoryNameToMatch = matchedByName.name.toLowerCase().trim();
          } else {
            categoryNameToMatch = selectedCategory.toLowerCase().trim();
          }
        }

        if (categoryNameToMatch) {
          filtered = filtered.filter(p => {
            const productCategory = p.category?.toLowerCase().trim() || '';
            // Match exactly or as substring for flexibility
            return productCategory === categoryNameToMatch || productCategory.includes(categoryNameToMatch);
          });
        }
      }

      // Filter by price - use ourPrice if available (selling price), otherwise use itemPrice
      if (priceRange !== 'all') {
        const [minStr, maxStr] = priceRange.split('-');
        const min = parseInt(minStr);
        const max = parseInt(maxStr);

        filtered = filtered.filter(p => {
          // Use ourPrice (selling price) if available, otherwise use itemPrice
          const price = p.ourPrice || p.itemPrice || 0;
          return price >= min && price <= max;
        });
      }

      // Apply sorting
      filtered = applySorting(filtered, sortBy);

      setProducts(filtered);
      // Set hasNext based on whether we got a full batch (indicating more products exist)
      setHasNext(result.hasNext && filtered.length > 0);

      // Preload first 3 product images
      filtered.slice(0, 3).forEach(product => {
        if (product.itemImage) {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.as = 'image';
          link.href = product.itemImage;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      });
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [skip, searchParams, selectedCategory, priceRange, categoriesList, sortBy]);

  const applySorting = useCallback((items: Products[], sort: string): Products[] => {
    const sorted = [...items];

    switch (sort) {
      case 'price-low':
        return sorted.sort((a, b) => {
          const priceA = a.ourPrice || a.itemPrice || 0;
          const priceB = b.ourPrice || b.itemPrice || 0;
          return priceA - priceB;
        });
      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = a.ourPrice || a.itemPrice || 0;
          const priceB = b.ourPrice || b.itemPrice || 0;
          return priceB - priceA;
        });
      case 'newest':
      default:
        return sorted.sort((a, b) => {
          const dateA = new Date(a._createdDate || 0).getTime();
          const dateB = new Date(b._createdDate || 0).getTime();
          return dateB - dateA;
        });
    }
  }, []);

  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('newest');
    setSkip(0);
  };

  const loadMore = () => {
    setSkip(prev => prev + 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Page Header */}
      <section className="py-12 md:py-20 2xl:py-28 bg-emerald-green">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl text-white mb-2 md:mb-4 2xl:mb-6"
          >
            Shop Our Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl 2xl:text-2xl text-white/90 font-paragraph"
          >
            Discover exquisite bridal jewellery for your special day
          </motion.p>
        </div>
      </section>
      {/* Main Content */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 py-8 md:py-16 2xl:py-20">
        <div className="flex gap-4 md:gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-56 xl:w-64 2xl:w-72 flex-shrink-0">
            <div className="sticky top-32 space-y-6 md:space-y-8 2xl:space-y-10">
              <div>
                <div className="flex items-center justify-between mb-3 md:mb-4 2xl:mb-6">
                  <h3 className="font-heading text-lg md:text-xl 2xl:text-2xl text-foreground">Filters</h3>
                  <button
                    onClick={resetFilters}
                    className="text-xs md:text-sm 2xl:text-base text-primary hover:text-primary/80 font-paragraph uppercase tracking-wider"
                  >
                    Reset
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-4 md:mb-6 2xl:mb-8">
                  <h4 className="font-paragraph font-semibold text-foreground mb-2 md:mb-3 2xl:mb-4 text-sm md:text-base 2xl:text-lg">Category</h4>
                  <div className="space-y-1 md:space-y-2 2xl:space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value="all"
                        checked={selectedCategory === 'all'}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setSkip(0);
                        }}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="font-paragraph text-sm 2xl:text-base text-foreground/80 group-hover:text-primary transition-colors">All Products</span>
                    </label>
                    {!isLoadingCategories && categoriesList.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          value={cat.slug || cat.name || ''}
                          checked={selectedCategory === (cat.slug || cat.name)?.toLowerCase().trim()}
                          onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setSkip(0);
                          }}
                          className="w-3.5 h-3.5 md:w-4 2xl:w-5 md:h-4 2xl:h-5 text-primary bg-background border-primary/20 focus:ring-primary/20 focus:ring-offset-background"
                        />
                        <span className="font-paragraph text-sm 2xl:text-base text-foreground/80 group-hover:text-primary transition-colors">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h4 className="font-paragraph font-semibold text-foreground mb-2 md:mb-3 2xl:mb-4 text-sm md:text-base 2xl:text-lg">Price Range</h4>
                  <div className="space-y-1 md:space-y-2 2xl:space-y-3">
                    {priceRanges.map((range) => (
                      <label key={range.value} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="price"
                          value={range.value}
                          checked={priceRange === range.value}
                          onChange={(e) => {
                            setPriceRange(e.target.value);
                            setSkip(0);
                          }}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="font-paragraph text-sm 2xl:text-base text-foreground/80 group-hover:text-primary transition-colors">
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden fixed bottom-4 right-4 z-40">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>

          {/* Mobile Filters Modal */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowFilters(false)}>
              <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-2xl text-foreground">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-paragraph font-semibold text-foreground mb-3">Category</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category-mobile"
                        value="all"
                        checked={selectedCategory === 'all'}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setSkip(0);
                        }}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="font-paragraph text-foreground/80">All Products</span>
                    </label>
                    {!isLoadingCategories && categoriesList.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="mobile-category"
                          value={cat.slug || cat.name || ''}
                          checked={selectedCategory === (cat.slug || cat.name)?.toLowerCase().trim()}
                          onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setSkip(0);
                          }}
                          className="w-4 h-4 text-primary bg-background border-primary/20 focus:ring-primary/20 focus:ring-offset-background"
                        />
                        <span className="text-gray-600">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <h4 className="font-paragraph font-semibold text-foreground mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="price-mobile"
                          value={range.value}
                          checked={priceRange === range.value}
                          onChange={(e) => {
                            setPriceRange(e.target.value);
                            setSkip(0);
                          }}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="font-paragraph text-foreground/80">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={resetFilters} variant="outline" className="flex-1">
                    Reset
                  </Button>
                  <Button onClick={() => setShowFilters(false)} className="flex-1 bg-primary">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1" style={{ minHeight: '600px' }}>
            {/* Sorting Bar */}
            {!isLoading && products.length > 0 && (
              <div className="mb-6 flex justify-between items-center">
                <p className="text-foreground/70 font-paragraph" role="status" aria-live="polite" aria-atomic="true">
                  {products.length} products
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-select" className="font-paragraph text-foreground/70">Sort by:</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-foreground/20 rounded-lg font-paragraph text-foreground bg-white hover:border-primary transition-colors focus:outline-none focus:border-primary"
                    aria-label="Sort products by"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-3 md:gap-6 2xl:gap-8 mb-8 2xl:mb-12" role="status" aria-label="Loading products" aria-busy="true">
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="font-heading text-3xl text-foreground mb-4">No products found</h3>
                <p className="text-foreground/70 font-paragraph mb-6">Try adjusting your filters</p>
                <Button onClick={resetFilters} className="bg-primary hover:bg-primary/90">
                  Reset Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-3 md:gap-6 2xl:gap-8 mb-8 2xl:mb-12" role="region" aria-label="Product grid">
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    >
                      {/* Product Image */}
                      <div
                        className="relative aspect-[3/4] overflow-hidden bg-background cursor-pointer flex items-center justify-center"
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%'
                        }}
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        <ProductImage
                          src={product.itemImage || '/media/b9ec8c_5984a48894ec46509c2aef0cec485f07_mv2.png'}
                          alt={product.itemName || 'Product'}
                          fittingType="fill"
                          width={400}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {!product.isAvailable && (
                            <span className="bg-destructive text-white px-3 py-1 rounded-full text-xs font-paragraph uppercase tracking-wider">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product/${product._id}`);
                            }}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-lg"
                            aria-label={`View ${product.itemName}`}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 sm:p-6 flex flex-col h-full">
                        <h3
                          className="font-paragraph font-semibold text-foreground mb-2 line-clamp-2 cursor-pointer hover:text-primary transition-colors text-sm sm:text-base"
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          {product.itemName}
                        </h3>

                        <div className="flex items-baseline gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                          {hasValidDiscount(product) ? (
                            <>
                              <span className="text-xs sm:text-sm text-foreground/60 font-paragraph line-through">
                                {formatPrice(product.mrp!, currency ?? DEFAULT_CURRENCY)}
                              </span>
                              <span className="text-lg sm:text-2xl font-heading font-bold text-primary">
                                {formatPrice(product.ourPrice!, currency ?? DEFAULT_CURRENCY)}
                              </span>
                              <span className="text-[10px] sm:text-xs font-bold bg-destructive text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                                {calculateDiscount(product.mrp!, product.ourPrice!)}% OFF
                              </span>
                            </>
                          ) : (
                            <span className="text-lg sm:text-2xl font-heading font-bold text-primary">
                              {formatPrice(product.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
                            </span>
                          )}
                          {product.rentalPrice && (
                            <span className="text-[10px] sm:text-sm text-foreground/60 font-paragraph">
                              Rental: {formatPrice(product.rentalPrice, currency ?? DEFAULT_CURRENCY)}
                            </span>
                          )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-paragraph">
                          {product.stockQuantity && product.stockQuantity > 0 ? (
                            <span className="text-green-700 bg-green-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">✓ In Stock ({product.stockQuantity})</span>
                          ) : (
                            <span className="text-red-700 bg-red-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Out of Stock</span>
                          )}
                        </div>

                        {/* Action Row - VIEW and Add to Cart buttons */}
                        <div className="flex items-center justify-between gap-2 sm:gap-2.5 mt-3 sm:mt-4 mb-0">
                          <button
                            onClick={() => navigate(`/product/${product._id}`)}
                            className="h-[34px] w-[105px] bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-200 flex items-center justify-center whitespace-nowrap"
                            aria-label="View product details"
                          >
                            View
                          </button>
                          <button
                            onClick={() => actions.addToCart({
                              collectionId: 'jewelleryproducts',
                              itemId: product._id
                            })}
                            disabled={!product.isAvailable || addingItemId === product._id}
                            className="h-[34px] w-[34px] bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground rounded-lg flex items-center justify-center transition-colors duration-200 flex-shrink-0"
                            aria-label="Add to cart"
                          >
                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
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
                      Load More Products
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
