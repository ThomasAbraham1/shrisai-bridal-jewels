import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/integrations';

export default function ThankYouPage() {
  const navigate = useNavigate();
  const { actions } = useCart();

  useEffect(() => {
    // Wix only calls postFlowUrl (this page) on a SUCCESSFUL payment.
    // Failed / cancelled payments go to cartUrl (/cart) instead.
    // So we can safely always treat landing here as a success.
    actions.clearCart();
  }, [actions]);

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
