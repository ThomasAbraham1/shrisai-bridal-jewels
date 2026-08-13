import { Products } from '@/entities';
import { getStockStatus } from '@/lib/inventory';

interface ProductBadgesProps {
  product: Products;
  className?: string;
}

export default function ProductBadges({ product, className = '' }: ProductBadgesProps) {
  const stockStatus = getStockStatus(product.stockQuantity);
  const badges = [];

  // ... keep existing code (Stock Status Badges only - removed New Arrival and Best Seller)
  if (stockStatus === 'low-stock') {
    badges.push({
      id: 'low-stock',
      label: 'Low Stock',
      color: 'bg-yellow-500 text-white'
    });
  } else if (stockStatus === 'out-of-stock') {
    badges.push({
      id: 'out-of-stock',
      label: 'Out of Stock',
      color: 'bg-red-500 text-white'
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 w-full ${className}`}>
      {badges.map((badge) => (
        <span
          key={badge.id}
          className={`${badge.color} px-2 md:px-3 py-1 rounded-full text-xs font-paragraph uppercase tracking-wider whitespace-nowrap`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}
