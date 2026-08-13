import { useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, isCheckingOut, actions } = useCart();
  const { currency } = useCurrency();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-20">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
            <h1 className="font-heading text-4xl text-foreground mb-4">Your Cart is Empty</h1>
            <p className="text-foreground/70 font-paragraph mb-8">Add items to your cart before checking out</p>
            <Button
              onClick={() => navigate('/shop')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider"
            >
              Continue Shopping
            </Button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!formData.firstName || !formData.email || !formData.address || !formData.city) {
      alert('Please fill in all required fields');
      return;
    }
    
    // In a real implementation, this would process the payment
    // For now, we'll just show a success message and clear the cart
    alert('Order placed successfully! Thank you for your purchase.');
    await actions.clearCart();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <section className="bg-secondary py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center gap-2 text-white hover:text-light-gold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-paragraph uppercase tracking-wider text-sm">Back to Shop</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white hover:text-light-gold transition-colors"
            >
              <span className="font-paragraph uppercase tracking-wider text-sm">Home</span>
            </button>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-5xl text-white"
          >
            Checkout
          </motion.h1>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="font-heading text-2xl text-foreground mb-6">Shipping Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-paragraph text-sm text-foreground mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-foreground/20 rounded-lg font-paragraph focus:outline-none focus:border-primary"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block font-paragraph text-sm text-foreground mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-foreground/20 rounded-lg font-paragraph focus:outline-none focus:border-primary"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-paragraph text-sm text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-foreground/20 rounded-lg font-paragraph focus:outline-none focus:border-primary"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block font-paragraph text-sm text-foreground mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-foreground/20 rounded-lg font-paragraph focus:outline-none focus:border-primary"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block font-paragraph text-sm text-foreground mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-foreground/20 rounded-lg font-paragraph focus:outline-none focus:border-primary"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-paragraph text-sm text-foreground mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-foreground/20 rounded-lg font-paragraph focus:outline-none focus:border-primary"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block font-paragraph text-sm text-foreground mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-foreground/20 rounded-lg font-paragraph focus:outline-none focus:border-primary"
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-paragraph text-sm text-foreground mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-foreground/20 rounded-lg font-paragraph focus:outline-none focus:border-primary"
                    placeholder="10001"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isCheckingOut}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider py-3 mt-6"
                >
                  {isCheckingOut ? 'Processing...' : 'Place Order'}
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg sticky top-24"
            >
              <h3 className="font-heading text-xl text-foreground mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b border-foreground/10">
                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-background">
                      <Image
                        src={item.image || '/media/b9ec8c_3e9aee1a27d64c2d951d19babce67944_mv2.png'}
                        alt={item.name}
                        width={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-paragraph text-sm text-foreground font-semibold truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-foreground/60 font-paragraph">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-primary font-bold text-sm">
                        {formatPrice(item.price * item.quantity, currency ?? DEFAULT_CURRENCY)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-foreground/10 pt-4">
                <div className="flex justify-between font-paragraph text-foreground/70">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice, currency ?? DEFAULT_CURRENCY)}</span>
                </div>
                <div className="flex justify-between font-paragraph text-foreground/70">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between font-heading text-lg text-foreground pt-3 border-t border-foreground/10">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalPrice, currency ?? DEFAULT_CURRENCY)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
