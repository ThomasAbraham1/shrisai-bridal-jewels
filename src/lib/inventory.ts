/**
 * Inventory Management Utilities
 */

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

/**
 * Get stock status based on quantity
 */
export const getStockStatus = (quantity?: number): StockStatus => {
  if (!quantity || quantity === 0) return 'out-of-stock';
  if (quantity <= 10) return 'low-stock';
  return 'in-stock';
};

/**
 * Get stock status label
 */
export const getStockLabel = (quantity?: number): string => {
  const status = getStockStatus(quantity);
  
  switch (status) {
    case 'in-stock':
      return quantity! > 10 ? `In Stock (${quantity} Available)` : `In Stock (${quantity} Available)`;
    case 'low-stock':
      return `Only ${quantity} Left`;
    case 'out-of-stock':
      return 'Out of Stock';
  }
};

/**
 * Get stock status color classes
 */
export const getStockStatusColor = (quantity?: number): string => {
  const status = getStockStatus(quantity);
  
  switch (status) {
    case 'in-stock':
      return 'bg-green-100 text-green-800';
    case 'low-stock':
      return 'bg-yellow-100 text-yellow-800';
    case 'out-of-stock':
      return 'bg-red-100 text-red-800';
  }
};

/**
 * Check if product is available for purchase
 */
export const isProductAvailable = (quantity?: number): boolean => {
  return quantity !== undefined && quantity > 0;
};

/**
 * Get sold count display
 */
export const getSoldCountDisplay = (initialSoldCount?: number): string => {
  const count = initialSoldCount || 0;
  if (count === 0) return '';
  if (count === 1) return '1 Sold';
  return `${count} Sold`;
};
