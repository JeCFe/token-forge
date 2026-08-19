import type { Tokens } from '@/tokens';

/**
 * Defines a design-token object while preserving its inferred shape.
 *
 * This is the recommended way to create a token collection.
 *
 * @example
 * ```ts
 * const tokens = defineTokens({
 *   colour: { primary: '#3366ff' },
 *   spacing: { small: '8px' },
 * });
 * ```
 */
export const defineTokens = <T extends Tokens>(tokens: T): T => tokens;
