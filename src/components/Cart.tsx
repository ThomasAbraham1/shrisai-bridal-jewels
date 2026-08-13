import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const navigate = useNavigate();
  const { items, totalPrice, isOpen, isCheckingOut, actions } = useCart();
  const { currency } = useCurrency();

  const handleContinueShopping = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    actions.closeCart();
    navigate('/shop');
  }, [actions, navigate]);

  const handleCheckout = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    await actions.checkout();
    navigate('/checkout');
  }, [actions, navigate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={actions.closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 pointer-events-auto"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-foreground/10">
              <div className="flex items-center gap-2 md:gap-3">
                <ShoppingBag className="w-5 md:w-6 h-5 md:h-6 text-primary" />
                <h2 className="font-heading text-lg md:text-2xl text-foreground">Shopping Cart</h2>
              </div>
              <button
                onClick={actions.closeCart}
                className="p-2 hover:bg-background rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 md:w-6 h-5 md:h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 md:w-20 h-16 md:h-20 text-foreground/20 mb-3 md:mb-4" />
                  <h3 className="font-heading text-lg md:text-xl text-foreground mb-2">Your cart is empty</h3>
                  <p className="text-foreground/60 font-paragraph text-xs md:text-sm mb-4 md:mb-6">
                    Add some beautiful jewellery to get started
                  </p>
                  <Button
                    onClick={handleContinueShopping}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider text-xs md:text-sm"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-3 md:gap-4 bg-background rounded-lg p-3 md:p-4"
                    >
                      {/* Item Image */}
                      <div className="w-20 md:w-24 h-20 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                        <Image
                          src={item.image || '/media/b9ec8c_3e9aee1a27d64c2d951d19babce67944_mv2.png'}
                          alt={item.name}
                          width={96}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-paragraph text-foreground font-semibold mb-1 truncate text-xs md:text-sm">
                          {item.name}
                        </h3>
                        <p className="text-primary font-paragraph font-bold mb-2 md:mb-3 text-xs md:text-sm">
                          {formatPrice(item.price, currency ?? DEFAULT_CURRENCY)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 md:gap-3">
                          <button
                            onClick={() => actions.updateQuantity(item, Math.max(1, item.quantity - 1))}
                            className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-white hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 md:w-4 h-3 md:h-4" />
                          </button>
                          <span className="font-paragraph font-semibold text-foreground min-w-[2rem] text-center text-xs md:text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => actions.updateQuantity(item, item.quantity + 1)}
                            className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-white hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 md:w-4 h-3 md:h-4" />
                          </button>
                          <button
                            onClick={() => actions.removeFromCart(item)}
                            className="ml-auto text-destructive hover:text-destructive/80 font-paragraph text-xs transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-foreground/10 p-4 md:p-6 space-y-3 md:space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="font-heading text-lg md:text-xl text-foreground">Total</span>
                  <span className="font-heading text-xl md:text-2xl text-primary">
                    {formatPrice(totalPrice, currency ?? DEFAULT_CURRENCY)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider py-4 md:py-6 text-xs md:text-lg"
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </Button>

                {/* Continue Shopping */}
                <Button
                  onClick={handleContinueShopping}
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold uppercase tracking-wider text-xs md:text-sm"
                >
                  Continue Shopping
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
