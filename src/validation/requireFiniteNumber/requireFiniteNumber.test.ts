import { describe, expect, expectTypeOf, it } from 'vitest';
import { requireFiniteNumber } from '.';

describe('requireFiniteNumber', () => {
  it.each([0, 1, -1, 0.25])('returns the finite number %s', (value) => {
    const result = requireFiniteNumber(value, 'value');

    expect(result).toBe(value);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'rejects the non-finite number %s',
    (value) => {
      expect(() => requireFiniteNumber(value, 'value')).toThrow(
        new RangeError('value must be a finite number.'),
      );
    },
  );

  it('identifies the invalid field in the error message', () => {
    expect(() => requireFiniteNumber(Number.NaN, 'fontWeight')).toThrow(
      new RangeError('fontWeight must be a finite number.'),
    );
  });
});
