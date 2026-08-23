import { describe, expect, expectTypeOf, it } from 'vitest';
import { token, type TokenAlias } from '@/tokens';
import { alias } from '@/utils/alias';
import { resolveToken } from '.';

describe('resolveToken', () => {
  it('resolves direct tokens and alias chains', () => {
    const blue = token('#3366ff');
    const brand = alias(blue);
    const primary = alias(brand);

    expect(resolveToken(blue)).toBe('#3366ff');
    expect(resolveToken(primary)).toBe('#3366ff');
    expectTypeOf(resolveToken(primary)).toEqualTypeOf<string>();
  });

  it('preserves structured value types', () => {
    const body = alias(token({ fontSize: '1rem', lineHeight: 1.5 }));
    const resolved = resolveToken(body);

    expect(resolved).toEqual({ fontSize: '1rem', lineHeight: 1.5 });
    expectTypeOf(resolved).toEqualTypeOf<{
      fontSize: string;
      lineHeight: number;
    }>();
  });

  it('rejects circular alias chains', () => {
    const circular = alias(token('#3366ff'));
    Object.defineProperty(circular, 'target', { value: circular });

    expect(() => resolveToken(circular)).toThrowError(
      new RangeError('Circular token alias detected.'),
    );
  });

  it('rejects malformed alias targets', () => {
    const malformed = {
      kind: 'alias',
      target: '#3366ff',
      value: '#3366ff',
    } as unknown as TokenAlias<string>;

    expect(() => resolveToken(malformed)).toThrowError(
      new TypeError('Token alias target must be a token or alias.'),
    );
  });
});
