import { Products } from '@/entities';

/**
 * Calculate discount percentage between MRP and Our Price
 */
export const calculateDiscount = (mrp: number, ourPrice: number): number => {
  if (!mrp || mrp <= 0) return 0;
  return Math.round(((mrp - ourPrice) / mrp) * 100);
};

/**
 * Get the display price for a product
 * Returns ourPrice if discount is enabled, otherwise returns itemPrice
 */
export const getDisplayPrice = (product: Products): number => {
  if (product.enableDiscount && product.ourPrice) {
    return product.ourPrice;
  }
  return product.itemPrice || 0;
};

/**
 * Check if product has a valid discount
 */
export const hasValidDiscount = (product: Products): boolean => {
  return !!(
    product.enableDiscount &&
    product.mrp &&
    product.ourPrice &&
    product.mrp > 0 &&
    product.ourPrice > 0 &&
    product.mrp > product.ourPrice
  );
};

/**
 * Get pricing display info for a product
 */
export const PricingInfo = null as unknown as PricingInfo;
export interface PricingInfo {
  displayPrice: number;
  mrp?: number;
  discount?: number;
  hasDiscount: boolean;
}

export const getPricingInfo = (product: Products): PricingInfo => {
  const hasDiscount = hasValidDiscount(product);
  
  return {
    displayPrice: getDisplayPrice(product),
    mrp: hasDiscount ? product.mrp : undefined,
    discount: hasDiscount ? calculateDiscount(product.mrp!, product.ourPrice!) : undefined,
    hasDiscount
  };
};
