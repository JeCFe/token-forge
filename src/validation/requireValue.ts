/** Returns a string after ensuring it contains a non-whitespace value. */
export const requireValue = (value: string, name: string): string => {
  if (value.trim().length === 0) {
    throw new TypeError(`${name} must not be empty.`);
  }

  return value;
};
