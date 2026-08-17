import type { Tokens } from './types.ts';

/**
 * Defines a design-token object while preserving its inferred shape.
 *
 * This is the recommended way to create values passed to `toCssFile`.
 *
 * @example
 * ```ts
 * const tokens = defineTokens({
 *   color: { primary: '#3366ff' },
 *   spacing: { small: '8px' },
 * });
 * ```
 */
export const defineTokens = <T extends Tokens>(tokens: T): T => tokens;
