import { describe, expect, expectTypeOf, it } from 'vitest';
import { token, type TokenAlias } from '@/tokens';
import { alias } from '@/utils/alias';
import { isAlias } from '.';

describe('isAlias', () => {
  it('identifies aliases and narrows their type', () => {
    const value: unknown = alias(token('#3366ff'));

    expect(isAlias(value)).toBe(true);

    if (isAlias(value)) {
      expectTypeOf(value).toEqualTypeOf<TokenAlias<unknown>>();
      expect(value.target.kind).toBe('token');
    }
  });

  it('identifies circular alias chains without looping forever', () => {
    const circular = alias(token('#3366ff'));
    Object.defineProperty(circular, 'target', { value: circular });

    expect(isAlias(circular)).toBe(true);
  });

  it.each([
    null,
    undefined,
    '#3366ff',
    500,
    {},
    { kind: 'token' },
    { kind: 'alias', target: '#3366ff', value: '#3366ff' },
  ])('does not identify %# as an alias', (value) => {
    expect(isAlias(value)).toBe(false);
  });
});
