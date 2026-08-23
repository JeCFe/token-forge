import { describe, expect, expectTypeOf, it } from 'vitest';
import { token, type Token } from '@/tokens';
import { isToken } from '.';

describe('isToken', () => {
  it('identifies tokens and narrows their type', () => {
    const value: unknown = token('#3366ff');

    expect(isToken(value)).toBe(true);

    if (isToken(value)) {
      expectTypeOf(value).toEqualTypeOf<Token<unknown>>();
      expect(value.value).toBe('#3366ff');
    }
  });

  it.each([null, undefined, '#3366ff', 500, {}, { kind: 'token' }])(
    'does not identify %# as a token',
    (value) => {
      expect(isToken(value)).toBe(false);
    },
  );
});
