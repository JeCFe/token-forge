/** A primitive value that can be emitted as a CSS custom-property value. */
export type TokenValue = string | number;

/** A breakpoint value used to build a media-query condition. */
export type BreakpointValue = string;

/** A named collection of breakpoint values. */
export type Breakpoints = Record<string, BreakpointValue>;

/** A size represented in both pixel and rem units. */
export type SizeValue = {
  px: `${number}px`;
  rem: `${number}rem`;
};

/** A base token value with optional overrides at named breakpoints. */
export type ResponsiveValues<TBreakpoints extends Breakpoints = Breakpoints> = {
  base: TokenValue;
} & Partial<Record<keyof TBreakpoints, TokenValue>>;

/**
 * A recursively nested collection of tokens.
 *
 * Nested keys are joined with hyphens when converted to CSS custom properties.
 */
export type Tokens = {
  [name: string]: TokenValue | Tokens;
};
