import { describe, expect, expectTypeOf, it } from 'vitest';
import { isObject } from '.';

describe('isObject', () => {
  it('identifies objects and narrows their type', () => {
    const value: unknown = { colour: '#3366ff' };

    expect(isObject(value)).toBe(true);

    if (isObject(value)) {
      expectTypeOf(value).toEqualTypeOf<Record<PropertyKey, unknown>>();
      expect(value.colour).toBe('#3366ff');
    }
  });

  it.each([{}, [], new Date(), Object.create(null)])(
    'identifies object-like value %#',
    (value) => {
      expect(isObject(value)).toBe(true);
    },
  );

  it.each([null, undefined, true, 500, '#3366ff', Symbol('token'), () => {}])(
    'does not identify non-object value %#',
    (value) => {
      expect(isObject(value)).toBe(false);
    },
  );
});
