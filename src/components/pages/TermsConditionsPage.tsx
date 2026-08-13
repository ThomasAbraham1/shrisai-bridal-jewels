import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

interface TermsSection {
  title: string;
  content: string[];
}

const termsSections: TermsSection[] = [
  {
    title: 'Acceptance of Terms',
    content: [
      'By accessing and using our website, you agree to be bound by these Terms and Conditions.',
      'If you do not agree with any part of these terms, please do not use our website.',
      'We reserve the right to modify these terms at any time without prior notice.',
      'Continued use of the website after changes constitutes acceptance of the new terms.',
      'It is your responsibility to review these terms periodically.',
    ],
  },
  {
    title: 'Product Information',
    content: [
      'All product descriptions and images on our website are for informational purposes.',
      'We strive to provide accurate product information, but errors may occur.',
      'Actual product colors may vary slightly due to screen display differences.',
      'We reserve the right to correct any pricing or product information errors.',
      'Product availability is subject to change without prior notice.',
    ],
  },
  {
    title: 'Pricing & Payment',
    content: [
      'All prices are displayed in Indian Rupees (INR) and are subject to change.',
      'Prices may vary based on location, taxes, and applicable charges.',
      'Payment must be completed before delivery or collection of items.',
      'We accept multiple payment methods as specified on our website.',
      'All transactions are secure and encrypted for your protection.',
    ],
  },
  {
    title: 'Rental Booking Terms',
    content: [
      'Customers must provide accurate booking information for rental services.',
      'A 50% advance payment is required to confirm rental bookings.',
      'The remaining balance must be paid before delivery or collection.',
      'Rental bookings are subject to availability and confirmation.',
      'Cancellations must be made at least 7 days before the rental date.',
      'Cancellation charges may apply based on the cancellation timeline.',
    ],
  },
  {
    title: 'Rental Jewellery Responsibility',
    content: [
      'Customers are responsible for the safekeeping of rented jewellery.',
      'Rented items must be returned in their original condition on the agreed date.',
      'Rental jewellery must be returned in the same packaging provided.',
      'Customers are liable for loss or major damage to rented items.',
      'Damaged or lost jewellery may incur additional charges based on valuation.',
      'Minor wear and tear is normal and covered under the rental agreement.',
    ],
  },
  {
    title: 'Cancellation & Refunds',
    content: [
      'Orders may be cancelled in exceptional circumstances only.',
      'Cancellation requests must be made within 24 hours of order placement.',
      'Refunds are processed within 10–15 business days after cancellation approval.',
      'Refunds will be credited to the original payment method.',
      'Rental bookings cancelled within 7 days of the rental date are non-refundable.',
      'Partial refunds may be applicable based on the cancellation reason.',
    ],
  },
  {
    title: 'Limitation of Liability',
    content: [
      'We are not liable for indirect, incidental, or consequential damages.',
      'Our liability is limited to the amount paid for the product or service.',
      'We are not responsible for delays caused by circumstances beyond our control.',
      'We are not liable for third-party services or external links on our website.',
      'Use of our website is at your own risk.',
    ],
  },
  {
    title: 'Intellectual Property',
    content: [
      'All content on our website, including images and text, is our intellectual property.',
      'You may not reproduce, distribute, or transmit any content without permission.',
      'Unauthorized use of our intellectual property may result in legal action.',
      'You retain ownership of any content you submit to us.',
      'By submitting content, you grant us the right to use it for business purposes.',
    ],
  },
  {
    title: 'User Conduct',
    content: [
      'You agree not to use our website for any illegal or unauthorized purpose.',
      'You must not engage in harassment, abuse, or threatening behavior.',
      'You must not attempt to hack, disrupt, or damage our website.',
      'You must not spam or send unsolicited communications.',
      'Violation of these terms may result in account suspension or legal action.',
    ],
  },
  {
    title: 'Dispute Resolution',
    content: [
      'All disputes arising from these terms are subject to the jurisdiction of Thoothukudi, Tamil Nadu.',
      'Both parties agree to attempt resolution through negotiation first.',
      'If negotiation fails, disputes will be resolved through arbitration or legal proceedings.',
      'The laws of India will govern these terms and conditions.',
      'You agree to submit to the exclusive jurisdiction of courts in Thoothukudi.',
    ],
  },
];

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 bg-emerald-green">
          <div className="max-w-[100rem] mx-auto px-4 md:px-8 bg-emerald-green">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="font-heading text-5xl md:text-6xl text-white mb-4">
                Terms & Conditions
              </h1>
              <p className="font-paragraph text-lg text-secondary-foreground max-w-2xl mx-auto">
                Please read these terms carefully before using our website or making any purchases or bookings.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="w-full py-16 md:py-24">
          <div className="max-w-[100rem] mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12 p-8 bg-light-gold/10 rounded-lg border border-primary/20"
              >
                <p className="font-paragraph text-foreground leading-relaxed">
                  These Terms and Conditions govern your use of our website and your purchase or rental of jewellery products. By accessing our website or making a purchase, you agree to comply with these terms. Please read them carefully and contact us if you have any questions.
                </p>
              </motion.div>

              {/* Terms Sections */}
              <div className="space-y-8">
                {termsSections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                  >
                    <h2 className="font-heading text-2xl text-foreground mb-4">
                      {section.title}
                    </h2>
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

              {/* Jurisdiction Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-16 p-8 rounded-lg bg-emerald-green"
              >
                <h3 className="font-heading text-2xl text-white mb-4">
                  Jurisdiction & Governing Law
                </h3>
                <p className="font-paragraph text-secondary-foreground leading-relaxed">
                  These Terms and Conditions are governed by the laws of India. All disputes, claims, or controversies arising from or relating to these terms, your use of our website, or any purchase or rental transaction shall be subject to the exclusive jurisdiction of the courts located in Thoothukudi, Tamil Nadu. You agree to submit to the jurisdiction of these courts and waive any objections based on inconvenient forum.
                </p>
              </motion.div>

              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-12 text-center"
              >
                <h3 className="font-heading text-2xl text-foreground mb-4">
                  Questions About Our Terms?
                </h3>
                <p className="font-paragraph text-foreground mb-6 max-w-2xl mx-auto">
                  If you have any questions or concerns about these terms and conditions, please contact our support team.
                </p>
                <a
                  href="/contact"
                  className="inline-block px-8 py-3 bg-primary text-white font-paragraph font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Contact Us
                </a>
              </motion.div>

              {/* Last Updated */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-8 text-center font-paragraph text-sm text-foreground/60"
              >
                Last Updated: July 2026
              </motion.p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
