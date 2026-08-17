import { describe, expect, expectTypeOf, it } from 'vitest';
import { requireValue } from './requireValue.ts';

describe('requireValue', () => {
  it('returns a non-empty value', () => {
    const value = requireValue('45deg', 'direction');

    expect(value).toBe('45deg');
    expectTypeOf(value).toEqualTypeOf<string>();
  });

  it('preserves surrounding whitespace', () => {
    expect(requireValue('  center  ', 'position')).toBe('  center  ');
  });

  it.each(['', ' ', '\t', '\n', ' \t\n '])(
    'rejects an empty or whitespace-only value',
    (value) => {
      expect(() => requireValue(value, 'direction')).toThrow(TypeError);
    },
  );

  it('identifies the invalid field in the error message', () => {
    expect(() => requireValue('', 'stops[1].colour')).toThrow(
      new TypeError('stops[1].colour must not be empty.'),
    );
  });
});
