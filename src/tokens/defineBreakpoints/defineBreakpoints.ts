import type { Breakpoints } from '@/tokens';
import { requireValue } from '@/validation';

/**
 * Defines the named breakpoints available to responsive token values.
 *
 * @example
 * ```ts
 * const breakpoints = defineBreakpoints({
 *   small: '400px',
 *   medium: '1000px',
 * });
 * ```
 */
export const defineBreakpoints = <T extends Breakpoints>(breakpoints: T): T => {
  for (const [name, value] of Object.entries(breakpoints)) {
    requireValue(value, `breakpoints.${name}`);
  }

  return breakpoints;
};
