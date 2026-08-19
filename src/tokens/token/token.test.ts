import { describe, expect, expectTypeOf, it } from 'vitest';
import { token } from '.';

describe('token', () => {
  it('creates an explicit token node', () => {
    const primary = token('#3366ff');

    expect(primary).toEqual({ kind: 'token', value: '#3366ff' });
    expectTypeOf(primary.value).toEqualTypeOf<string>();
  });

  it('supports structured values', () => {
    const body = token({ fontSize: '1rem', lineHeight: 1.5 });

    expect(body.value.fontSize).toBe('1rem');
    expectTypeOf(body.value).toEqualTypeOf<{
      fontSize: string;
      lineHeight: number;
    }>();
  });
});
