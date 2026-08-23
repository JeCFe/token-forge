import type { BorderOptions, BorderValue } from '@/tokens';
import { requireValue } from '@/validation';

/**
 * Creates the CSS declarations needed to render a colour or gradient border.
 *
 * Gradient borders use the CSS `border-image` shorthand and default to a
 * transparent conventional border with a slice value of `1`.
 *
 * @example
 * ```ts
 * const border = createBorder({
 *   width: '2px',
 *   gradient: createGradient({
 *     type: 'linear',
 *     direction: 'to right',
 *     stops: ['#3366ff', '#8a2be2'],
 *   }),
 * });
 *
 * border.border; // '2px solid transparent'
 * border.borderImage; // 'linear-gradient(to right, #3366ff, #8a2be2) 1'
 * ```
 */
export const createBorder = (options: BorderOptions): BorderValue => {
  const width = requireValue(options.width, 'width');
  const style = requireValue(options.style ?? 'solid', 'style');

  if ('gradient' in options && options.gradient !== undefined) {
    const gradient = requireValue(options.gradient, 'gradient');
    const fallbackColour = requireValue(
      options.fallbackColour ?? 'transparent',
      'fallbackColour',
    );
    const slice = requireValue(options.slice ?? '1', 'slice');
    const repeat =
      options.repeat === undefined
        ? undefined
        : requireValue(options.repeat, 'repeat');

    return {
      border: `${width} ${style} ${fallbackColour}`,
      borderImage: [gradient, slice, repeat]
        .filter((value): value is string => value !== undefined)
        .join(' '),
    };
  }

  return {
    border: `${width} ${style} ${requireValue(options.colour, 'colour')}`,
  };
};
