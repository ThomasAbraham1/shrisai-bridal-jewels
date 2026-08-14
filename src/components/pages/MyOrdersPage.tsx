import { useEffect, useState } from 'react';
import { useMember, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Package, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import wixClient from '@/wixClient';

function MyOrdersContent() {
  const { currency } = useCurrency();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true);
        // searchOrders takes a CursorSearch object directly and returns a Promise
        const response = await wixClient.orders.searchOrders({});
        setOrders(response.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="flex items-center gap-4 mb-10">
          <Package className="w-8 h-8 text-primary" />
          <h1 className="font-heading text-4xl text-foreground">My Orders</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-16 shadow-lg text-center"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-primary" />
            </div>
            <h2 className="font-heading text-2xl text-foreground mb-4">No Orders Yet</h2>
            <p className="font-paragraph text-foreground/70">
              Looks like you haven't placed any orders with us yet.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-foreground/5 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-secondary/5 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-foreground/5">
                  <div className="flex flex-wrap gap-x-8 gap-y-2">
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-1">Order Placed</p>
                      <p className="font-paragraph text-sm font-semibold text-foreground">
                        {new Date(order._createdDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-1">Total</p>
                      <p className="font-paragraph text-sm font-semibold text-primary">
                        {order.priceSummary?.total?.amount ? 
                          formatPrice(Number(order.priceSummary.total.amount), currency ?? DEFAULT_CURRENCY) : 
                          'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-1">Order ID</p>
                      <p className="font-paragraph text-sm font-semibold text-foreground">
                        {order.number || order._id}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                      {order.status || 'Processing'}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">
                      {order.paymentStatus || 'Paid'}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.lineItems?.map((item: any) => (
                      <div key={item._id} className="flex gap-4">
                        <div className="w-20 h-20 bg-background rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.productName?.original || 'Product'}
                              width={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-secondary/5">
                              <Package className="w-8 h-8 text-secondary/20" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-paragraph font-semibold text-foreground text-sm sm:text-base">
                            {item.productName?.original || 'Custom Item'}
                          </h4>
                          <p className="font-paragraph text-sm text-foreground/60 mt-1">
                            Qty: {item.quantity}
                          </p>
                          <p className="font-paragraph text-sm font-bold text-primary mt-1">
                            {item.price?.amount ? formatPrice(Number(item.price.amount), currency ?? DEFAULT_CURRENCY) : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <MemberProtectedRoute messageToSignIn="Sign in to view your orders">
      <MyOrdersContent />
    </MemberProtectedRoute>
  );
}
