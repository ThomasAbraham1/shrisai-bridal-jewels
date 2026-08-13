import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { motion } from 'framer-motion';
import { Award, Heart, Shield, Star, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'We source and craft only the finest premium imitation jewellery with meticulous attention to detail'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction and special moments are at the heart of everything we do'
    },
    {
      icon: Shield,
      title: 'Trust & Integrity',
      description: 'Built on years of trust, transparency, and honest business practices'
    },
    {
      icon: Star,
      title: 'Excellence',
      description: 'Committed to delivering exceptional products and services that exceed expectations'
    }
  ];

  const achievements = [
    { number: "500+", label: "Happy Brides", icon: Users },
    { number: "2+", label: 'Years Experience', icon: TrendingUp },
    { number: '100%', label: 'Premium Imitation', icon: Award },
    { number: '500+', label: 'Unique Designs', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Page Header */}
      <section className="py-20 bg-emerald-green">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-6xl text-white mb-4"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 font-paragraph"
          >
            Crafting memories with timeless elegance
          </motion.p>
        </div>
      </section>
      {/* Our Story */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-5xl text-foreground mb-6">Our Story</h2>
            <div className="space-y-4 text-foreground/80 font-paragraph text-lg leading-relaxed">
              <p>For over 2 years, Shri Sai Bridal Jewels has been the trusted name for brides seeking exquisite premium imitation bridal jewellery for their most precious moments. What began as a small family business has blossomed into one of Thoothukudi's premier destinations for bridal jewellery and rental services.</p>
              <p>
                Our journey is rooted in a deep appreciation for traditional craftsmanship combined with
                contemporary design sensibilities. Every piece in our collection tells a story of heritage,
                artistry, and the timeless beauty of Indian bridal traditions. We specialize in premium imitation jewellery
                that offers elegance and affordability without compromise.
              </p>
              <p>
                We understand that your wedding day is one of the most important days of your life. That's
                why we're committed to providing not just jewellery, but an experience that makes you feel
                special, valued, and absolutely radiant. Whether you choose to purchase or rent, we ensure every bride
                finds the perfect pieces to complement her special day.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/media/978e03_a6f3b63ea168401daed26f7466613669_mv2.png"
                width={600}
                className="w-full h-full object-cover rounded-none mix-blend-normal shadow-[12px_12px_4px_0px_#d9d9d9] border-[#faf8f3ff] border border-none"
                originWidth={941}
                originHeight={1255} />
            </div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 border-4 border-primary rounded-full opacity-20"></div>
            <div className="absolute -top-8 -right-8 w-24 h-24 border-4 border-light-gold rounded-full opacity-20"></div>
          </motion.div>
        </div>
      </section>
      {/* Achievements */}
      <section className="py-20 bg-emerald-green">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <achievement.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="font-heading text-5xl text-white mb-2">{achievement.number}</div>
                <div className="text-white/80 font-paragraph">{achievement.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Our Values */}
      <section className="max-w-[1440px] mx-auto px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-5xl text-foreground mb-4">Our Values</h2>
          <p className="text-lg text-foreground/70 font-paragraph">The principles that guide everything we do</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-2xl text-foreground mb-3">{value.title}</h3>
              <p className="text-foreground/70 font-paragraph">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Why Choose Us */}
      <section className="bg-background py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-5xl text-foreground mb-4">Why Choose Us</h2>
            <p className="text-lg text-foreground/70 font-paragraph">What makes us different</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Authentic Designs',
                description: 'Traditional temple jewellery and contemporary bridal designs crafted with authenticity'
              },
              {
                title: 'Flexible Options',
                description: 'Both purchase and rental options to suit every budget and preference'
              },
              {
                title: 'Expert Guidance',
                description: 'Personalized consultation to help you choose the perfect pieces'
              },
              {
                title: 'Premium Imitation Quality',
                description: 'Premium imitation jewellery with guaranteed quality and fine craftsmanship'
              },
              {
                title: 'Affordable Luxury',
                description: 'Premium jewellery at competitive prices with transparent pricing'
              },
              {
                title: 'Customer Service',
                description: 'Dedicated support team available to assist you at every step'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-heading text-xl">{index + 1}</span>
                </div>
                <h3 className="font-heading text-2xl text-foreground mb-3">{item.title}</h3>
                <p className="text-foreground/70 font-paragraph">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="max-w-[1440px] mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-5xl text-white mb-6">Ready to Find Your Perfect Jewellery?</h2>
            <p className="text-xl text-white/90 font-paragraph mb-8 max-w-2xl mx-auto">
              Visit our store or browse our collection online. We're here to make your special day unforgettable.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-bold uppercase tracking-wider">
                <Link to="/shop">Shop Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-yellow hover:bg-white hover:text-primary font-bold uppercase tracking-wider">
                <Link to="/contact" className="text-primary bg-secondary">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
