import type { GradientStop } from '@/tokens';
import { requireValue } from '@/validation';

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
