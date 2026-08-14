import React, { forwardRef, useState, useEffect, type ImgHTMLAttributes } from 'react';
import { getWixImageUrl } from '@/lib/wixMedia';

export interface HeroImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  quality?: number;
  fittingType?: 'fill' | 'fit';
}

const FALLBACK_HERO = 'https://static.wixstatic.com/media/b9ec8c_ad402c9d262649c48c12a048372247de~mv2.png';

export const HeroImage = forwardRef<HTMLImageElement, HeroImageProps>(
  (
    {
      src,
      alt = 'Hero Banner',
      width = 1983,
      height = 793,
      quality = 95,
      fittingType = 'fill',
      className = 'w-full h-full object-cover',
      loading = 'eager',
      ...props
    },
    ref
  ) => {
    const rawSrc = src || FALLBACK_HERO;
    const [imgSrc, setImgSrc] = useState<string>(() =>
      getWixImageUrl(rawSrc, {
        width,
        height,
        mode: fittingType,
        quality,
        unsharpMask: 'usm_0.75_1.20_0.00'
      })
    );

    useEffect(() => {
      const source = src || FALLBACK_HERO;
      setImgSrc(
        getWixImageUrl(source, {
          width,
          height,
          mode: fittingType,
          quality,
          unsharpMask: 'usm_0.75_1.20_0.00'
        })
      );
    }, [src, width, height, quality, fittingType]);

    return (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt}
        className={className}
        loading={loading}
        onError={() => {
          setImgSrc(FALLBACK_HERO);
        }}
        {...props}
      />
    );
  }
);

HeroImage.displayName = 'HeroImage';
export default HeroImage;
