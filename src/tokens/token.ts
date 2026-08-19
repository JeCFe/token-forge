import type { Token, TokenAlias, TokenReference } from './types.ts';

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
