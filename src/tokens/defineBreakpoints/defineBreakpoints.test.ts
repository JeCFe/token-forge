import { describe, expect, expectTypeOf, it } from 'vitest';
import { defineBreakpoints } from '.';

describe('defineBreakpoints', () => {
  it('returns the breakpoint object', () => {
    const breakpoints = { small: '400px', medium: '1000px' };

    expect(defineBreakpoints(breakpoints)).toBe(breakpoints);
  });

  it('preserves breakpoint names and values', () => {
    const breakpoints = defineBreakpoints({ small: '400px', medium: '1000px' });

    expect(breakpoints.small).toBe('400px');
    expectTypeOf(breakpoints.medium).toEqualTypeOf<string>();
  });

  it.each(['', '   '])('rejects an empty breakpoint value', (value) => {
    expect(() => defineBreakpoints({ small: value })).toThrow(
      new TypeError('breakpoints.small must not be empty.'),
    );
  });
});
