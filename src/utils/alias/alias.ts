import type { TokenAlias, TokenReference } from '@/tokens';

/**
 * Creates a design-token alias while retaining the token it refers to.
 *
 * The resolved value is available through `value`; `target` preserves the
 * relationship for tools that need to inspect or serialise the token graph.
 */
export const alias = <T>(target: TokenReference<T>): TokenAlias<T> => ({
  kind: 'alias',
  target,
  get value() {
    return target.value;
  },
});
