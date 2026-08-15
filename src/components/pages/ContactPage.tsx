import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { BaseCrudService } from '@/integrations';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Mail, MapPin, MessageCircle, Phone, Send, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import wixClient from '@/wixClient';

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+1', flag: '🇺🇸', name: 'USA/Canada' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+64', flag: '🇳🇿', name: 'New Zealand' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+82', flag: '🇰🇷', name: 'South Korea' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
];

export default function ContactPage() {
  const [countryCode, setCountryCode] = useState('+91');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const successMessageRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const inquiryTypeLabels: Record<string, string> = {
        'general': 'General Inquiry',
        'purchase': 'Purchase Inquiry',
        'rental': 'Rental Inquiry',
        'appointment': 'Book Appointment',
        'custom': 'Custom Design',
      };

      await wixClient.submissions.createSubmission({
        formId: 'bcef0512-f1c0-4642-bd62-9854e78efc40',
        submissions: {
          full_name: formData.name,
          email_address: formData.email,
          phone_number: formData.phone.trim().startsWith('+') 
            ? '+' + formData.phone.replace(/\D/g, '') 
            : countryCode + formData.phone.replace(/\D/g, ''),
          inquiry_type: inquiryTypeLabels[formData.inquiryType] ?? formData.inquiryType,
          message: formData.message
        }
      });
      setSubmitSuccess(true);

      // Scroll success message into view
      setTimeout(() => {
        successMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      // Reset form after 5 seconds to give user time to see the success message
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          inquiryType: 'general',
          message: ''
        });
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const handleDismissSuccess = useCallback(() => {
    setSubmitSuccess(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      inquiryType: 'general',
      message: ''
    });
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Persistent Success Banner */}
      {submitSuccess && (
        <motion.div
          ref={successMessageRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-0 right-0 z-50 flex justify-center px-4"
        >
          <div className="bg-green-50 border-2 border-green-400 text-green-800 px-6 py-4 rounded-xl shadow-2xl flex items-start gap-4 max-w-md w-full">
            <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5 text-green-600" />
            <div className="flex-1">
              <p className="font-heading text-lg font-semibold">Success!</p>
              <p className="text-sm font-paragraph mt-1">Your message has been sent successfully. We'll get back to you shortly.</p>
            </div>
            <button
              onClick={handleDismissSuccess}
              className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors"
              aria-label="Close success message"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
      {/* Page Header - Reduced height */}
      <section className="py-4 md:py-6 bg-emerald-green">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-1"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 font-paragraph"
          >
            We're here to help with all your jewellery needs
          </motion.p>
        </div>
      </section>
      {/* Contact Form & Info */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-12">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-10 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl text-foreground mb-1 md:mb-2">Send us a Message</h2>
            <p className="text-xs md:text-sm text-foreground/70 font-paragraph mb-3 md:mb-4">
              Fill out the form below and we'll get back to you as soon as possible
            </p>



            <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
              {/* Name and Email in two columns on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                <div>
                  <label htmlFor="name" className="block font-paragraph font-semibold text-foreground mb-0.5 text-xs md:text-sm">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border border-foreground/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-paragraph text-xs md:text-sm"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-paragraph font-semibold text-foreground mb-0.5 text-xs md:text-sm">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border border-foreground/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-paragraph text-xs md:text-sm"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Phone and Inquiry Type in two columns on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                <div>
                  <label htmlFor="phone" className="block font-paragraph font-semibold text-foreground mb-0.5 text-xs md:text-sm">
                    Phone Number *
                  </label>
                  <div className="flex rounded-lg border border-foreground/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden">
                    <select
                      id="countryCode"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-foreground/5 border-r border-foreground/20 px-1 md:px-2 py-1.5 md:py-2 font-paragraph text-xs md:text-sm focus:outline-none cursor-pointer flex-shrink-0"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="flex-1 min-w-0 px-2 md:px-3 py-1.5 md:py-2 font-paragraph text-xs md:text-sm focus:outline-none bg-transparent"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="inquiryType" className="block font-paragraph font-semibold text-foreground mb-0.5 text-xs md:text-sm">
                    Inquiry Type *
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    required
                    className="w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border border-foreground/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-paragraph text-xs md:text-sm"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="purchase">Purchase Inquiry</option>
                    <option value="rental">Rental Inquiry</option>
                    <option value="appointment">Book Appointment</option>
                    <option value="custom">Custom Design</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block font-paragraph font-semibold text-foreground mb-0.5 text-xs md:text-sm">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border border-foreground/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-paragraph text-xs md:text-sm resize-none"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider py-1.5 md:py-2 text-xs md:text-sm"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="w-3 h-3 mr-1.5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div>
              <h2 className="font-heading text-xl sm:text-2xl md:text-3xl text-foreground mb-2 md:mb-3">Contact Information</h2>
              <p className="text-xs md:text-sm text-foreground/70 font-paragraph mb-3 md:mb-4">
                Reach out through any of these channels
              </p>
            </div>

            <div className="space-y-2 md:space-y-3">
              <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 flex items-start gap-2 md:gap-3">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 md:w-5 h-4 md:h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-sm md:text-base text-foreground mb-0.5">Address</h3>
                  <p className="text-xs md:text-sm text-foreground/70 font-paragraph">
                    85, Vadakku Radha St, Near Sivan Kovil, Ezhil Nagar, Thoothukudi, Tamil Nadu 628002, India
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 flex items-start gap-2 md:gap-3">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 md:w-5 h-4 md:h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-sm md:text-base text-foreground mb-0.5">Phone</h3>
                  <a href="tel:09080242663" className="text-xs md:text-sm text-foreground/70 font-paragraph hover:text-primary transition-colors">9080242663</a>
                </div>
              </div>

              <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 flex items-start gap-2 md:gap-3">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 md:w-5 h-4 md:h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-sm md:text-base text-foreground mb-0.5">WhatsApp</h3>
                  <a
                    href="https://wa.me/919080242663"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-sm text-foreground/70 font-paragraph hover:text-primary transition-colors"
                  >
                    Chat with us
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 flex items-start gap-2 md:gap-3">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 md:w-5 h-4 md:h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-sm md:text-base text-foreground mb-0.5">Hours</h3>
                  <p className="text-xs md:text-sm text-foreground/70 font-paragraph">Mon - Sun: 9:00 AM - 10:00 PM</p>
                </div>
              </div>

              <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 flex items-start gap-2 md:gap-3">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 md:w-5 h-4 md:h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-sm md:text-base text-foreground mb-0.5">Email</h3>
                  <a href="mailto:shrisaibridaljewels@gmail.com" className="text-xs md:text-sm text-foreground/70 font-paragraph hover:text-primary transition-colors">
                    shrisaibridaljewels@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider text-xs md:text-sm">
                <a href="tel:09080242663">Call Now</a>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold uppercase tracking-wider text-xs md:text-sm">
                <a href="https://share.google/INzIrf7qPrc4tZmDl" target="_blank" rel="noopener noreferrer">Get Directions</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Map Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pb-8 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-lg md:rounded-xl overflow-hidden shadow-2xl"
          style={{ minHeight: '250px', maxHeight: '400px' }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.77784954275!2d78.14470907477784!3d8.806929591245822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b03ef003c1baa1d%3A0x1c8b38b086e7c02!2sShrisai%20bridal%20jewels!5e0!3m2!1sen!2sin!4v1785526138841!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '250px', maxHeight: '400px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Shri Sai Bridal Jewels Location"
          ></iframe>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
