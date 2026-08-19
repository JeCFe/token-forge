import type { SizeValue } from '@/tokens';
import { requireFiniteNumber } from '@/validation';
import { formatNumber } from './formatNumber';

/**
 * Creates a size helper using the number of pixels equal to one rem.
 *
 * @param pixelsPerRem - A positive number of pixels representing one rem.
 * @returns A helper that accepts finite positive, zero, or negative pixel sizes.
 *
 * @example
 * ```ts
 * const size = createSize(16);
 * const small = size(8);
 *
 * small.px; // '8px'
 * small.rem; // '0.5rem'
 * ```
 */
export const createSize = (pixelsPerRem: number) => {
  const finitePixelsPerRem = requireFiniteNumber(pixelsPerRem, 'pixelsPerRem');
  if (finitePixelsPerRem <= 0) {
    throw new RangeError('pixelsPerRem must be a positive finite number.');
  }

  return (pixels: number): SizeValue => {
    const finitePixels = requireFiniteNumber(pixels, 'pixels');

    return {
      px: `${formatNumber(finitePixels)}px`,
      rem: `${formatNumber(finitePixels / finitePixelsPerRem)}rem`,
    };
  };
};
