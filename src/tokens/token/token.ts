import type { Token } from '@/tokens';

/**
 * Creates an explicit design-token node.
 *
 * Keep the returned object and pass it to {@link alias} when another token
 * should refer to this value.
 */
export const token = <T>(value: T): Token<T> => ({
  kind: 'token',
  value,
});
