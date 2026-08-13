/**
 * SEO Meta Component
 * Injects SEO metadata into the document head
 */

import { useEffect } from 'react';
import { SEOConfig } from '@/lib/seo';

interface SEOMetaProps {
  config: SEOConfig;
  pageUrl?: string;
}

export function SEOMeta({ config, pageUrl }: SEOMetaProps) {
  useEffect(() => {
    // Set title
    document.title = config.title;

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', config.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = config.description;
      document.head.appendChild(meta);
    }

    // Set keywords if provided
    if (config.keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', config.keywords);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = config.keywords;
        document.head.appendChild(meta);
      }
    }

    // Set canonical URL
    const canonical = pageUrl || config.canonical;
    if (canonical) {
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', canonical);
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = canonical;
        document.head.appendChild(link);
      }
    }

    // Set Open Graph tags
    if (config.ogTitle) {
      setMetaTag('property', 'og:title', config.ogTitle);
    }
    if (config.ogDescription) {
      setMetaTag('property', 'og:description', config.ogDescription);
    }
    if (config.ogImage) {
      setMetaTag('property', 'og:image', config.ogImage);
    }
    if (config.ogType) {
      setMetaTag('property', 'og:type', config.ogType);
    }
    if (pageUrl) {
      setMetaTag('property', 'og:url', pageUrl);
    }

    // Set Twitter tags
    if (config.twitterCard) {
      setMetaTag('name', 'twitter:card', config.twitterCard);
    }
    if (config.twitterTitle) {
      setMetaTag('name', 'twitter:title', config.twitterTitle);
    }
    if (config.twitterDescription) {
      setMetaTag('name', 'twitter:description', config.twitterDescription);
    }
    if (config.twitterImage) {
      setMetaTag('name', 'twitter:image', config.twitterImage);
    }

    // Set structured data if provided
    if (config.structuredData) {
      const scriptId = 'structured-data-schema';
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(config.structuredData);
    }
  }, [config, pageUrl]);

  return null;
}

/**
 * Helper function to set meta tags
 */
function setMetaTag(attribute: string, name: string, content: string) {
  const selector = `meta[${attribute}="${name}"]`;
  let meta = document.querySelector(selector);
  if (meta) {
    meta.setAttribute('content', content);
  } else {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }
}
