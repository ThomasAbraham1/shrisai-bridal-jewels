/**
 * Rating & Review Utilities
 */

/**
 * Get star rating display
 */
export const getStarRating = (rating?: number): number => {
  if (!rating || rating < 0) return 0;
  if (rating > 5) return 5;
  return Math.round(rating * 10) / 10;
};

/**
 * Get review count display
 */
export const getReviewCountDisplay = (count?: number): string => {
  if (!count || count === 0) return 'No Reviews Yet';
  if (count === 1) return '1 Review';
  return `${count} Reviews`;
};

/**
 * Check if product has reviews
 */
export const hasReviews = (count?: number): boolean => {
  return count !== undefined && count > 0;
};

/**
 * Format rating with reviews
 */
export const formatRatingDisplay = (rating?: number, reviewCount?: number): string => {
  if (!hasReviews(reviewCount)) {
    return 'No Reviews Yet';
  }
  
  const stars = getStarRating(rating);
  const reviews = getReviewCountDisplay(reviewCount);
  
  return `${stars} (${reviews})`;
};

/**
 * Get rating color based on value
 */
export const getRatingColor = (rating?: number): string => {
  if (!rating || rating === 0) return 'text-foreground/40';
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4) return 'text-blue-600';
  if (rating >= 3) return 'text-yellow-600';
  return 'text-orange-600';
};
