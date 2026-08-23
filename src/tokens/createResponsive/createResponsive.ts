import type { Breakpoints, ResponsiveValues } from '@/tokens';
import { responsiveMetadataKey } from './responsiveMetadataKey';

/**
 * Creates a type-safe helper for assigning token values to named breakpoints.
 *
 * @example
 * ```ts
 * const breakpoints = defineBreakpoints({
 *   small: '400px',
 *   medium: '1000px',
 * });
 * const responsive = createResponsive(breakpoints);
 *
 * const padding = responsive({
 *   base: '10px',
 *   small: '12px',
 *   medium: '15px',
 * });
 * ```
 */
export const createResponsive = <TBreakpoints extends Breakpoints>(
  breakpoints: TBreakpoints,
) => {
  type AllowedName = 'base' | keyof TBreakpoints;

  return <TValues extends ResponsiveValues<TBreakpoints>>(
    values: TValues & Record<Exclude<keyof TValues, AllowedName>, never>,
  ): TValues => {
    const responsiveValues = { ...values } as TValues;
    Object.defineProperty(responsiveValues, responsiveMetadataKey, {
      value: { breakpoints },
      enumerable: false,
    });
    return responsiveValues;
  };
};
