/** Formats a finite number without floating-point noise or negative zero. */
export const formatNumber = (value: number): `${number}` => {
  const rounded = Number(value.toPrecision(15));
  return (Object.is(rounded, -0) ? '0' : String(rounded)) as `${number}`;
};
