# @jecfe/token-forge

## Recommended usage

Use `defineTokens` when creating tokens. It validates the supported shape at
compile time and preserves the useful inferred type of the object.

```ts
import { defineTokens } from '@jecfe/token-forge';

const tokens = defineTokens({
  colour: {
    primary: '#3366ff',
    text: '#111111',
  },
  spacing: {
    small: '8px',
    large: '24px',
  },
});
```

`Tokens` is also exported for cases where an explicit annotation is
useful:

```ts
import type { Tokens } from '@jecfe/token-forge';

const tokens: Tokens = {
  colour: {
    primary: '#3366ff',
  },
};
```

Prefer `defineTokens` for normal usage because it retains more specific
property names and gives better editor autocomplete.

## Explicit tokens and aliases

Use `token()` when the relationship between primitive and semantic tokens
needs to be retained. `alias()` accepts the token itself, so references are
type-safe and refactor-friendly without string paths:

```ts
import { alias, defineTokens, token } from '@jecfe/token-forge';

const palette = defineTokens({
  blue: {
    500: token('#3366ff'),
  },
});

const tokens = defineTokens({
  primary: alias(palette.blue['500']),
});

tokens.primary.value; // '#3366ff'
tokens.primary.target === palette.blue['500']; // true
```

Aliases can target other aliases. Their `value` always resolves through the
target, while `target` retains each link in the relationship. Raw values remain
supported, so explicit nodes can be introduced only where relationship data is
useful.

Use `isToken()` and `isAlias()` when inspecting an unknown value or walking a
token collection. Both functions narrow the value to the corresponding
TypeScript type:

```ts
import { isAlias, isToken } from '@jecfe/token-forge';

if (isToken(value)) {
  console.log(value.value);
}

if (isAlias(value)) {
  console.log(value.target);
}
```

`resolveToken()` accepts either a token or an alias and returns its final value,
including through alias chains. It reports malformed targets and circular alias
relationships with an error:

```ts
import { resolveToken } from '@jecfe/token-forge';

resolveToken(tokens.primary); // '#3366ff'
```

## Size units

Use `createSize` to define how many pixels equal one rem and create size values
that expose both units:

```ts
import { createSize, defineTokens } from '@jecfe/token-forge';

const size = createSize(16);

const sizes = defineTokens({
  '100': size(16),
  '200': size(32),
});

sizes['100'].px; // '16px'
sizes['100'].rem; // '1rem'
```

Size inputs may be positive, zero, or negative. The configured pixel-to-rem
base must remain positive.

## Gradients

Use `createGradient` to build CSS-ready linear, radial, or conic gradient token
values. Stops can be plain colours or objects with one or two positions:

```ts
import { createGradient, defineTokens } from '@jecfe/token-forge';

const tokens = defineTokens({
  gradient: {
    hero: createGradient({
      type: 'linear',
      direction: '135deg',
      stops: [
        { colour: '#3366ff', position: '0%' },
        { colour: '#8a2be2', position: ['60%', '80%'] },
        { colour: '#ff1493', position: '100%' },
      ],
    }),
    spotlight: createGradient({
      type: 'radial',
      shape: 'circle',
      position: 'center',
      stops: ['white', 'transparent'],
    }),
  },
});
```

Set `repeating: true` to create a repeating gradient. CSS fragments remain
open-ended, so values such as `var(--colour-primary)`, modern colour functions,
angles, and keyword positions can be used directly. A gradient must contain at
least one stop.

Gradient configuration remains typed as strings so the library does not
duplicate the CSS grammar. This also leaves custom properties and new CSS
syntax available without requiring library updates.

When one stop is supplied, it is emitted twice to produce a valid solid-colour
CSS gradient.

## Borders

Use `createBorder` to create conventional or gradient border declarations. It
always returns a `border` value and adds `borderImage` when a gradient is used:

```ts
import { createBorder, createGradient, defineTokens } from '@jecfe/token-forge';

const gradient = createGradient({
  type: 'linear',
  direction: 'to right',
  stops: ['#3366ff', '#8a2be2'],
});

const tokens = defineTokens({
  border: {
    subtle: createBorder({
      width: '1px',
      colour: '#d9d9d9',
    }),
    focus: createBorder({
      width: '2px',
      gradient,
    }),
  },
});

tokens.border.subtle.border; // '1px solid #d9d9d9'
tokens.border.focus.border; // '2px solid transparent'
tokens.border.focus.borderImage;
// 'linear-gradient(to right, #3366ff, #8a2be2) 1'
```

Gradient borders use CSS `border-image`. The optional `fallbackColour`,
`slice`, and `repeat` settings control the conventional fallback and the
corresponding border-image shorthand values.

## Typography

Use `createTypography` to compose related CSS typography declarations into a
token. It does not download or register font files. The consuming application
must make custom fonts available, for example with `@font-face`:

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

Font loading can instead be handled by a font provider, framework loader, or
system font stack. Once available, a font family can be stored as a normal
token and composed into typography:

```ts
import { createTypography, defineTokens } from '@jecfe/token-forge';

const font = defineTokens({
  family: {
    body: 'Inter, Arial, sans-serif',
  },
});

const tokens = defineTokens({
  typography: {
    body: createTypography({
      fontFamily: font.family.body,
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    }),
  },
});

tokens.typography.body;
// {
//   fontFamily: 'Inter, Arial, sans-serif',
//   fontSize: '1rem',
//   fontWeight: 400,
//   lineHeight: 1.5,
//   letterSpacing: '0.01em',
// }
```

The `fontFamily` option also accepts an ordered list such as
`['Inter', 'Arial', 'sans-serif']` and joins it into a CSS font-family value.
Both `fontFamily` and `fontWeight` are optional, so a typography token can also
represent a font-size scale containing only `fontSize` and `lineHeight`. CSS
custom properties can be used for any string value. Numeric font weights must
be between `1` and `1000`, and numeric line heights must be non-negative.
