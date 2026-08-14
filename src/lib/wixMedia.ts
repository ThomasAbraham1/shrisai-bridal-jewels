/**
 * Wix Media Transform Utilities
 * Generates exact Wix CDN image transformation URLs with automatic format (AVIF/WebP),
 * unsharp masking (usm), alignment, and quality compression.
 */

export function extractWixFileId(src: string | undefined): string | null {
  if (!src) return null;

  if (src.startsWith('wix:image://v1/')) {
    return src.replace('wix:image://v1/', '').split('#')[0].split('/')[0].replace('_mv2.', '~mv2.');
  }

  const staticMatch = src.match(/static\.wixstatic\.com\/media\/([^/?#]+)/);
  if (staticMatch) {
    return staticMatch[1].replace('_mv2.', '~mv2.');
  }

  const mediaMatch = src.match(/\/media\/([^/?#]+)/);
  if (mediaMatch && (mediaMatch[1].startsWith('b9ec8c_') || mediaMatch[1].startsWith('978e03_') || mediaMatch[1].startsWith('12d367_') || mediaMatch[1].startsWith('11052b_'))) {
    return mediaMatch[1].replace('_mv2.', '~mv2.');
  }

  return null;
}

export interface WixImageTransformOptions {
  width?: number;
  height?: number;
  mode?: 'fill' | 'fit';
  quality?: number;
  alignment?: string;
  unsharpMask?: string;
}

export function getWixImageUrl(
  src: string | undefined,
  options: WixImageTransformOptions = {}
): string {
  if (!src) return '';

  const fileId = extractWixFileId(src);
  if (!fileId) return src;

  const width = options.width || 452;
  const height = options.height || (options.mode === 'fill' ? Math.round(width * (4 / 3)) : width);
  const mode = options.mode || 'fill';
  const quality = options.quality ?? 80;
  const alignment = options.alignment || 'al_c';
  const usm = options.unsharpMask || 'usm_0.66_1.00_0.01';

  return `https://static.wixstatic.com/media/${fileId}/v1/${mode}/w_${width},h_${height},${alignment},q_${quality},${usm},enc_auto/${fileId}`;
}
