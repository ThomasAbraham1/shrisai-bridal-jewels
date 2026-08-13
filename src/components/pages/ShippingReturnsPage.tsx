import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Truck, RotateCcw, Package, AlertCircle } from 'lucide-react';

interface PolicySection {
  icon: React.ReactNode;
  title: string;
  content: string[];
}

const policySections: PolicySection[] = [
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Shipping Policy',
    content: [
      'We offer shipping across India for all jewellery purchases.',
      'Delivery typically takes 3–7 business days from the order date.',
      'Express delivery options are available for select locations.',
      'All shipments are insured and tracked for your security.',
      'Shipping charges are calculated based on your location.',
      'Orders are carefully packaged to ensure safe delivery.',
      'You will receive a tracking number via email after dispatch.',
    ],
  },
  {
    icon: <Package className="w-8 h-8" />,
    title: 'Rental Delivery & Pickup',
    content: [
      'Rental jewellery is delivered to your specified address on the agreed date.',
      'Delivery is available across major cities in India.',
      'Pickup is arranged on the return date as per your booking.',
      'All rental items are insured during transit.',
      'We ensure jewellery is delivered in perfect condition.',
      'Customers must be available during delivery and pickup windows.',
      'Alternative arrangements can be made for special circumstances.',
    ],
  },
  {
    icon: <AlertCircle className="w-8 h-8" />,
    title: 'Inspection & Damage',
    content: [
      'Inspect all products immediately upon delivery.',
      'Report any damage or defects within 24 hours of receipt.',
      'Photographs of damaged items help us process claims faster.',
      'Minor wear and tear on rental items is normal and covered.',
      'Significant damage may incur additional charges.',
      'We will assess damage claims fairly and transparently.',
      'Damaged items must be reported before using the jewellery.',
    ],
  },
  {
    icon: <RotateCcw className="w-8 h-8" />,
    title: 'Returns & Refunds',
    content: [
      'Purchased items can only be returned if damaged during transit.',
      'Return requests must be made within 7 days of delivery.',
      'Refunds are processed within 10–15 business days.',
      'Original packaging and invoice must be provided for returns.',
      'Rental jewellery must be returned on the agreed date.',
      'Late returns may incur additional charges.',
      'Customers are responsible for loss or major damage to rented items.',
    ],
  },
];

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 bg-emerald-green">
          <div className="max-w-[100rem] mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="font-heading text-5xl md:text-6xl text-white mb-4">
                Shipping & Returns
              </h1>
              <p className="font-paragraph text-lg text-secondary-foreground max-w-2xl mx-auto">
                Learn about our shipping policies, delivery terms, and return procedures for purchases and rentals.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Policy Sections */}
        <section className="w-full py-16 md:py-24">
          <div className="max-w-[100rem] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {policySections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-8 border border-primary/10 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-primary">{section.icon}</div>
                    <h2 className="font-heading text-2xl text-foreground">
                      {section.title}
                    </h2>
                  </div>

                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex gap-3">
                        <span className="text-primary font-bold flex-shrink-0 mt-1">•</span>
                        <span className="font-paragraph text-foreground leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 bg-light-gold/10 border border-primary/20 rounded-lg p-8"
            >
              <h3 className="font-heading text-2xl text-foreground mb-4">
                Important Information
              </h3>
              <div className="space-y-4 font-paragraph text-foreground">
                <p>
                  <strong>Purchased Items:</strong> All jewellery purchases are covered by our quality guarantee. If you receive damaged items, we will replace them at no additional cost.
                </p>
                <p>
                  <strong>Rental Items:</strong> Customers are responsible for the safekeeping of rented jewellery. Any loss or damage beyond normal wear and tear may result in additional charges based on the item's value.
                </p>
                <p>
                  <strong>Delivery Confirmation:</strong> Please ensure someone is available to receive the delivery. We will attempt redelivery if you're unavailable, but additional charges may apply.
                </p>
                <p>
                  <strong>Tracking:</strong> All shipments are tracked. You can monitor your order status through our website or by contacting our support team.
                </p>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 text-center"
            >
              <h3 className="font-heading text-2xl text-foreground mb-4">
                Questions about shipping or returns?
              </h3>
              <p className="font-paragraph text-foreground mb-6 max-w-2xl mx-auto">
                Our customer support team is ready to assist you with any inquiries about our shipping and return policies.
              </p>
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-primary text-white font-paragraph font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Get in Touch
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
