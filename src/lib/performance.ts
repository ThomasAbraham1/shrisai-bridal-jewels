/**
 * Performance optimization utilities
 */

// Debounce function for scroll and resize events
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for frequent events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Lazy load images with Intersection Observer
export const lazyLoadImage = (
  imageElement: HTMLImageElement,
  callback?: () => void
) => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
            callback?.();
          }
        }
      });
    });
    observer.observe(imageElement);
  }
};

// Prefetch resources
export const prefetchResource = (href: string, as: 'image' | 'script' | 'style' = 'image') => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = as;
  link.href = href;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

// Preload critical resources
export const preloadResource = (href: string, as: 'image' | 'script' | 'style' = 'image') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = href;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

// Batch prefetch multiple resources
export const batchPrefetchResources = (urls: string[], as: 'image' | 'script' | 'style' = 'image') => {
  urls.forEach(url => prefetchResource(url, as));
};

// Request idle callback polyfill
export const scheduleIdleTask = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 0);
  }
};
