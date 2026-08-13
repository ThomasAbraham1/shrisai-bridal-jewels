import { Star } from 'lucide-react';
import { getStarRating, getReviewCountDisplay, getRatingColor } from '@/lib/ratings';

interface ProductRatingProps {
  rating?: number;
  reviewCount?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProductRating({
  rating,
  reviewCount,
  showCount = true,
  size = 'md',
  className = ''
}: ProductRatingProps) {
  const starRating = getStarRating(rating);
  const hasReviews = reviewCount && reviewCount > 0;
  
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (!hasReviews) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className={`${textSizeClasses[size]} text-foreground/60 font-paragraph`}>
          No Reviews Yet
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              i < Math.floor(starRating)
                ? 'fill-primary text-primary'
                : i < starRating
                ? 'fill-primary text-primary opacity-50'
                : 'text-foreground/20'
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className={`${textSizeClasses[size]} text-foreground/70 font-paragraph`}>
          {starRating.toFixed(1)} ({getReviewCountDisplay(reviewCount)})
        </span>
      )}
    </div>
  );
}
