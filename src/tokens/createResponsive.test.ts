import { describe, expect, expectTypeOf, it } from 'vitest';
import { createResponsive } from './createResponsive.ts';
import { defineBreakpoints } from './defineBreakpoints.ts';
import { responsiveMetadataKey } from './responsiveMetadataKey.ts';

describe('createResponsive', () => {
  it('creates responsive values for defined breakpoints', () => {
    const breakpoints = defineBreakpoints({ small: '400px', medium: '1000px' });
    const responsive = createResponsive(breakpoints);

    expect(responsive({ base: '10px', small: '12px', medium: '15px' })).toEqual(
      {
        base: '10px',
        small: '12px',
        medium: '15px',
      },
    );
  });

  it('allows a base value with only the breakpoint overrides needed by a token', () => {
    const breakpoints = defineBreakpoints({ small: '400px', medium: '1000px' });
    const responsive = createResponsive(breakpoints);

    expect(responsive({ base: 10, medium: 15 })).toEqual({
      base: 10,
      medium: 15,
    });
  });

  it('supports responsive values nested inside a token group', () => {
    const breakpoints = defineBreakpoints({ small: '400px', medium: '1000px' });
    const responsive = createResponsive(breakpoints);
    const padding = {
      box: responsive({
        base: '10px',
        small: '12px',
        medium: '15px',
      }),
    };

    expect(padding).toEqual({
      box: {
        base: '10px',
        small: '12px',
        medium: '15px',
      },
    });
    expect(padding.box.base).toBe('10px');
    expect(padding.box.small).toBe('12px');
    expect(padding.box.medium).toBe('15px');
    expectTypeOf(padding.box.base).toEqualTypeOf<string>();
    expectTypeOf(padding.box.small).toEqualTypeOf<string>();
    expectTypeOf(padding.box.medium).toEqualTypeOf<string>();
  });

  it('retains breakpoint metadata without exposing it as a token value', () => {
    const breakpoints = defineBreakpoints({ small: '400px', medium: '1000px' });
    const responsive = createResponsive(breakpoints);
    const value = responsive({ base: '10px', small: '12px' });

    expect(
      Object.getOwnPropertyDescriptor(value, responsiveMetadataKey),
    ).toMatchObject({
      enumerable: false,
      value: { breakpoints },
    });
    expect(Object.keys(value)).toEqual(['base', 'small']);
  });
});
