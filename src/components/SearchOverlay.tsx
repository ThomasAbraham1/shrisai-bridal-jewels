import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { Products } from '@/entities';
import { useNavigate } from 'react-router-dom';
import { useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { getDisplayPrice, hasValidDiscount, calculateDiscount } from '@/lib/pricing';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Products[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allProducts, setAllProducts] = useState<Products[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { currency } = useCurrency();

  // Load all products on mount
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        const result = await BaseCrudService.getAll<Products>('jewelleryproducts', {}, { limit: 1000 });
        setAllProducts(result.items);
        
        // Preload first 3 product images
        result.items.slice(0, 3).forEach(product => {
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
      }
    };
    loadAllProducts();
  }, []);

  // Focus input when overlay opens and lock body scroll
  useEffect(() => {
    if (isOpen) {
      if (searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle search - now includes SKU search
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const query = searchQuery.toLowerCase();
        const filtered = allProducts.filter(product =>
          product.itemName?.toLowerCase().includes(query) ||
          product.itemDescription?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          (product as any).skuCode?.toLowerCase().includes(query)
        );
        setResults(filtered.slice(0, 8)); // Show top 8 results
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, allProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      onClose();
      setSearchQuery('');
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    onClose();
    setSearchQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 pointer-events-auto"
          />

          {/* Search Overlay Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-2xl flex flex-col"
            style={{ maxHeight: '90vh' }}
          >
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-8 flex flex-col w-full min-h-0 flex-1">
              {/* Search Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-lg md:text-2xl text-secondary">Search Products</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-background rounded-full transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5 text-secondary" />
                </button>
              </div>

              {/* Search Input */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by product name, SKU, category, or description..."
                    className="w-full pl-12 pr-4 py-3 md:py-4 bg-background border border-secondary/10 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 font-paragraph text-sm md:text-base transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white rounded transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4 text-secondary/50" />
                    </button>
                  )}
                </div>
              </form>

              {/* Results */}
              <div className="overflow-y-auto flex-1 min-h-0" style={{ maxHeight: '55vh' }}>
                {isSearching ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                  </div>
                ) : searchQuery.trim() ? (
                  <>
                    {results.length > 0 ? (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6">
                          {results.map((product) => (
                            <motion.div
                              key={product._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              onClick={() => handleProductClick(product._id)}
                              className="group cursor-pointer"
                            >
                              <div className="bg-background rounded-lg overflow-hidden border border-secondary/5 hover:border-primary/30 transition-all hover:shadow-md">
                                <div className="aspect-square overflow-hidden bg-white relative">
                                  {product.itemImage && (
                                    <Image
                                      src={product.itemImage}
                                      alt={product.itemName || 'Product'}
                                      width={300}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                  )}
                                </div>
                                <div className="p-3">
                                  <h3 className="font-paragraph text-xs md:text-sm font-semibold text-secondary line-clamp-2 mb-1">
                                    {product.itemName}
                                  </h3>
                                  {(product as any).skuCode && (
                                    <p className="text-[9px] md:text-xs text-primary font-semibold mb-1 uppercase tracking-wider">
                                      SKU: {(product as any).skuCode}
                                    </p>
                                  )}
                                  <p className="text-[10px] md:text-xs text-secondary/60 mb-2 line-clamp-1">
                                    {product.category}
                                  </p>
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="font-heading text-sm md:text-base text-primary">
                                        {formatPrice(getDisplayPrice(product), currency ?? DEFAULT_CURRENCY)}
                                      </span>
                                      {hasValidDiscount(product) && (
                                        <>
                                          <span className="text-[10px] md:text-xs text-secondary/50 line-through">
                                            {formatPrice(product.mrp || 0, currency ?? DEFAULT_CURRENCY)}
                                          </span>
                                          <span className="text-[9px] md:text-xs font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                            -{calculateDiscount(product.mrp || 0, product.ourPrice || 0)}%
                                          </span>
                                        </>
                                      )}
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {results.length > 0 && (
                          <div className="text-center">
                            <button
                              onClick={handleSearch}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-light-gold text-secondary font-paragraph text-xs md:text-sm uppercase tracking-wider rounded-lg transition-all"
                            >
                              View All Results <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <Search className="w-12 h-12 text-secondary/20 mx-auto mb-4" />
                        <p className="text-secondary/60 font-paragraph text-sm">
                          No products found for "{searchQuery}"
                        </p>
                        <p className="text-secondary/40 font-paragraph text-xs mt-2">
                          Try searching with different keywords or SKU codes
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-secondary/20 mx-auto mb-4" />
                    <p className="text-secondary/60 font-paragraph text-sm">
                      Start typing to search our collection
                    </p>
                    <p className="text-secondary/40 font-paragraph text-xs mt-2">
                      Search by product name, SKU, category, or description
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
