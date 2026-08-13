import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductImageGallery from '@/components/ProductImageGallery';
import { BaseCrudService } from '@/integrations';
import { Products } from '@/entities';
import { useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getStockLabel, isProductAvailable } from '@/lib/inventory';

// Helper function to calculate discount percentage
const calculateDiscount = (mrp: number, ourPrice: number): number => {
  if (!mrp || mrp <= 0) return 0;
  return Math.round(((mrp - ourPrice) / mrp) * 100);
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Products | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Products[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { items, addingItemId, actions } = useCart();
  const { currency } = useCurrency();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        if (!id) {
          navigate('/shop');
          return;
        }
        const data = await BaseCrudService.getById<Products>('jewelleryproducts', id);
        if (!data) {
          navigate('/shop');
          return;
        }
        setProduct(data);

        // Preload main product image
        if (data.itemImage) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = data.itemImage;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }

        // Load related products from same category - optimized with limit
        if (data.category) {
          const allProducts = await BaseCrudService.getAll<Products>('jewelleryproducts', {}, { limit: 20 });
          const related = allProducts.items
            .filter(p => p.category === data.category && p._id !== data._id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        navigate('/shop');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (product) {
      await actions.addToCart({
        collectionId: 'jewelleryproducts',
        itemId: product._id,
        quantity
      });
    }
  };

  const handleBuyNow = async () => {
    if (product) {
      // Check if product already exists in cart with same quantity
      const existingItem = items.find(
        item => item.itemId === product._id && item.quantity === quantity
      );
      
      // Only add to cart if it doesn't already exist with the same quantity
      if (!existingItem) {
        await actions.addToCart({
          collectionId: 'jewelleryproducts',
          itemId: product._id,
          quantity
        });
      }
      
      // Redirect to checkout
      navigate('/checkout');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center" style={{ minHeight: '600px' }}>
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-20 text-center">
          <h1 className="font-heading text-4xl text-secondary mb-4">Product Not Found</h1>
          <p className="text-foreground/70 font-paragraph mb-8">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/shop')} className="bg-primary hover:bg-primary/90">
            Back to Shop
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Header />

      {/* Breadcrumb Navigation */}
      <section className="bg-secondary/5 border-b border-secondary/10 w-full overflow-x-hidden">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-4 box-border">
          <div className="flex items-center gap-2 text-sm font-paragraph overflow-x-auto pb-2 min-w-0">
            <Link to="/" className="text-primary hover:text-primary/80 transition-colors whitespace-nowrap">Home</Link>
            <ChevronRight className="w-4 h-4 text-foreground/40 flex-shrink-0" />
            <Link to="/shop" className="text-primary hover:text-primary/80 transition-colors whitespace-nowrap">Shop</Link>
            {product?.category && (
              <>
                <ChevronRight className="w-4 h-4 text-foreground/40 flex-shrink-0" />
                <span className="text-foreground/60 whitespace-nowrap">{product.category}</span>
              </>
            )}
            {product?.itemName && (
              <>
                <ChevronRight className="w-4 h-4 text-foreground/40 flex-shrink-0" />
                <span className="text-foreground/60 line-clamp-1">{product.itemName}</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-16 box-border">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 w-full items-start">
          {/* Product Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full min-w-0"
          >
            <ProductImageGallery
              mainImage={product.itemImage || '/media/978e03_a70be498988c4ccd8be3259a6c64ff17_mv2.png'}
              productGallery={product.productGallery}
              productGallery2={product.productGallery2}
              productGallery3={product.productGallery3}
              productGallery4={product.productGallery4}
              productGallery5={product.productGallery5}
              productName={product.itemName || 'Product'}
            />
          </motion.div>

          {/* Product Info - Aligned Container */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full min-w-0"
          >
            {/* Mobile/Tablet: Responsive container matching gallery alignment */}
            <div className="w-full box-border">
              {/* 1. Product Title */}
              <div className="mb-6 w-full">
                <span className="text-primary text-xs font-paragraph uppercase tracking-widest mb-2 block">
                  {product.category || 'Jewellery'}
                </span>
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-secondary mb-4 break-words">
                  {product.itemName}
                </h1>
              </div>

              {/* 2. SKU */}
              {(product as any).skuCode && (
                <p className="text-sm font-paragraph text-secondary/70 mb-4 break-words">
                  <span className="font-semibold text-primary">SKU:</span> {(product as any).skuCode}
                </p>
              )}

              {/* 3. Pricing & Discount */}
              <div className="flex items-center gap-2 md:gap-4 mb-6 flex-wrap w-full">
                {product.enableDiscount && product.mrp && product.ourPrice ? (
                  <>
                    <span className="text-base md:text-lg text-foreground/60 font-paragraph line-through">
                      {formatPrice(product.mrp, currency ?? DEFAULT_CURRENCY)}
                    </span>
                    <div className="text-2xl md:text-4xl font-heading text-primary">
                      {formatPrice(product.ourPrice, currency ?? DEFAULT_CURRENCY)}
                    </div>
                    <span className="text-xs md:text-sm font-bold bg-destructive text-white px-2 md:px-3 py-1 rounded-full">
                      {calculateDiscount(product.mrp, product.ourPrice)}% OFF
                    </span>
                  </>
                ) : (
                  <div className="text-2xl md:text-4xl font-heading text-primary">
                    {formatPrice(product.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
                  </div>
                )}
                {product.rentalPrice && (
                  <div className="text-sm md:text-lg text-foreground/60 font-paragraph">
                    Rental: {formatPrice(product.rentalPrice, currency ?? DEFAULT_CURRENCY)}
                  </div>
                )}
              </div>

              {/* 4. Quantity Selector */}
              {isProductAvailable(product.stockQuantity) && (
                <div className="mb-6 w-full">
                  <div className="flex items-center gap-2 md:gap-4 flex-wrap w-full">
                    <label className="font-paragraph text-sm text-foreground whitespace-nowrap">Quantity:</label>
                    <div className="flex items-center border border-secondary/20 rounded-lg flex-shrink-0">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 md:px-4 py-2 text-foreground hover:bg-secondary/5 transition-colors"
                      >
                        −
                      </button>
                      <span className="px-4 md:px-6 py-2 font-paragraph text-foreground">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 md:px-4 py-2 text-foreground hover:bg-secondary/5 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Stock Availability */}
              <div className="mb-6 w-full">
                <div className={`inline-flex items-center px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-paragraph ${
                  isProductAvailable(product.stockQuantity)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isProductAvailable(product.stockQuantity) ? '✓' : '✗'} {getStockLabel(product.stockQuantity)}
                </div>
              </div>

              {/* 6. Add to Cart & Buy Now Buttons */}
              {isProductAvailable(product.stockQuantity) && (
                <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
                  <Button
                    onClick={handleAddToCart}
                    disabled={addingItemId === product._id}
                    className="flex-1 bg-primary hover:bg-primary/90 text-secondary font-paragraph uppercase tracking-widest h-14 rounded-[10px] transition-all text-sm md:text-base font-bold min-w-0"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="truncate">{addingItemId === product._id ? 'Adding...' : 'Add to Cart'}</span>
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#0E4A3A] hover:bg-[#0a3a2d] text-white font-paragraph uppercase tracking-[0.5px] h-14 rounded-[10px] transition-all duration-250 text-sm md:text-base font-bold min-w-0"
                  >
                    <span className="truncate">Buy Now</span>
                  </Button>
                </div>
              )}

              {/* 7. Description (moved to end) */}
              {product.itemDescription && (
                <div className="mb-8 w-full">
                  <h3 className="font-heading text-lg text-secondary mb-3">Description</h3>
                  <p className="text-foreground/80 font-paragraph leading-relaxed break-words">
                    {product.itemDescription}
                  </p>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && (
                <div className="mb-8 w-full">
                  <h3 className="font-heading text-lg text-secondary mb-3">Specifications</h3>
                  <p className="text-foreground/80 font-paragraph leading-relaxed break-words">
                    {product.specifications}
                  </p>
                </div>
              )}

              {/* Contact for Rental */}
              {product.rentalPrice && (
                <div className="mt-8 p-4 md:p-6 bg-primary/10 rounded-lg border border-primary/20 w-full">
                  <p className="text-sm font-paragraph text-foreground mb-3">
                    Interested in renting this piece?
                  </p>
                  <Button
                    asChild
                    className="bg-primary hover:bg-primary/90 text-secondary font-paragraph uppercase tracking-widest w-full"
                  >
                    <a href="tel:09080242663">Call to Rent</a>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-20 border-t border-secondary/10 box-border">
          <div className="mb-8 md:mb-16">
            <span className="text-primary text-xs font-paragraph uppercase tracking-[0.2em] mb-2 md:mb-4 block">Related Items</span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-secondary">You Might Also Like</h2>
            <div className="w-12 h-[1px] bg-primary mt-3 md:mt-6"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
            {relatedProducts.map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group w-full min-w-0"
              >
                <Link to={`/product/${relatedProduct._id}`} className="block w-full">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 mb-4 w-full">
                    <Image
                      src={relatedProduct.itemImage || '/media/b9ec8c_5984a48894ec46509c2aef0cec485f07_mv2.png'}
                      alt={relatedProduct.itemName || 'Product'}
                      width={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </Link>
                
                <div className="space-y-3 w-full min-w-0">
                  <Link to={`/product/${relatedProduct._id}`} className="block w-full min-w-0">
                    <h3 className="font-heading text-base md:text-lg text-foreground hover:text-primary transition-colors line-clamp-2 break-words">
                      {relatedProduct.itemName}
                    </h3>
                  </Link>
                  
                  <div className="flex items-baseline gap-2 md:gap-3 flex-wrap w-full">
                    {relatedProduct.enableDiscount && relatedProduct.mrp && relatedProduct.ourPrice ? (
                      <>
                        <span className="text-xs md:text-sm text-foreground/60 font-paragraph line-through">
                          {formatPrice(relatedProduct.mrp, currency ?? DEFAULT_CURRENCY)}
                        </span>
                        <span className="text-lg md:text-xl font-heading font-bold text-primary">
                          {formatPrice(relatedProduct.ourPrice, currency ?? DEFAULT_CURRENCY)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg md:text-xl font-heading font-bold text-primary">
                        {formatPrice(relatedProduct.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={() => actions.addToCart({ 
                      collectionId: 'jewelleryproducts', 
                      itemId: relatedProduct._id 
                    })}
                    disabled={!isProductAvailable(relatedProduct.stockQuantity) || addingItemId === relatedProduct._id}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider text-xs md:text-sm"
                  >
                    {addingItemId === relatedProduct._id ? 'Adding...' : 'Add to Cart'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
