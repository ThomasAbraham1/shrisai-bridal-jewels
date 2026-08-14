import React, { forwardRef, useState, useEffect, type ImgHTMLAttributes } from 'react';
import { getWixImageUrl } from '@/lib/wixMedia';

export interface CategoryImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  fittingType?: 'fill' | 'fit';
  quality?: number;
}

const FALLBACK_CATEGORY_IMAGE = 'https://static.wixstatic.com/media/b9ec8c_815754f089d2465fa579a3d392b49e00~mv2.png';

export const CategoryImage = forwardRef<HTMLImageElement, CategoryImageProps>(
  (
    {
      src,
      alt = 'Jewellery Category',
      width = 231,
      height = 231,
      fittingType = 'fill',
      quality = 85,
      className = 'absolute inset-0 w-full h-full object-cover',
      loading = 'lazy',
      ...props
    },
    ref
  ) => {
    const rawSrc = src || FALLBACK_CATEGORY_IMAGE;
    const [imgSrc, setImgSrc] = useState<string>(() =>
      getWixImageUrl(rawSrc, { width: 231, height: 231, mode: 'fill', quality: 85 })
    );

    useEffect(() => {
      const source = src || FALLBACK_CATEGORY_IMAGE;
      setImgSrc(getWixImageUrl(source, { width: 231, height: 231, mode: 'fill', quality: 85 }));
    }, [src]);

    return (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt}
        className={className}
        loading={loading}
        onError={() => {
          setImgSrc(FALLBACK_CATEGORY_IMAGE);
        }}
        {...props}
      />
    );
  }
);

CategoryImage.displayName = 'CategoryImage';
export default CategoryImage;
