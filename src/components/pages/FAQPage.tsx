import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: 1,
    question: 'What products do you offer?',
    answer: 'We offer a wide range of imitation jewellery including necklaces, earrings, bracelets, rings, and traditional pieces. Our collection features both contemporary designs and classic styles suitable for everyday wear and special occasions. All our products are crafted with high-quality materials to ensure durability and elegance.',
  },
  {
    id: 2,
    question: 'Do you provide jewellery for rent?',
    answer: 'Yes, we offer premium jewellery rental services for special occasions such as weddings, festivals, and celebrations. Our rental collection includes exclusive pieces that are professionally maintained and insured. Rental terms are flexible, and we ensure the jewellery is in perfect condition when delivered.',
  },
  {
    id: 3,
    question: 'How do I book rental jewellery?',
    answer: 'Booking is simple! Browse our rental collection on the website, select your desired pieces, and proceed to checkout. You can choose your rental dates and delivery preferences. Our team will confirm your booking and arrange delivery to your location. You can also visit our showroom or call us for personalized assistance.',
  },
  {
    id: 4,
    question: 'Is a 50% advance payment required?',
    answer: 'Yes, we require a 50% advance payment to confirm your rental booking. This secures your reservation and ensures we keep your preferred pieces available. The remaining balance must be paid before delivery or collection. This policy helps us manage our inventory efficiently and provide better service.',
  },
  {
    id: 5,
    question: 'How many days can I keep the rental jewellery?',
    answer: 'Rental duration is flexible and can be customized based on your needs. Typical rental periods range from 1 to 7 days for events. For longer durations, please contact our team for special arrangements. The rental period starts from the delivery date and must be returned by the agreed date to avoid additional charges.',
  },
  {
    id: 6,
    question: 'What if the jewellery gets damaged?',
    answer: 'Minor wear and tear is normal and covered under our rental agreement. However, significant damage or loss may incur additional charges. We recommend inspecting the jewellery immediately upon receipt and reporting any pre-existing damage within 24 hours. Our team will assess any damage claims fairly and transparently.',
  },
  {
    id: 7,
    question: 'Do you offer home delivery?',
    answer: 'Yes, we offer home delivery across India for both purchases and rentals. Delivery is available in major cities with express options. Rental jewellery is delivered securely with proper packaging and insurance. Delivery charges vary based on location. Contact us for specific delivery details and timelines.',
  },
  {
    id: 8,
    question: 'Can I visit your showroom before booking?',
    answer: 'Absolutely! We welcome customers to visit our showroom to view our collection in person. You can try on pieces, discuss designs, and get expert advice from our team. Our showroom is open during business hours. We recommend calling ahead to ensure availability and to schedule personalized consultations.',
  },
  {
    id: 9,
    question: 'What payment methods do you accept?',
    answer: 'We accept multiple payment methods including credit cards, debit cards, net banking, digital wallets, and UPI transfers. For rental bookings, advance payment can be made through any of these methods. All transactions are secure and encrypted. We also offer cash payment at our showroom.',
  },
  {
    id: 10,
    question: 'How can I contact customer support?',
    answer: 'You can reach our customer support team through multiple channels: call us during business hours, email your queries, or visit our showroom in person. We also offer WhatsApp support for quick assistance. Our team is dedicated to resolving your concerns promptly and professionally.',
  },
];

export default function FAQPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
                Frequently Asked Questions
              </h1>
              <p className="font-paragraph text-lg text-secondary-foreground max-w-2xl mx-auto">
                Find answers to common questions about our jewellery products, rental services, and policies.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="w-full py-16 md:py-24">
          <div className="max-w-[100rem] mx-auto px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="border border-primary/20 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-background transition-colors"
                    >
                      <h3 className="font-heading text-lg text-foreground text-left">
                        {item.question}
                      </h3>
                      <ChevronDown
                        size={24}
                        className={`text-primary flex-shrink-0 ml-4 transition-transform duration-300 ${
                          expandedId === item.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {expandedId === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-primary/20 px-6 py-4 bg-background"
                      >
                        <p className="font-paragraph text-foreground leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Contact CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-16 p-8 bg-secondary rounded-lg text-center"
              >
                <h2 className="font-heading text-2xl text-white mb-3">
                  Didn't find your answer?
                </h2>
                <p className="font-paragraph text-secondary-foreground mb-6">
                  Our customer support team is here to help. Contact us anytime.
                </p>
                <a
                  href="/contact"
                  className="inline-block px-8 py-3 bg-primary text-white font-paragraph font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Contact Us
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
