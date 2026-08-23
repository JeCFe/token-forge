import { describe, expect, it } from 'vitest';
import { createGradientPrelude } from './createGradientPrelude';

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
