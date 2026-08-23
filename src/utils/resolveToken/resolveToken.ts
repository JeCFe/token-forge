import type { TokenAlias, TokenReference } from '@/tokens';
import { isAlias } from '@/utils/isAlias';
import { isToken } from '@/utils/isToken';

/**
 * Resolves a token or alias chain to its final value.
 *
 * @throws {RangeError} When the alias chain contains a cycle.
 * @throws {TypeError} When a malformed alias points to a non-token value.
 */
export const resolveToken = <T>(reference: TokenReference<T>): T => {
  const visited = new Set<TokenAlias<unknown>>();
  let current: unknown = reference;

  while (isAlias(current)) {
    if (visited.has(current)) {
      throw new RangeError('Circular token alias detected.');
    }

    visited.add(current);
    current = current.target;
  }

  if (!isToken(current)) {
    throw new TypeError('Token alias target must be a token or alias.');
  }

  return current.value as T;
};
