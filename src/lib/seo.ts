/**
 * SEO Configuration and Utilities
 * Centralized SEO metadata for all pages
 */

export const SEOConfig = null as unknown as SEOConfig;
export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: Record<string, any>;
}

export const BUSINESS_INFO = {
  name: 'Shri Sai Bridal Jewels',
  description: 'Premium bridal and imitation jewellery brand offering jewellery for rent and sale',
  url: 'https://shrisaibridal.com',
  logo: 'https://static.wixstatic.com/media/b9ec8c_logo.png',
  phone: '+91-XXXXXXXXXX',
  email: 'shrisaibridaljewels@gmail.com',
  address: 'Showroom Address',
  city: 'India',
  country: 'India',
  socialProfiles: {
    instagram: 'https://instagram.com/shrisaibridal',
    facebook: 'https://facebook.com/shrisaibridal',
    whatsapp: 'https://wa.me/91XXXXXXXXXX'
  }
};

export const PRIMARY_KEYWORDS = [
  'bridal jewellery',
  'imitation jewellery',
  'bridal jewellery for rent',
  'bridal jewellery for sale',
  'premium bridal jewellery',
  'temple jewellery',
  'wedding jewellery',
  'bridal accessories',
  'artificial jewellery',
  'bridal necklace',
  'bridal haram',
  'bridal choker',
  'bridal earrings',
  'bridal bangles',
  'bridal waist belt',
  'vanki',
  'maang tikka',
  'bridal jewellery collections',
  'online jewellery store',
  'luxury bridal jewellery'
];

