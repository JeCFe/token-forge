import type { Token } from '@/tokens';
import { isObject } from '@/utils/isObject';

/** Returns whether an unknown value is an explicit design token. */
export const isToken = (value: unknown): value is Token<unknown> =>
  isObject(value) && value.kind === 'token' && 'value' in value;
