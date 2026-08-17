import type { SizeValue } from './types.ts';

/** Formats a finite number without floating-point noise or negative zero. */
const formatNumber = (value: number): `${number}` => {
  const rounded = Number(value.toPrecision(15));
  return (Object.is(rounded, -0) ? '0' : String(rounded)) as `${number}`;
};

/**
 * Creates a size helper using the number of pixels equal to one rem.
 *
 * @param pixelsPerRem - A positive number of pixels representing one rem.
 * @returns A helper that accepts non-negative pixel sizes.
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
  if (!Number.isFinite(pixelsPerRem) || pixelsPerRem <= 0) {
    throw new RangeError('pixelsPerRem must be a positive finite number.');
  }

  return (pixels: number): SizeValue => {
    if (!Number.isFinite(pixels) || pixels < 0) {
      throw new RangeError('pixels must be a non-negative finite number.');
    }

    return {
      px: `${formatNumber(pixels)}px`,
      rem: `${formatNumber(pixels / pixelsPerRem)}rem`,
    };
  };
};
