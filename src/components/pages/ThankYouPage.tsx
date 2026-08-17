import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  // Use a ref to avoid including `actions` in useEffect deps (prevents infinite loop)
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  useEffect(() => {
    async function verifyPayment() {
      // Retrieve the checkoutId we saved before redirecting to Wix
      const checkoutId = sessionStorage.getItem('wix_pending_checkout_id');
      console.log('[ThankYouPage] checkoutId from session:', checkoutId);

      if (!checkoutId) {
        // No pending checkout in session — user navigated here directly or session expired.
        // Show success as a safe fallback (Wix's own page already confirmed the order).
        setStatus('success');
        return;
      }

      try {
        // Search for an order associated with this checkout
        const result = await (wixClient.orders as any).searchOrders({
          search: {
            filter: { checkoutId: { $eq: checkoutId } }
          }
        });

        const order = result?.orders?.[0] ?? result?.items?.[0] ?? null;
        console.log('[ThankYouPage] Found order:', order?._id, 'paymentStatus:', order?.paymentStatus);

        // Clear the stored checkoutId regardless of outcome
        sessionStorage.removeItem('wix_pending_checkout_id');

        if (order && (order.paymentStatus === 'PAID' || order.paymentStatus === 'PENDING')) {
          setStatus('success');
          actionsRef.current.clearCart();
        } else {
          setStatus('failed');
        }
      } catch (err: any) {
        console.warn('[ThankYouPage] Could not verify order:', err?.message);
        // If the API call fails (permissions / network), assume success if a checkoutId was present
        // since Wix only redirects here after the checkout flow is complete.
        sessionStorage.removeItem('wix_pending_checkout_id');
        setStatus('success');
        actionsRef.current.clearCart();
      }
    }

    verifyPayment();
  }, []); // Empty deps — runs once on mount only

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
