import { requireValue } from '../validation/requireValue.ts';
import type { GradientOptions, GradientStop } from '../tokens/types.ts';

/** Converts one structured gradient stop into its CSS representation. */
export const formatGradientStop = (
  stop: GradientStop,
  index: number,
): string => {
  if (typeof stop === 'string') {
    return requireValue(stop, `stops[${index}]`);
  }

  const colour = requireValue(stop.colour, `stops[${index}].colour`);
  if (stop.position === undefined) {
    return colour;
  }

  const positions = Array.isArray(stop.position)
    ? stop.position
    : [stop.position];

  return `${colour} ${positions
    .map((position, positionIndex) =>
      requireValue(position, `stops[${index}].position[${positionIndex}]`),
    )
    .join(' ')}`;
};

/** Builds the optional CSS configuration that precedes gradient stops. */
export const createGradientPrelude = (
  options: GradientOptions,
): string | undefined => {
  switch (options.type) {
    case 'linear':
      return options.direction === undefined
        ? undefined
        : requireValue(options.direction, 'direction');
    case 'radial': {
      const shapeAndSize: string[] = [];

      if (options.shape !== undefined) {
        shapeAndSize.push(requireValue(options.shape, 'shape'));
      }
      if (options.size !== undefined) {
        shapeAndSize.push(requireValue(options.size, 'size'));
      }

      if (options.position !== undefined) {
        shapeAndSize.push(`at ${requireValue(options.position, 'position')}`);
      }

      return shapeAndSize.length === 0 ? undefined : shapeAndSize.join(' ');
    }
    case 'conic': {
      const parts: string[] = [];

      if (options.from !== undefined) {
        parts.push(`from ${requireValue(options.from, 'from')}`);
      }
      if (options.position !== undefined) {
        parts.push(`at ${requireValue(options.position, 'position')}`);
      }

      return parts.length === 0 ? undefined : parts.join(' ');
    }
  }
};
