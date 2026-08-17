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

/** A CSS gradient function that can be emitted as a token value. */
export type GradientValue =
  | `linear-gradient(${string})`
  | `repeating-linear-gradient(${string})`
  | `radial-gradient(${string})`
  | `repeating-radial-gradient(${string})`
  | `conic-gradient(${string})`
  | `repeating-conic-gradient(${string})`;

/** A colour stop with one or two optional CSS positions. */
export type PositionedGradientStop = {
  colour: string;
  position?: string | readonly [string, string];
};

/** A plain colour or a colour with explicit positions in a gradient. */
export type GradientStop = string | PositionedGradientStop;

type BaseGradientOptions = {
  /** At least one stop is required at runtime. */
  stops: readonly GradientStop[];
  /** Uses the corresponding `repeating-*-gradient` CSS function. */
  repeating?: boolean;
};

/** Options for creating a linear gradient. */
export type LinearGradientOptions = BaseGradientOptions & {
  type: 'linear';
  /** A CSS angle or side/corner direction, such as `45deg` or `to right`. */
  direction?: string;
};

/** Options for creating a radial gradient. */
export type RadialGradientOptions = BaseGradientOptions & {
  type: 'radial';
  shape?: 'circle' | 'ellipse';
  /** A CSS radial size, such as `closest-side` or `40px 60px`. */
  size?: string;
  /** The position following the CSS `at` keyword. */
  position?: string;
};

/** Options for creating a conic gradient. */
export type ConicGradientOptions = BaseGradientOptions & {
  type: 'conic';
  /** The angle following the CSS `from` keyword. */
  from?: string;
  /** The position following the CSS `at` keyword. */
  position?: string;
};

/** Options accepted by {@link createGradient}. */
export type GradientOptions =
  | LinearGradientOptions
  | RadialGradientOptions
  | ConicGradientOptions;

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
