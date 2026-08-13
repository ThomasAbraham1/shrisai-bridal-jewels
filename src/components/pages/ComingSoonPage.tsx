import { MessageCircle } from 'lucide-react';
const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <h1 className="font-heading text-6xl md:text-7xl text-dark-background mb-6">
            Coming Soon
          </h1>
          
          <p className="font-paragraph text-lg text-foreground mb-12">
            We're working on something special. Stay connected with us!
          </p>
          
          <div className="flex gap-8 justify-center items-center">
            {/* WhatsApp */}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 hover:opacity-80 transition-opacity"
              aria-label="Contact us on WhatsApp"
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <span className="font-paragraph text-sm text-foreground">WhatsApp</span>
            </a>
            
            {/* Instagram */}
            <a
              href="https://www.instagram.com/shrisai_bridaljewels?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 hover:opacity-80 transition-opacity"
              aria-label="Follow us on Instagram"
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <Instagram className="w-8 h-8 text-primary-foreground" />
              </div>
              <span className="font-paragraph text-sm text-foreground">Instagram</span>
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
