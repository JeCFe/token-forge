import { describe, expect, expectTypeOf, it } from 'vitest';
import { defineTokens, type GradientValue } from '@/tokens';
import { createGradient } from '.';

describe('createGradient', () => {
  it('creates a linear gradient from plain colour stops', () => {
    expect(
      createGradient({ type: 'linear', stops: ['#3366ff', '#8a2be2'] }),
    ).toBe('linear-gradient(#3366ff, #8a2be2)');
  });

  it('adds a linear direction and positioned colour stops', () => {
    expect(
      createGradient({
        type: 'linear',
        direction: 'to right',
        stops: [
          { colour: '#3366ff', position: '0%' },
          { colour: '#8a2be2', position: ['60%', '80%'] },
          { colour: '#ff1493', position: '100%' },
        ],
      }),
    ).toBe(
      'linear-gradient(to right, #3366ff 0%, #8a2be2 60% 80%, #ff1493 100%)',
    );
  });

  it('creates a configured radial gradient', () => {
    expect(
      createGradient({
        type: 'radial',
        shape: 'circle',
        size: 'closest-side',
        position: '30% 40%',
        stops: ['white', 'transparent'],
      }),
    ).toBe(
      'radial-gradient(circle closest-side at 30% 40%, white, transparent)',
    );
  });

  it('creates a repeating conic gradient', () => {
    expect(
      createGradient({
        type: 'conic',
        from: '45deg',
        position: 'center',
        repeating: true,
        stops: [
          { colour: 'var(--colour-primary)', position: '0deg' },
          { colour: 'transparent', position: '30deg' },
        ],
      }),
    ).toBe(
      'repeating-conic-gradient(from 45deg at center, var(--colour-primary) 0deg, transparent 30deg)',
    );
  });

  it('returns a typed value that can be composed into tokens', () => {
    const tokens = defineTokens({
      gradient: {
        hero: createGradient({
          type: 'linear',
          direction: '135deg',
          stops: ['#3366ff', '#8a2be2'],
        }),
      },
    });

    expect(tokens.gradient.hero).toBe(
      'linear-gradient(135deg, #3366ff, #8a2be2)',
    );
    expectTypeOf(tokens.gradient.hero).toEqualTypeOf<GradientValue>();
  });

  it('accepts CSS configuration values', () => {
    expect(
      createGradient({
        type: 'radial',
        shape: 'ellipse',
        size: '40px 60px',
        position: 'left 1rem top 20%',
        stops: [
          { colour: 'white', position: 'calc(10% + 2px)' },
          { colour: 'transparent', position: '100%' },
        ],
      }),
    ).toBe(
      'radial-gradient(ellipse 40px 60px at left 1rem top 20%, white calc(10% + 2px), transparent 100%)',
    );

    expect(
      createGradient({
        type: 'conic',
        from: 'var(--gradient-angle)',
        position: 'center',
        stops: [
          { colour: 'red', position: '0deg' },
          { colour: 'blue', position: '75%' },
        ],
      }),
    ).toBe(
      'conic-gradient(from var(--gradient-angle) at center, red 0deg, blue 75%)',
    );
  });

  it('does not mutate the supplied stops', () => {
    const stops = [
      { colour: 'red', position: '0%' },
      { colour: 'blue', position: '100%' },
    ] as const;

    createGradient({ type: 'linear', stops });

    expect(stops).toEqual([
      { colour: 'red', position: '0%' },
      { colour: 'blue', position: '100%' },
    ]);
  });

  it('creates a solid-colour gradient from one stop', () => {
    expect(createGradient({ type: 'linear', stops: ['red'] })).toBe(
      'linear-gradient(red, red)',
    );
  });

  it('duplicates a positioned single stop without mutating it', () => {
    const stop = { colour: 'red', position: '20%' } as const;

    expect(createGradient({ type: 'radial', stops: [stop] })).toBe(
      'radial-gradient(red 20%, red 20%)',
    );
    expect(stop).toEqual({ colour: 'red', position: '20%' });
  });

  it('requires at least one stop', () => {
    expect(() => createGradient({ type: 'linear', stops: [] })).toThrow(
      new RangeError('A gradient requires at least one colour stop.'),
    );
  });

  it.each([
    { type: 'linear', direction: '', stops: ['red', 'blue'] } as const,
    { type: 'linear', stops: ['', 'blue'] } as const,
    {
      type: 'radial',
      stops: [{ colour: 'red', position: '' }, 'blue'],
    } as const,
    { type: 'conic', from: ' ', stops: ['red', 'blue'] } as const,
  ])('rejects empty CSS fragments in %#', (options) => {
    expect(() => createGradient(options)).toThrow(TypeError);
  });
});
