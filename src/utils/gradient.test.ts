import { describe, expect, it } from 'vitest';
import { createGradientPrelude, formatGradientStop } from './gradient.ts';

describe('formatGradientStop', () => {
  it('returns a plain colour unchanged', () => {
    expect(formatGradientStop('var(--colour-primary)', 0)).toBe(
      'var(--colour-primary)',
    );
  });

  it('formats an object without a position', () => {
    expect(formatGradientStop({ colour: '#3366ff' }, 0)).toBe('#3366ff');
  });

  it('formats one position', () => {
    expect(formatGradientStop({ colour: '#3366ff', position: '20%' }, 1)).toBe(
      '#3366ff 20%',
    );
  });

  it('formats two positions', () => {
    expect(
      formatGradientStop({ colour: '#3366ff', position: ['20%', '40%'] }, 1),
    ).toBe('#3366ff 20% 40%');
  });

  it.each([
    ['', 2],
    [{ colour: '' }, 2],
    [{ colour: 'red', position: '' }, 2],
    [{ colour: 'red', position: ['20%', ''] }, 2],
  ] as const)('rejects an empty stop fragment in %#', (stop, index) => {
    expect(() => formatGradientStop(stop, index)).toThrow(TypeError);
  });
});

describe('createGradientPrelude', () => {
  it('creates a linear prelude', () => {
    expect(
      createGradientPrelude({
        type: 'linear',
        direction: 'to right',
        stops: ['red', 'blue'],
      }),
    ).toBe('to right');
  });

  it('creates a radial prelude', () => {
    expect(
      createGradientPrelude({
        type: 'radial',
        shape: 'circle',
        size: 'closest-side',
        position: '30% 40%',
        stops: ['red', 'blue'],
      }),
    ).toBe('circle closest-side at 30% 40%');
  });

  it('creates a conic prelude', () => {
    expect(
      createGradientPrelude({
        type: 'conic',
        from: '45deg',
        position: 'center',
        stops: ['red', 'blue'],
      }),
    ).toBe('from 45deg at center');
  });

  it.each([
    { type: 'linear', stops: ['red', 'blue'] } as const,
    { type: 'radial', stops: ['red', 'blue'] } as const,
    { type: 'conic', stops: ['red', 'blue'] } as const,
  ])('returns no prelude when configuration is omitted in %#', (options) => {
    expect(createGradientPrelude(options)).toBeUndefined();
  });

  it.each([
    { type: 'linear', direction: '', stops: ['red', 'blue'] } as const,
    { type: 'radial', size: '', stops: ['red', 'blue'] } as const,
    { type: 'radial', position: '', stops: ['red', 'blue'] } as const,
    { type: 'conic', from: '', stops: ['red', 'blue'] } as const,
    { type: 'conic', position: '', stops: ['red', 'blue'] } as const,
  ])('rejects an empty prelude fragment in %#', (options) => {
    expect(() => createGradientPrelude(options)).toThrow(TypeError);
  });
});
