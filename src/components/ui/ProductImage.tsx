import React, { forwardRef, useState, useEffect, type ImgHTMLAttributes } from 'react';
import { getWixImageUrl } from '@/lib/wixMedia';

export interface ProductImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  fittingType?: 'fill' | 'fit';
  quality?: number;
}

const FALLBACK_PRODUCT_IMAGE = 'https://static.wixstatic.com/media/978e03_933b74b3e10f4088949a15851f603622~mv2.png';

export const ProductImage = forwardRef<HTMLImageElement, ProductImageProps>(
  (
    {
      src,
      alt = 'Jewellery Product',
      width = 452,
      height = 603,
      fittingType = 'fill',
      quality = 80,
      className = 'absolute inset-0 w-full h-full object-cover',
      loading = 'lazy',
      ...props
    },
    ref
  ) => {
    const rawSrc = src || FALLBACK_PRODUCT_IMAGE;
    const [imgSrc, setImgSrc] = useState<string>(() =>
      getWixImageUrl(rawSrc, { width, height, mode: fittingType, quality })
    );

    useEffect(() => {
      const source = src || FALLBACK_PRODUCT_IMAGE;
      setImgSrc(getWixImageUrl(source, { width, height, mode: fittingType, quality }));
    }, [src, width, height, fittingType, quality]);

    return (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt}
        className={className}
        loading={loading}
        onError={() => {
          setImgSrc(FALLBACK_PRODUCT_IMAGE);
        }}
        {...props}
      />
    );
  }
);

ProductImage.displayName = 'ProductImage';
export default ProductImage;
