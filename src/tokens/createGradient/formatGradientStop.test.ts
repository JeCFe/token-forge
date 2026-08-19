import { describe, expect, it } from 'vitest';
import { formatGradientStop } from './formatGradientStop';

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
