import React from 'react';
import { create } from 'zustand';

/**
 * Default currency code to use when the site currency is not available.
 */
export const DEFAULT_CURRENCY = 'INR';

/**
 * Formats a numeric amount as a currency string.
 * Uses the browser's locale for proper formatting (symbol placement, decimals).
 *
 * @param amount - The numeric price value
 * @param currencyCode - ISO 4217 currency code (e.g., "USD", "EUR", "ILS")
 * @returns Formatted currency string (e.g., "$99.99", "€99,99", "₪99.99")
 *
 * @example
 * ```typescript
 * import { useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
 *
 * const { currency } = useCurrency();
 * formatPrice(99.99, currency ?? DEFAULT_CURRENCY) // "₹99.99" (or site currency)
 * formatPrice(99.99, 'EUR') // "€99.99" or "99,99 €" depending on locale
 * formatPrice(99.99, 'ILS') // "₪99.99"
 * ```
 */
export function formatPrice(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch {
    // Fallback for invalid currency codes
    console.warn(`Invalid currency code: ${currencyCode}, falling back to ${DEFAULT_CURRENCY}`);
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: DEFAULT_CURRENCY,
    }).format(amount);
  }
}

interface CurrencyState {
  currency: string | null;
  isLoading: boolean;
  error: string | null;
  _initialized: boolean;
}

interface CurrencyActions {
  _fetchCurrency: () => Promise<void>;
}

type CurrencyStore = CurrencyState & { actions: CurrencyActions };

/**
 * Zustand store for managing site currency
 * Fetches currency from Wix site settings on initialization
 */
export const useCurrencyStore = create<CurrencyStore>((set) => ({
  currency: DEFAULT_CURRENCY,
  isLoading: false,
  error: null,
  _initialized: true,

  actions: {
    _fetchCurrency: async () => {
      try {
        set({ isLoading: true, error: null });
        // Use DEFAULT_CURRENCY as fallback
        set({ currency: DEFAULT_CURRENCY, isLoading: false, _initialized: true });
      } catch (error) {
        console.error('Failed to fetch currency:', error);
        set({ currency: DEFAULT_CURRENCY, isLoading: false, error: String(error), _initialized: true });
      }
    },
  },
}));

/**
 * Hook to access currency state and actions
 * Automatically initializes currency on first use
 *
 * @returns Object with currency code and loading state
 *
 * @example
 * ```typescript
 * const { currency } = useCurrency();
 * const formatted = formatPrice(99.99, currency ?? DEFAULT_CURRENCY);
 * ```
 */
export function useCurrency() {
  const store = useCurrencyStore();
  const { _initialized, actions } = store;

  React.useEffect(() => {
    if (!_initialized) {
      actions._fetchCurrency();
    }
  }, [_initialized, actions]);

  return {
    currency: store.currency,
    isLoading: store.isLoading,
    error: store.error,
  };
}
