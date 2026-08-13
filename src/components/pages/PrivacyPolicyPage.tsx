import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

interface PolicySection {
  title: string;
  content: string[];
}

const policySections: PolicySection[] = [
  {
    title: 'Information We Collect',
    content: [
      'We collect personal information when you make a purchase, book a rental, or contact us.',
      'This includes your name, email address, phone number, and delivery address.',
      'Payment information is collected securely through encrypted payment gateways.',
      'We may also collect information about your browsing behavior through cookies.',
      'This information helps us improve your shopping experience and provide better service.',
    ],
  },
  {
    title: 'How We Use Your Information',
    content: [
      'Personal details are used exclusively for order processing and delivery.',
      'We use your contact information to send order confirmations and updates.',
      'Your information helps us manage rental bookings and track deliveries.',
      'Email addresses may be used to send promotional offers (you can opt out anytime).',
      'We never share your personal information with third parties without consent.',
      'Your data is used to improve our website and customer service.',
    ],
  },
  {
    title: 'Payment Security',
    content: [
      'All payment information is processed through secure, encrypted channels.',
      'We use industry-standard SSL encryption to protect your financial data.',
      'Credit card and banking details are never stored on our servers.',
      'Payment processing is handled by trusted third-party payment gateways.',
      'We comply with PCI DSS (Payment Card Industry Data Security Standard).',
      'Your payment information is treated with the highest level of confidentiality.',
    ],
  },
  {
    title: 'Data Protection & Security',
    content: [
      'We implement robust security measures to protect your personal data.',
      'Access to customer information is restricted to authorized personnel only.',
      'We regularly update our security systems to prevent unauthorized access.',
      'Your data is stored securely and backed up regularly.',
      'We comply with applicable data protection laws and regulations.',
      'In case of a data breach, we will notify affected customers promptly.',
    ],
  },
  {
    title: 'Cookies & Tracking',
    content: [
      'Our website uses cookies to enhance your browsing experience.',
      'Cookies help us remember your preferences and improve website performance.',
      'We use analytics cookies to understand how visitors use our website.',
      'You can disable cookies through your browser settings if you prefer.',
      'Third-party services may also use cookies for advertising and analytics.',
      'Disabling cookies may affect some website functionality.',
    ],
  },
  {
    title: 'Third-Party Links',
    content: [
      'Our website may contain links to third-party websites.',
      'We are not responsible for the privacy practices of external websites.',
      'Please review the privacy policies of any third-party sites you visit.',
      'We recommend reading their privacy statements before sharing information.',
      'Links to social media platforms are provided for your convenience.',
    ],
  },
  {
    title: 'Your Rights',
    content: [
      'You have the right to access your personal information at any time.',
      'You can request corrections to any inaccurate data we hold.',
      'You can opt out of promotional emails by clicking the unsubscribe link.',
      'You have the right to request deletion of your personal data.',
      'We will respond to data requests within 30 days.',
      'Contact us if you have concerns about how your data is handled.',
    ],
  },
  {
    title: 'Policy Updates',
    content: [
      'We may update this privacy policy from time to time.',
      'Changes will be posted on this page with an updated date.',
      'Continued use of our website implies acceptance of the updated policy.',
      'We will notify you of significant changes via email if required.',
      'Please review this policy periodically for any updates.',
    ],
  },
];

export default function PrivacyPolicyPage() {
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
                Privacy Policy
              </h1>
              <p className="font-paragraph text-lg text-secondary-foreground max-w-2xl mx-auto">
                We are committed to protecting your privacy and ensuring transparency about how we collect and use your information.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Policy Content */}
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
                  This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website, make purchases, or book rental services. We are committed to maintaining your trust and protecting your privacy. Please read this policy carefully to understand our practices.
                </p>
              </motion.div>

              {/* Policy Sections */}
              <div className="space-y-8">
                {policySections.map((section, index) => (
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

              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-16 p-8 bg-secondary rounded-lg text-center"
              >
                <h3 className="font-heading text-2xl text-white mb-3">
                  Privacy-Related Questions?
                </h3>
                <p className="font-paragraph text-secondary-foreground mb-6">
                  If you have any questions or concerns about our privacy practices, please don't hesitate to contact us.
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
                transition={{ duration: 0.6, delay: 0.6 }}
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
