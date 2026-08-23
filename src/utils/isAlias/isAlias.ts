import type { TokenAlias } from '@/tokens';
import { isObject } from '@/utils/isObject';
import { isToken } from '@/utils/isToken';

const hasTokenReferenceShape = (value: unknown): boolean => {
  const visited = new Set<Record<PropertyKey, unknown>>();
  let current = value;

  while (isObject(current)) {
    if (isToken(current)) return true;
    if (
      current.kind !== 'alias' ||
      !('target' in current) ||
      !('value' in current)
    ) {
      return false;
    }
    // A repeated node confirms an alias chain with a cycle. It is still an
    // alias; resolveToken is responsible for rejecting circular resolution.
    if (visited.has(current)) return true;

    visited.add(current);
    current = current.target;
  }

  return false;
};

/** Returns whether an unknown value is a design-token alias. */
export const isAlias = (value: unknown): value is TokenAlias<unknown> =>
  isObject(value) && value.kind === 'alias' && hasTokenReferenceShape(value);
