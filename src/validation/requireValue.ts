import { requireFiniteNumber } from './requireFiniteNumber.ts';

/** Ensures a string is non-empty or a number is finite. */
export const requireValue = <T extends string | number>(
  value: T,
  name: string,
): T => {
  if (typeof value === 'string') {
    if (value.trim().length === 0) {
      throw new TypeError(`${name} must not be empty.`);
    }
  }

  if (typeof value === 'number') {
    requireFiniteNumber(value, name);
  }

  return value;
};
