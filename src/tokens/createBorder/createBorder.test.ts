import type * as CSS from 'csstype';
import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  createGradient,
  defineTokens,
  type BorderOptions,
  type BorderValue,
  type GradientValue,
} from '@/tokens';
import { createBorder } from '.';

const color = defineTokens({
  blue: {
    '100': '#3366ff',
  },
  purple: {
    '100': '#8a2be2',
  },
});

describe('createBorder', () => {
  it('creates a conventional colour border', () => {
    expect(createBorder({ width: '1px', colour: color.blue['100'] })).toEqual({
      border: '1px solid #3366ff',
    });
  });

  it('supports a custom border style', () => {
    expect(
      createBorder({ width: '2px', style: 'dashed', colour: 'currentColor' }),
    ).toEqual({ border: '2px dashed currentColor' });
  });

  it('uses CSS border style values', () => {
    expectTypeOf<
      NonNullable<BorderOptions['style']>
    >().toEqualTypeOf<CSS.Property.BorderTopStyle>();
  });

  it('creates a gradient border with CSS border-image', () => {
    const gradient = createGradient({
      type: 'linear',
      direction: 'to right',
      stops: [color.blue['100'], color.purple['100']],
    });

    expect(createBorder({ width: '2px', gradient })).toEqual({
      border: '2px solid transparent',
      borderImage: 'linear-gradient(to right, #3366ff, #8a2be2) 1',
    });
  });

  it('supports gradient fallback, slice, repeat, and style values', () => {
    const gradient = createGradient({
      type: 'radial',
      stops: ['white', 'black'],
    });

    expect(
      createBorder({
        width: '4px',
        style: 'double',
        gradient,
        fallbackColour: color.blue['100'],
        slice: '20%',
        repeat: 'round',
      }),
    ).toEqual({
      border: '4px double #3366ff',
      borderImage: 'radial-gradient(white, black) 20% round',
    });
  });

  it('returns values that can be composed into tokens', () => {
    const gradient = createGradient({
      type: 'linear',
      stops: ['red', 'blue'],
    });
    const tokens = defineTokens({
      border: {
        focus: createBorder({ width: '2px', gradient }),
      },
    });

    expect(tokens.border.focus.border).toBe('2px solid transparent');
    expect(tokens.border.focus.borderImage).toBe(
      'linear-gradient(red, blue) 1',
    );
    expectTypeOf(tokens.border.focus).toEqualTypeOf<BorderValue>();
    expectTypeOf(gradient).toEqualTypeOf<GradientValue>();
  });

  it.each([
    { width: '', colour: 'red' } as const,
    {
      width: '1px',
      style: '' as CSS.Property.BorderTopStyle,
      colour: 'red',
    } as const,
    { width: '1px', colour: '' } as const,
    {
      width: '1px',
      gradient: '' as GradientValue,
    } as const,
    {
      width: '1px',
      gradient: 'linear-gradient(red)' as GradientValue,
      fallbackColour: '',
    } as const,
    {
      width: '1px',
      gradient: 'linear-gradient(red)' as GradientValue,
      slice: '',
    } as const,
    {
      width: '1px',
      gradient: 'linear-gradient(red)' as GradientValue,
      repeat: '',
    } as const,
  ])('rejects an empty border fragment in %#', (options) => {
    expect(() => createBorder(options)).toThrow(TypeError);
  });
});
