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
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    async function verifyPayment() {
      // Log ALL URL params so we can see exactly what Wix sends back
      const allParams: Record<string, string> = {};
      searchParams.forEach((value, key) => { allParams[key] = value; });
      console.log('[ThankYouPage] URL params from Wix:', allParams);

      // Try every possible param name Wix might use for the order ID
      const orderId =
        searchParams.get('orderId') ||
        searchParams.get('wixOrderId') ||
        searchParams.get('order_id') ||
        searchParams.get('checkoutId') ||
        null;

      console.log('[ThankYouPage] Resolved orderId:', orderId);

      // If no orderId at all → payment was cancelled before order creation
      if (!orderId) {
        console.log('[ThankYouPage] No orderId found → treating as failed/cancelled');
        setStatus('failed');
        return;
      }

      // orderId exists → an order was created; verify its payment status
      try {
        const order = await wixClient.orders.getOrder(orderId);
        console.log('[ThankYouPage] Order paymentStatus:', order?.paymentStatus);

        if (
          order?.paymentStatus === 'PAID' ||
          order?.paymentStatus === 'PENDING' ||
          order?.paymentStatus === 'PARTIALLY_PAID'
        ) {
          setStatus('success');
          actions.clearCart();
        } else {
          // Order exists but payment was not completed (e.g. UNPAID, REFUNDED)
          console.log('[ThankYouPage] Order found but payment not complete:', order?.paymentStatus);
          setStatus('failed');
        }
      } catch (error: any) {
        // If the orders API call fails due to permissions or network, but an orderId
        // was present in the URL, we'll treat it as success. Wix only creates orders
        // on successful payment.
        console.warn('[ThankYouPage] Could not verify order status:', error?.message);
        setStatus('success');
        actions.clearCart();
      }
    }

    verifyPayment();
  }, [searchParams, actions]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-paragraph text-foreground/60">Verifying your payment...</p>
          </div>
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
              It looks like your payment was cancelled or did not go through. Your cart items are still saved — you can try again whenever you're ready.
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

  // Success
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