export const SEO_PAGES: Record<string, SEOConfig> = {
  home: {
    title: 'Shri Sai Bridal Jewels | Premium Bridal & Imitation Jewellery for Rent & Sale',
    description: 'Discover premium bridal and imitation jewellery at Shri Sai Bridal Jewels. Shop exquisite bridal collections, temple jewellery, and rental options with worldwide delivery.',
    keywords: 'bridal jewellery, imitation jewellery, bridal jewellery for rent, bridal jewellery for sale, premium bridal jewellery, wedding jewellery, temple jewellery',
    ogTitle: 'Shri Sai Bridal Jewels | Premium Bridal & Imitation Jewellery',
    ogDescription: 'Discover premium bridal and imitation jewellery. Shop bridal collections, temple jewellery, and rental options with worldwide delivery.',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Shri Sai Bridal Jewels | Premium Bridal Jewellery',
    twitterDescription: 'Premium bridal and imitation jewellery for rent and sale with worldwide delivery.'
  },
  shop: {
    title: 'Shop Bridal Jewellery | Premium Imitation Jewellery Collections | Shri Sai Bridal Jewels',
    description: 'Browse our extensive collection of premium bridal jewellery, imitation jewellery, and bridal accessories. Find the perfect pieces for your special day with worldwide shipping.',
    keywords: 'buy bridal jewellery online, imitation jewellery shop, bridal necklace, bridal earrings, bridal bangles, bridal accessories, online jewellery store',
    ogTitle: 'Shop Bridal Jewellery | Shri Sai Bridal Jewels',
    ogDescription: 'Browse premium bridal and imitation jewellery collections. Find bridal necklaces, earrings, bangles, and accessories online.',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Shop Bridal Jewellery Online',
    twitterDescription: 'Premium bridal and imitation jewellery collections available online.'
  },
  rental: {
    title: 'Bridal Jewellery for Rent | Premium Rental Collections | Shri Sai Bridal Jewels',
    description: 'Rent premium bridal jewellery for your wedding and special occasions. Affordable luxury with 50% advance payment. Worldwide delivery available.',
    keywords: 'bridal jewellery for rent, rent bridal jewellery, wedding jewellery rental, bridal accessories rental, temple jewellery rental, affordable bridal jewellery',
    ogTitle: 'Bridal Jewellery for Rent | Shri Sai Bridal Jewels',
    ogDescription: 'Rent premium bridal jewellery for weddings and special occasions. Affordable luxury with worldwide delivery.',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Rent Bridal Jewellery',
    twitterDescription: 'Premium bridal jewellery rental for weddings and special occasions.'
  },
  collections: {
    title: 'New Bridal Jewellery Collections | Latest Arrivals | Shri Sai Bridal Jewels',
    description: 'Explore our latest bridal jewellery collections and new arrivals. Discover premium imitation jewellery designs crafted for modern brides.',
    keywords: 'new bridal jewellery, latest jewellery collections, bridal jewellery designs, new arrival jewellery, premium jewellery collections',
    ogTitle: 'New Bridal Jewellery Collections | Shri Sai Bridal Jewels',
    ogDescription: 'Explore our latest bridal jewellery collections and new arrivals.',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'New Bridal Jewellery Collections',
    twitterDescription: 'Latest bridal jewellery collections and new arrivals.'
  },
  about: {
    title: 'About Shri Sai Bridal Jewels | Premium Bridal Jewellery Brand',
    description: 'Learn about Shri Sai Bridal Jewels - a premium bridal and imitation jewellery brand with 15+ years of experience. Trusted by 1200+ happy brides worldwide.',
    keywords: 'about bridal jewellery brand, premium jewellery company, bridal jewellery store, jewellery brand, trusted jewellery retailer',
    ogTitle: 'About Shri Sai Bridal Jewels',
    ogDescription: 'Premium bridal jewellery brand with 15+ years of experience, trusted by 1200+ happy brides.',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'About Shri Sai Bridal Jewels',
    twitterDescription: 'Premium bridal jewellery brand with 15+ years of experience.'
  },
  contact: {
    title: 'Contact Shri Sai Bridal Jewels | Get in Touch',
    description: 'Contact Shri Sai Bridal Jewels for inquiries, custom orders, and support. Visit our showroom or reach out via phone, email, or WhatsApp.',
    keywords: 'contact bridal jewellery store, jewellery customer service, bridal jewellery inquiry, contact us',
    ogTitle: 'Contact Shri Sai Bridal Jewels',
    ogDescription: 'Get in touch with Shri Sai Bridal Jewels for inquiries and support.',
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: 'Contact Us',
    twitterDescription: 'Contact Shri Sai Bridal Jewels for inquiries and support.'
  },
  faq: {
    title: 'FAQ | Bridal Jewellery Rental & Purchase Questions | Shri Sai Bridal Jewels',
    description: 'Find answers to frequently asked questions about bridal jewellery rental, purchase, delivery, and our services at Shri Sai Bridal Jewels.',
    keywords: 'bridal jewellery FAQ, jewellery rental questions, bridal jewellery help, customer support',
    ogTitle: 'FAQ | Shri Sai Bridal Jewels',
    ogDescription: 'Frequently asked questions about bridal jewellery rental and purchase.',
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: 'FAQ',
    twitterDescription: 'Frequently asked questions about our bridal jewellery services.'
  },
  shipping: {
    title: 'Shipping & Returns Policy | Shri Sai Bridal Jewels',
    description: 'Learn about our shipping, delivery, and returns policy for bridal jewellery purchases and rentals at Shri Sai Bridal Jewels.',
    keywords: 'shipping policy, returns policy, delivery information, jewellery shipping',
    ogTitle: 'Shipping & Returns Policy',
    ogDescription: 'Shipping, delivery, and returns policy for bridal jewellery.',
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: 'Shipping & Returns',
    twitterDescription: 'Shipping and returns policy information.'
  },
  privacy: {
    title: 'Privacy Policy | Shri Sai Bridal Jewels',
    description: 'Read our privacy policy to understand how Shri Sai Bridal Jewels collects, uses, and protects your personal information.',
    keywords: 'privacy policy, data protection, personal information',
    ogTitle: 'Privacy Policy',
    ogDescription: 'Privacy policy and data protection information.',
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: 'Privacy Policy',
    twitterDescription: 'Privacy policy information.'
  },
  terms: {
    title: 'Terms & Conditions | Shri Sai Bridal Jewels',
    description: 'Review the terms and conditions for using Shri Sai Bridal Jewels website and services.',
    keywords: 'terms and conditions, terms of service, website terms',
    ogTitle: 'Terms & Conditions',
    ogDescription: 'Terms and conditions for using our website and services.',
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: 'Terms & Conditions',
    twitterDescription: 'Terms and conditions information.'
  }
};

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BUSINESS_INFO.name,
    description: BUSINESS_INFO.description,
    url: BUSINESS_INFO.url,
    logo: BUSINESS_INFO.logo,
    telephone: BUSINESS_INFO.phone,
    email: BUSINESS_INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_INFO.address,
      addressLocality: BUSINESS_INFO.city,
      addressCountry: BUSINESS_INFO.country
    },
    sameAs: [
      BUSINESS_INFO.socialProfiles.instagram,
      BUSINESS_INFO.socialProfiles.facebook
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: BUSINESS_INFO.phone,
      email: BUSINESS_INFO.email,
      areaServed: 'Worldwide'
    }
  };
}

/**
 * Generate LocalBusiness structured data
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS_INFO.name,
    description: BUSINESS_INFO.description,
    image: BUSINESS_INFO.logo,
    url: BUSINESS_INFO.url,
    telephone: BUSINESS_INFO.phone,
    email: BUSINESS_INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_INFO.address,
      addressLocality: BUSINESS_INFO.city,
      addressCountry: BUSINESS_INFO.country
    },
    priceRange: '$$',
    areaServed: 'Worldwide',
    serviceType: ['Jewellery Retail', 'Jewellery Rental'],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1200'
    }
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * Generate FAQPage structured data
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generate Product structured data
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
  availability?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: product.availability || 'https://schema.org/InStock'
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 0
      }
    })
  };
}

/**
 * Generate WebSite structured data
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BUSINESS_INFO.name,
    url: BUSINESS_INFO.url,
    description: BUSINESS_INFO.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BUSINESS_INFO.url}/shop?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}
