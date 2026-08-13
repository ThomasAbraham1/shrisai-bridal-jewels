import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Component to handle automatic scroll management
export function ScrollToTop() {
  const location = useLocation();
  const prevLocationRef = useRef<string | null>(null);

  useEffect(() => {
    // Only scroll if the pathname actually changed (not just hash or search params)
    const pathChanged = prevLocationRef.current !== location.pathname;
    
    if (!pathChanged) {
      return; // Don't scroll if we're on the same page
    }

    // HARD FIX: Force scroll to top immediately with no smooth behavior
    // This prevents any scroll listeners from interfering
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    
    // Double-check with synchronous scroll as backup
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Check if the URL has a hash
    if (location.hash) {
      // URL with hash: Wait for DOM to settle, then scroll to element
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          // Use auto behavior for hash scrolling too (no smooth)
          element.scrollIntoView({ behavior: 'auto' });
        }
      }, 50);
    }

    // Update the previous location reference
    prevLocationRef.current = location.pathname;
  }, [location.pathname, location.hash]);

  return null;
}
