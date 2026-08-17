# @jecfe/token-forge

Convert TypeScript design-token objects into CSS custom properties.

## Recommended usage

Use `defineTokens` when creating tokens. It validates the supported shape at
compile time and preserves the useful inferred type of the object. The result
is the value that will be passed to `toCssFile`.

```ts
import { defineTokens } from '@jecfe/token-forge';

const tokens = defineTokens({
  color: {
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
  --color-primary: #3366ff;
  --color-text: #111111;
  --spacing-small: 8px;
  --spacing-large: 24px;
}
```

`Tokens` is also exported for cases where an explicit annotation is
useful:

```ts
import type { Tokens } from '@jecfe/token-forge';

const tokens: Tokens = {
  color: {
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
