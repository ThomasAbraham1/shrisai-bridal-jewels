import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-24 text-center mt-[120px] md:mt-[140px] lg:mt-[150px]">
        <h1 className="font-heading text-4xl text-secondary mb-4">Wishlist</h1>
        <p className="font-paragraph text-secondary/60">Coming soon</p>
      </div>
      <Footer />
    </div>
  );
}
