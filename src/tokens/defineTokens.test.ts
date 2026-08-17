import { describe, expect, expectTypeOf, it } from 'vitest';
import { createResponsive } from './createResponsive.ts';
import { defineBreakpoints } from './defineBreakpoints.ts';
import { defineTokens } from './defineTokens.ts';

describe('defineTokens', () => {
  it('returns the token object', () => {
    const tokens = { color: { primary: '#3366ff' } };
    expect(defineTokens(tokens)).toBe(tokens);
  });

  it('preserves deeply nested token values and their inferred types', () => {
    const tokens = defineTokens({
      color: { text: { primary: '#111111' } },
      spacing: { small: 8, large: '24px' },
    });

    expect(tokens.color.text.primary).toBe('#111111');
    expect(tokens.spacing.small).toBe(8);
    expectTypeOf(tokens.color.text.primary).toEqualTypeOf<string>();
    expectTypeOf(tokens.spacing.small).toEqualTypeOf<number>();
  });

  it('accepts an empty token collection', () => {
    expect(defineTokens({})).toEqual({});
  });

  it('accepts empty nested groups', () => {
    const tokens = defineTokens({ color: {} });

    expect(tokens).toEqual({ color: {} });
  });

  it('accepts zero as a token value', () => {
    const tokens = defineTokens({ spacing: { none: 0 } });

    expect(tokens.spacing.none).toBe(0);
  });

  it('remains mutable after definition', () => {
    const tokens = defineTokens({ color: { primary: '#3366ff' } });

    tokens.color.primary = '#ffffff';

    expect(tokens.color.primary).toBe('#ffffff');
  });

  it('supports composing token objects with TypeScript references', () => {
    const palette = {
      gold: {
        500: '#d4af37',
      },
    };
    const brand = {
      border: {
        primary: palette.gold[500],
      },
    };

    const tokens = defineTokens({ palette, brand });

    expect(tokens.palette.gold[500]).toBe('#d4af37');
    expect(tokens.brand.border.primary).toBe(palette.gold[500]);
  });

  it('accepts responsive values', () => {
    const breakpoints = defineBreakpoints({ small: '400px', medium: '1000px' });
    const responsive = createResponsive(breakpoints);
    const tokens = defineTokens({
      padding: {
        box: responsive({ base: '10px', medium: '15px' }),
      },
    });

    expect(tokens.padding.box.base).toBe('10px');
    expect(tokens.padding.box.medium).toBe('15px');
  });
});
