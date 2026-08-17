import type { Breakpoints } from './types.ts';

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
export const defineBreakpoints = <T extends Breakpoints>(breakpoints: T): T =>
  breakpoints;
