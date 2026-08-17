import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, XCircle, RefreshCcw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/integrations';
import wixClient from '@/wixClient';

export default function ThankYouPage() {
  const navigate = useNavigate();
  const { actions } = useCart();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'unknown'>('loading');

  useEffect(() => {
    async function verifyPayment() {
      const orderId = searchParams.get('orderId');
      
      // If there's no order ID, it might be a cancelled checkout or direct visit
      if (!orderId) {
        // We'll consider this failed/cancelled since no order was created
        setStatus('failed');
        return;
      }

      try {
        const order = await wixClient.orders.getOrder(orderId);
        // Check if payment is successful or pending
        if (order.paymentStatus === 'PAID' || order.paymentStatus === 'PENDING') {
          setStatus('success');
          actions.clearCart();
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Error verifying order:', error);
        setStatus('unknown');
      }
    }

    verifyPayment();
  }, [searchParams, actions]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-10 shadow-lg text-center max-w-lg w-full border-t-4 border-red-500"
          >
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            
            <h1 className="font-heading text-4xl text-foreground mb-4">Payment Incomplete</h1>
            <p className="font-paragraph text-foreground/70 mb-8 leading-relaxed">
              It looks like your payment was cancelled or failed. Your items are still saved in your cart. You can try checking out again when you're ready.
            </p>

            <div className="flex flex-col gap-4">
              <Button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider py-4"
              >
                <RefreshCcw className="w-5 h-5 mr-2" />
                Try Payment Again
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/cart')}
                className="w-full border-primary/20 text-foreground hover:bg-primary/5 font-bold uppercase tracking-wider py-4"
              >
                Return to Cart
              </Button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // Success or unknown status
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-10 shadow-lg text-center max-w-lg w-full"
        >
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          
          <h1 className="font-heading text-4xl text-foreground mb-4">Payment Successful!</h1>
          <p className="font-paragraph text-foreground/70 mb-8 leading-relaxed">
            Thank you for your order. We have securely received your payment and will begin processing your items shortly. 
            You can track your order status in your account dashboard.
          </p>

          <div className="flex flex-col gap-4">
            <Button 
              onClick={() => navigate('/my-orders')}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider py-4"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              View My Orders
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/shop')}
              className="w-full border-primary/20 text-foreground hover:bg-primary/5 font-bold uppercase tracking-wider py-4"
            >
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
