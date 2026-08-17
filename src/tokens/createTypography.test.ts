import { describe, expect, expectTypeOf, it } from 'vitest';
import { createTypography } from './createTypography.ts';
import { defineTokens } from './defineTokens.ts';
import type { TypographyOptions, TypographyValue } from './types.ts';

describe('createTypography', () => {
  it('creates typography declarations from a font-family list', () => {
    expect(
      createTypography({
        fontFamily: ['Inter', 'Arial', 'sans-serif'],
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
      }),
    ).toEqual({
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    });
  });

  it('supports CSS values and optional letter spacing', () => {
    expect(
      createTypography({
        fontFamily: 'var(--font-body), sans-serif',
        fontSize: 'var(--font-size-body)',
        fontWeight: 'var(--font-weight-body)',
        lineHeight: 'normal',
        letterSpacing: '0.01em',
      }),
    ).toEqual({
      fontFamily: 'var(--font-body), sans-serif',
      fontSize: 'var(--font-size-body)',
      fontWeight: 'var(--font-weight-body)',
      lineHeight: 'normal',
      letterSpacing: '0.01em',
    });
  });

  it('returns values that can be composed into tokens', () => {
    const tokens = defineTokens({
      typography: {
        body: createTypography({
          fontFamily: ['Inter', 'sans-serif'],
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: 1.5,
        }),
      },
    });

    expect(tokens.typography.body.fontFamily).toBe('Inter, sans-serif');
    expectTypeOf(tokens.typography.body).toEqualTypeOf<TypographyValue>();
  });

  it('exposes consumer-friendly value types', () => {
    expectTypeOf<TypographyOptions['fontFamily']>().toEqualTypeOf<
      string | readonly string[]
    >();
    expectTypeOf<TypographyOptions['fontSize']>().toEqualTypeOf<string>();
    expectTypeOf<TypographyOptions['fontWeight']>().toEqualTypeOf<
      string | number
    >();
    expectTypeOf<TypographyOptions['lineHeight']>().toEqualTypeOf<
      string | number
    >();
  });

  it.each([
    { fontSize: '', fontWeight: 400, lineHeight: 1.5 },
    { fontSize: '1rem', fontWeight: '', lineHeight: 1.5 },
    { fontSize: '1rem', fontWeight: 400, lineHeight: '' },
    {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '',
    },
  ] as const)('rejects an empty CSS value in %#', (values) => {
    expect(() => createTypography({ fontFamily: 'Inter', ...values })).toThrow(
      TypeError,
    );
  });

  it.each([0, 1001, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects an invalid font weight of %s',
    (fontWeight) => {
      expect(() =>
        createTypography({
          fontFamily: 'Inter',
          fontSize: '1rem',
          fontWeight,
          lineHeight: 1.5,
        }),
      ).toThrow(RangeError);
    },
  );

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects an invalid line height of %s',
    (lineHeight) => {
      expect(() =>
        createTypography({
          fontFamily: 'Inter',
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight,
        }),
      ).toThrow(RangeError);
    },
  );
});
