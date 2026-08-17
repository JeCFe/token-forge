# @jecfe/token-forge

Convert TypeScript design-token objects into CSS custom properties.

## Recommended usage

Use `defineTokens` when creating tokens. It validates the supported shape at
compile time and preserves the useful inferred type of the object. The result
is the value that will be passed to `toCssFile`.

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

Nested token names are intended to become CSS custom-property names:

```css
:root {
  --colour-primary: #3366ff;
  --colour-text: #111111;
  --spacing-small: 8px;
  --spacing-large: 24px;
}
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
