import type * as CSS from 'csstype';

/** A primitive value that can be emitted as a CSS custom-property value. */
export type TokenValue = string | number;

/** An explicit design token containing a value. */
export type Token<T = TokenValue> = {
  readonly kind: 'token';
  readonly value: T;
};

/** A token or alias that can be used as the target of another alias. */
export type TokenReference<T = TokenValue> = Token<T> | TokenAlias<T>;

/** An explicit reference to another token or alias. */
export type TokenAlias<T = TokenValue> = {
  readonly kind: 'alias';
  readonly target: TokenReference<T>;
  /** The value resolved from the target. */
  readonly value: T;
};

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

type BaseBorderOptions = {
  width: string;
  /** Defaults to `solid`. */
  style?: CSS.Property.BorderTopStyle;
};

/** Options for creating a conventional colour border. */
export type ColourBorderOptions = BaseBorderOptions & {
  colour: string;
  gradient?: never;
};

/** Options for creating a border drawn from a CSS gradient. */
export type GradientBorderOptions = BaseBorderOptions & {
  gradient: GradientValue;
  colour?: never;
  /** Colour used if the border image cannot be displayed. */
  fallbackColour?: string;
  /** CSS `border-image-slice` value. Defaults to `1`. */
  slice?: string;
  /** CSS `border-image-repeat` value. */
  repeat?: string;
};

/** Options accepted by {@link createBorder}. */
export type BorderOptions = ColourBorderOptions | GradientBorderOptions;

/** CSS declarations needed to render a conventional or gradient border. */
export type BorderValue = {
  border: string;
  borderImage?: string;
};

/** A complete CSS value or an ordered list of font families. */
export type FontFamily = string | readonly string[];

/** Options accepted by {@link createTypography}. */
export type TypographyOptions = {
  fontFamily?: FontFamily;
  /** A CSS font size, such as `1rem` or `var(--font-size-body)`. */
  fontSize: string;
  /** A CSS font weight keyword, custom property, or numeric weight. */
  fontWeight?: string | number;
  /** A CSS line height or a unitless numeric multiplier. */
  lineHeight: string | number;
  /** A CSS letter-spacing value. */
  letterSpacing?: string;
};

/** CSS declarations represented by a typography token. */
export type TypographyValue = {
  fontFamily?: string;
  fontSize: string;
  fontWeight?: string | number;
  lineHeight: string | number;
  letterSpacing?: string;
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
  [name: string]: TokenValue | TokenReference<unknown> | Tokens;
};
