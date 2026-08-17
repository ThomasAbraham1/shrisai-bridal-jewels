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
  // Ref to avoid stale closure / infinite loop with actions in useEffect deps
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  useEffect(() => {
    async function verifyPayment() {
      const checkoutId = sessionStorage.getItem('wix_pending_checkout_id');
      console.log('[ThankYouPage] checkoutId from session:', checkoutId);

      // No checkoutId means user navigated here directly — show failed to be safe
      if (!checkoutId) {
        console.log('[ThankYouPage] No checkoutId in session → failed/abandoned');
        setStatus('failed');
        return;
      }

      // Always clear the stored checkoutId once we start verifying
      sessionStorage.removeItem('wix_pending_checkout_id');

      try {
        // Use getCheckout — if payment was completed, the checkout will have an orderId.
        // If the user abandoned before paying, orderId will be null/undefined.
        const checkoutData = await wixClient.checkout.getCheckout(checkoutId);
        const orderId = (checkoutData as any)?.orderId ?? null;
        console.log('[ThankYouPage] checkout orderId:', orderId);

        if (orderId) {
          // An order was created → payment went through
          setStatus('success');
          actionsRef.current.clearCart();
        } else {
          // No order created → user abandoned the checkout before paying
          setStatus('failed');
        }
      } catch (err: any) {
        console.warn('[ThankYouPage] getCheckout failed:', err?.message);
        // If we can't verify, default to FAILED (safer than faking success)
        setStatus('failed');
      }
    }

    verifyPayment();
  }, []); // runs once on mount

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
              It looks like your payment was not completed. Your cart items are still saved — you can try again whenever you're ready.
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
