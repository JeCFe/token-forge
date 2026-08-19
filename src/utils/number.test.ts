import { describe, expect, expectTypeOf, it } from 'vitest';
import { formatNumber } from './number.ts';

describe('formatNumber', () => {
  it.each([
    [16, '16'],
    [-8, '-8'],
    [0.25, '0.25'],
    [1e-11, '1e-11'],
  ] as const)('formats %s as %s', (value, expected) => {
    const result = formatNumber(value);

    expect(result).toBe(expected);
    expectTypeOf(result).toEqualTypeOf<`${number}`>();
  });

  it('normalises floating-point noise', () => {
    expect(formatNumber(0.1 + 0.2)).toBe('0.3');
  });

  it('normalises negative zero', () => {
    expect(formatNumber(-0)).toBe('0');
  });
});
