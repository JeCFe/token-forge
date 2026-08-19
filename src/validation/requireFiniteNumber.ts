/** Returns a number after ensuring it is finite. */
export const requireFiniteNumber = (value: number, name: string): number => {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be a finite number.`);
  }

  return value;
};
