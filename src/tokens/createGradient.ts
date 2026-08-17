import {
  createGradientPrelude,
  formatGradientStop,
} from '../utils/gradient.ts';
import type { GradientOptions, GradientValue } from './types.ts';

/**
 * Creates a CSS gradient value for use as a design token.
 *
 * CSS values such as colours, positions, angles, and sizes are kept open-ended
 * so modern CSS syntax and custom-property references can be used.
 *
 * @example
 * ```ts
 * const hero = createGradient({
 *   type: 'linear',
 *   direction: '135deg',
 *   stops: [
 *     { colour: '#3366ff', position: '0%' },
 *     { colour: '#8a2be2', position: '100%' },
 *   ],
 * });
 * ```
 */
export const createGradient = (options: GradientOptions): GradientValue => {
  if (options.stops.length === 0) {
    throw new RangeError('A gradient requires at least one colour stop.');
  }

  const prelude = createGradientPrelude(options);
  const stops = options.stops.map(formatGradientStop);

  if (stops.length === 1) {
    stops.push(stops[0]);
  }

  const values = [prelude, ...stops].filter(
    (value): value is string => value !== undefined,
  );
  const repeating = options.repeating ? 'repeating-' : '';

  return `${repeating}${options.type}-gradient(${values.join(', ')})`;
};
