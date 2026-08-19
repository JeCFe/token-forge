import { describe, expect, expectTypeOf, it } from 'vitest';
import { defineTokens } from './defineTokens.ts';
import { alias, token } from './token.ts';
import type { TokenAlias, TokenReference } from './types.ts';

describe('token', () => {
  it('creates an explicit token node', () => {
    const primary = token('#3366ff');

    expect(primary).toEqual({ kind: 'token', value: '#3366ff' });
    expectTypeOf(primary.value).toEqualTypeOf<string>();
  });

  it('supports structured values', () => {
    const body = token({ fontSize: '1rem', lineHeight: 1.5 });

    expect(body.value.fontSize).toBe('1rem');
    expectTypeOf(body.value).toEqualTypeOf<{
      fontSize: string;
      lineHeight: number;
    }>();
  });
});

describe('alias', () => {
  it('preserves its relationship to the target token', () => {
    const blue = token('#3366ff');
    const primary = alias(blue);

    expect(primary.kind).toBe('alias');
    expect(primary.target).toBe(blue);
    expect(primary.value).toBe('#3366ff');
    expectTypeOf(primary).toEqualTypeOf<TokenAlias<string>>();
  });

  it('supports alias chains without losing the original relationships', () => {
    const blue = token('#3366ff');
    const brand = alias(blue);
    const action = alias(brand);

    expect(action.target).toBe(brand);
    expect(brand.target).toBe(blue);
    expect(action.value).toBe('#3366ff');
  });

  it('works naturally inside defineTokens', () => {
    const palette = defineTokens({
      blue: {
        500: token('#3366ff'),
      },
    });
    const tokens = defineTokens({
      primary: alias(palette.blue['500']),
    });

    expect(tokens.primary.target).toBe(palette.blue['500']);
    expect(tokens.primary.value).toBe(palette.blue['500'].value);
  });

  it('only accepts explicit tokens and aliases as targets', () => {
    expectTypeOf<string>().not.toMatchTypeOf<TokenReference<unknown>>();
  });
});
