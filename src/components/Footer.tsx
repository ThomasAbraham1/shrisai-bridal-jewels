import { ArrowUp, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Facebook and Youtube were removed from lucide-react v3+
const Facebook = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
  </svg>
);
const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export default function Footer() {
  const scrollToTop = () => {
    // Direct scroll to top - works on all devices including mobile
    // Use auto behavior for immediate effect, then smooth scroll
    window.scrollTo(0, 0);

    // Also set on document elements as fallback
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Smooth scroll after initial jump (for better UX)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 10);
  };

  return (
    <footer className="text-white bg-emerald-green">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 2xl:px-16 py-12 md:py-16 2xl:py-20 bg-secondary">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 2xl:gap-16 mb-8 md:mb-12 2xl:mb-16">
          {/* Brand Column */}
          <div>
            <div className="mb-4 md:mb-6 2xl:mb-8">
              <h3 className="font-heading text-2xl md:text-3xl 2xl:text-4xl leading-none mb-1 text-light-gold">Shri Sai</h3>
              <p className="font-paragraph text-[9px] md:text-xs 2xl:text-sm text-light-gold uppercase tracking-widest">Bridal Jewels</p>
            </div>
            <p className="text-white/80 font-paragraph text-xs md:text-sm 2xl:text-base mb-4 md:mb-6 2xl:mb-8 leading-relaxed">
              Premium imitation bridal jewellery and rental services for your special moments. Experience elegance, tradition, and affordability.
            </p>
            <div className="flex gap-3 md:gap-4 2xl:gap-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 md:w-10 2xl:w-12 h-9 md:h-10 2xl:h-12 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-4 md:w-5 2xl:w-6 h-4 md:h-5 2xl:h-6" />
              </a>
              <a
                href="https://www.instagram.com/shrisai_bridal_jewels?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 md:w-10 2xl:w-12 h-9 md:h-10 2xl:h-12 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-4 md:w-5 2xl:w-6 h-4 md:h-5 2xl:h-6" />
              </a>
              <a
                href="https://wa.me/919080242663"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 md:w-10 2xl:w-12 h-9 md:h-10 2xl:h-12 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-all hover:scale-110"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 md:w-5 2xl:w-6 h-4 md:h-5 2xl:h-6" />
              </a>
              <a
                href="https://www.youtube.com/@Shrisai_bridaljewels"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 md:w-10 2xl:w-12 h-9 md:h-10 2xl:h-12 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-all hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="w-4 md:w-5 2xl:w-6 h-4 md:h-5 2xl:h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg md:text-xl 2xl:text-2xl text-primary mb-4 md:mb-6 2xl:mb-8">Quick Links</h4>
            <ul className="space-y-2 md:space-y-3 2xl:space-y-4">
              <li>
                <Link to="/" className="text-white/80 hover:text-primary transition-colors font-paragraph text-xs md:text-sm 2xl:text-base">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-white/80 hover:text-primary transition-colors font-paragraph text-xs md:text-sm 2xl:text-base">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-primary transition-colors font-paragraph text-xs md:text-sm 2xl:text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-primary transition-colors font-paragraph text-xs md:text-sm 2xl:text-base">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/rental" className="text-white/80 hover:text-primary transition-colors font-paragraph text-xs md:text-sm 2xl:text-base">
                  Rental Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-heading text-lg md:text-xl 2xl:text-2xl text-primary mb-4 md:mb-6 2xl:mb-8">Shop by Category</h4>
            <ul className="space-y-2 md:space-y-3 2xl:space-y-4">
              <li>
                <Link to="/shop?category=neckpiece" className="text-white/80 hover:text-primary transition-colors font-paragraph text-xs md:text-sm 2xl:text-base">
                  Neckpiece
                </Link>
              </li>
              <li>
                <Link to="/shop?category=earrings" className="text-white/80 hover:text-primary transition-colors font-paragraph text-xs md:text-sm 2xl:text-base">
                  Earrings
                </Link>
              </li>
              <li>
                <Link to="/shop?category=bangles" className="text-white/80 hover:text-primary transition-colors font-paragraph text-xs md:text-sm 2xl:text-base">
                  Bangles
                </Link>
              </li>
              <li>
                <Link to="/shop?category=maatal" className="text-white/80 hover:text-primary transition-colors font-paragraph text-xs md:text-sm 2xl:text-base">
                  Maatal
                </Link>
              </li>
              <li>
                <Link to="/shop?category=haaram" className="text-white/80 hover:text-primary transition-colors font-paragraph text-xs md:text-sm 2xl:text-base">
                  Haaram
                </Link>
              </li>
              <li>
                <Link to="/shop?category=chutti" className="text-white/80 hover:text-primary transition-colors font-paragraph text-xs md:text-sm 2xl:text-base">
                  Chutti
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="font-heading text-lg md:text-xl 2xl:text-2xl text-primary mb-4 md:mb-6 2xl:mb-8">Support</h4>
            <ul className="space-y-2 md:space-y-3 2xl:space-y-4 mb-4 md:mb-6 2xl:mb-8">
              <li>
                <Link to="/faq" className="text-white/80 hover:text-primary transition-colors font-paragraph text-xs md:text-sm 2xl:text-base">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="text-white/80 hover:text-primary transition-colors font-paragraph text-xs md:text-sm 2xl:text-base">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-white/80 hover:text-primary transition-colors font-paragraph text-xs md:text-sm 2xl:text-base">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-white/80 hover:text-primary transition-colors font-paragraph text-xs md:text-sm 2xl:text-base">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
            <div className="space-y-1 md:space-y-2 2xl:space-y-3">
              <p className="text-white/80 font-paragraph text-xs md:text-sm 2xl:text-base">
                <span className="text-primary">Phone:</span>{' '}
                <a href="tel:09080242663" className="hover:text-primary transition-colors">90802 42663</a>
              </p>
              <p className="text-white/80 font-paragraph text-xs md:text-sm 2xl:text-base">
                <span className="text-primary">Location:</span> 85, Vadakku Radha St, Near Sivan Kovil , Ezhil Nagar, Thoothukudi, Tamil Nadu 628002
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 md:pt-8 2xl:pt-12 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 2xl:gap-6">
          <div className="text-center md:text-left">
            <p className="text-white/60 font-paragraph text-xs md:text-sm 2xl:text-base">
              © {new Date().getFullYear()} Shri Sai Bridal Jewels. All rights reserved.
            </p>
            <p className="font-paragraph" style={{ fontSize: 'clamp(8px, 8.5px, 9px)', marginTop: '4px' }}>
              <span style={{ color: 'rgba(217,229,223,0.7)' }}>Designed & Developed by </span>
              <a
                href="https://www.pixelog.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#D4AF37' }}
                className="hover:opacity-80 transition-opacity"
              >
                PIXELOG DIGITAL & IT SOLUTIONS
              </a>
            </p>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-primary hover:text-light-gold active:text-light-gold transition-colors font-paragraph text-xs md:text-sm 2xl:text-base uppercase tracking-wider group py-2 px-3 rounded-md hover:bg-white/5 active:bg-white/10 cursor-pointer touch-manipulation"
            aria-label="Back to top"
            type="button"
          >
            Back to Top
            <ArrowUp className="w-3 md:w-4 2xl:w-5 h-3 md:h-4 2xl:h-5 group-hover:-translate-y-1 group-active:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
