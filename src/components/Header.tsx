import Cart from '@/components/Cart';
import SearchOverlay from '@/components/SearchOverlay';
import { Image } from '@/components/ui/image';
import { useCart, useMember } from '@/integrations';
import { throttle } from '@/lib/performance';
import { LogOut, Menu, Search, ShoppingCart, User, X, Package } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { itemCount, actions } = useCart();
  const { member, isAuthenticated, isLoading, actions: memberActions } = useMember();

  const handleScroll = useCallback(
    throttle(() => {
      setIsScrolled(window.scrollY > 50);
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const announcements = useMemo(() => [
    'NEW BRIDAL COLLECTION 2026',
    'Premium Imitation Jewellery',
    '50% Advance for Rentals',
    'Whatsapp Us'
  ], []);

  // Preload critical header logo
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = '/media/b9ec8c_805f029d74134362b24c2fa79b957c41_mv2.png';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }, []);

  const navLinks = useMemo(() => [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: "Rentals", path: '/rental' },
    { name: "new arrivals", path: '/collections' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ], []);

  return (
    <>
      <header className="relative z-50 pointer-events-auto">
        {/* Announcement Bar */}
        <div className="py-2 md:py-3 overflow-hidden pointer-events-auto bg-primary-foreground">
          <div className="flex animate-marquee-slow whitespace-nowrap">
            {[...announcements, ...announcements, ...announcements].map((announcement, index) => (
              <span key={index} className="inline-flex items-center mx-4 md:mx-8 font-paragraph text-[10px] md:text-sm uppercase tracking-wider text-primary">
                {announcement}
                <span className="mx-4 md:mx-8 text-light-gold">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Main Navigation */}
        <nav
          className={`transition-all duration-300 bg-primary pointer-events-auto`}
        >
          <div className="w-full max-w-[1600px] mx-auto">
            <div className="flex items-center justify-between h-[72px] md:h-[80px] lg:h-[80px] 2xl:h-[90px] px-0 lg:px-12 2xl:px-16 gap-0 lg:gap-6 2xl:gap-6 bg-secondary">
              {/* Desktop: Left Logo */}
              <Link to="/" className="hidden lg:flex items-center flex-shrink-0 min-w-0 bg-transparent overflow-visible">
                <Image
                  src="/media/b9ec8c_552fc58a4aae4f2bb532e58a2f28afb4_mv2.png"
                  width={60}
                  height={60}
                  className="h-[65px] 2xl:h-[75px] w-auto object-contain"
                  originWidth={1536}
                  originHeight={1024}
                  loading="eager"
                  decoding="async"
                  style={{ background: 'transparent' }} />
              </Link>

              {/* Desktop Navigation - Centered */}
              <div className="hidden lg:flex items-center justify-center flex-1 gap-6 2xl:gap-8 mx-8 2xl:mx-12">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="font-paragraph hover:text-light-gold transition-colors uppercase text-[11px] 2xl:text-xs tracking-wider whitespace-nowrap font-bold text-primary-foreground"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Desktop: Right Icons */}
              <div className="hidden lg:flex items-center gap-6 2xl:gap-8">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1 hover:text-light-gold transition-colors text-primary-foreground"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 2xl:w-6 2xl:h-6 fill-[transparent]" strokeWidth={2.5} />
                </button>
                {isLoading ? (
                  <div className="w-5 h-5 2xl:w-6 2xl:h-6" />
                ) : isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="p-1 hover:text-light-gold transition-colors text-primary-foreground"
                      aria-label="Profile"
                    >
                      <User className="w-5 h-5 2xl:w-6 2xl:h-6" strokeWidth={2.5} />
                    </Link>
                    <Link
                      to="/my-orders"
                      className="p-1 hover:text-light-gold transition-colors text-primary-foreground"
                      aria-label="My Orders"
                    >
                      <Package className="w-5 h-5 2xl:w-6 2xl:h-6" strokeWidth={2.5} />
                    </Link>
                    <button
                      onClick={memberActions.logout}
                      className="p-1 hover:text-light-gold transition-colors text-primary-foreground"
                      aria-label="Sign out"
                    >
                      <LogOut className="w-5 h-5 2xl:w-6 2xl:h-6" strokeWidth={2.5} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={memberActions.login}
                    className="p-1 hover:text-light-gold transition-colors text-primary-foreground"
                    aria-label="Sign in"
                  >
                    <User className="w-5 h-5 2xl:w-6 2xl:h-6 fill-[transparent]" strokeWidth={2.5} />
                  </button>
                )}
                <button
                  onClick={actions.toggleCart}
                  className="relative p-1 hover:text-light-gold transition-colors text-primary-foreground"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart className="w-5 h-5 2xl:w-6 2xl:h-6 fill-[transparent] mix-blend-normal" strokeWidth={2.5} />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-light-gold text-secondary text-[9px] 2xl:text-xs font-bold rounded-full w-4 h-4 2xl:w-5 2xl:h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Tablet & Mobile: Three-Zone Layout */}
              <div className="lg:hidden flex items-center justify-between w-full h-full">
                {/* Left Zone: Hamburger Menu */}
                <div className="flex items-center justify-start w-20 pl-5">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-1 hover:text-light-gold transition-colors text-primary-foreground"
                    aria-label="Toggle menu"
                  >
                    {isMobileMenuOpen ? <X className="w-7 h-7" strokeWidth={2.5} /> : <Menu className="w-7 h-7" strokeWidth={2.5} />}
                  </button>
                </div>

                {/* Center Zone: Logo (Perfectly Centered) */}
                <Link to="/" className="flex items-center justify-center flex-1 bg-transparent overflow-visible">
                  <Image
                    src="/media/b9ec8c_552fc58a4aae4f2bb532e58a2f28afb4_mv2.png"
                    width={60}
                    height={60}
                    className="h-[40px] md:h-[48px] w-auto object-contain"
                    originWidth={1536}
                    originHeight={1024}
                    loading="eager"
                    decoding="async"
                    style={{ background: 'transparent' }} />
                </Link>

                {/* Right Zone: Action Icons */}
                <div className="flex items-center justify-end w-20 pr-5 gap-4">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-1 hover:text-light-gold transition-colors text-primary-foreground"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" strokeWidth={2.5} />
                  </button>
                  {isLoading ? (
                    <div className="w-5 h-5" />
                  ) : isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        className="p-1 hover:text-light-gold transition-colors text-primary-foreground"
                        aria-label="Profile"
                      >
                        <User className="w-5 h-5" strokeWidth={2.5} />
                      </Link>
                      <Link
                        to="/my-orders"
                        className="p-1 hover:text-light-gold transition-colors text-primary-foreground"
                        aria-label="My Orders"
                      >
                        <Package className="w-5 h-5" strokeWidth={2.5} />
                      </Link>
                      <button
                        onClick={memberActions.logout}
                        className="p-1 hover:text-light-gold transition-colors text-primary-foreground"
                        aria-label="Sign out"
                      >
                        <LogOut className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={memberActions.login}
                      className="p-1 hover:text-light-gold transition-colors text-primary-foreground"
                      aria-label="Sign in"
                    >
                      <User className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                  )}
                  <button
                    onClick={actions.toggleCart}
                    className="relative p-1 hover:text-light-gold transition-colors text-primary-foreground"
                    aria-label="Shopping cart"
                  >
                    <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-light-gold text-secondary text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden py-4 px-6 bg-white border-t border-primary/10">
                <div className="flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-paragraph text-secondary hover:text-primary transition-colors uppercase text-xs tracking-wider py-2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      {/* Cart Component */}
      <Cart />
      {/* Spacer for fixed header - accounts for announcement bar + nav */}
      <style>{`
        @keyframes marquee-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-slow {
          animation: marquee-slow 25s linear infinite;
        }
      `}</style>
    </>
  );
}
