import type { GradientOptions } from '@/tokens';
import { requireValue } from '@/validation';

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
