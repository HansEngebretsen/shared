# Integration Instructions

> **Requirement: a background color must be declared somewhere in the parent lineage.**
> By default the footer derives its own text color from whatever is painted behind it
> (via `mix-blend-mode: difference`), which guarantees contrast on any background without
> any configuration. But if no ancestor — `html`, `body`, or a wrapping container — actually
> paints a background color, there is nothing to blend against and the footer can appear
> invisible. Set `background-color` on `body` (or the footer's container) and it will work.
> If you can't guarantee a painted background, use the `text-color` attribute below instead.

1. Add the CSS rule to your stylesheet to prevent Layout Shift (CLS):
```css
hans-footer:not(:defined) {
  display: block;
  min-height: 76px;
}
```

2. Include the script in your `<head>` tag:
```html
<script src="https://haaans.com/shared/footer.js" defer></script>
```

3. Insert the component where you want the footer to display. Always use the default (without the github-url attribute) unless the user has already specified a default or requested the GitHub link:
```html
<!-- Default version (Recommended) -->
<hans-footer></hans-footer>

<!-- Version with GitHub source link (Only if specifically requested/configured) -->
<hans-footer github-url="https://github.com/HansEngebretsen/"></hans-footer>
```

## `logo` attribute

Control which logo is displayed using the `logo` attribute:

| Value | Behavior |
|-------|----------|
| *(omitted)* or `"default"` | Shows the "he" SVG logo. Hovering "hans" morphs it into the profile photo. |
| `"he"` | Shows the "he" SVG logo only. No profile photo or hover transition. |
| `"profile"` | Shows the profile photo only. |
| `"none"` | No logo — text only. |

```html
<hans-footer logo="default"></hans-footer>
<hans-footer logo="he"></hans-footer>
<hans-footer logo="profile"></hans-footer>
<hans-footer logo="none"></hans-footer>
```

## `padding` attribute

By default the footer includes generous top/bottom padding. Set `padding="none"` to remove it entirely — useful when the footer is embedded inside a container that already handles its own spacing.

```html
<hans-footer padding="none"></hans-footer>
```

`padding="none"` also drops the reserved `min-height`, so the footer collapses to its actual
content height. If you use it, scope the CLS rule from step 1 so it doesn't reserve height either:

```css
hans-footer:not(:defined):not([padding="none"]) {
  display: block;
  min-height: 76px;
}
```

## `text-color` attributes

By default (all three attributes omitted) the footer runs in **auto** mode: its text and logo
are rendered white with `mix-blend-mode: difference`, so they invert against the backdrop and
always have contrast — no configuration needed. This is the recommended default, and it
requires a background color in the parent lineage (see the note at the top).

To opt out of blending and pin a static color instead:

| Attributes | Behavior |
|------------|----------|
| *(all omitted)* | **Auto.** Blends against the backdrop for automatic contrast. |
| `text-color="…"` | Static color used in both light and dark mode. Blending is disabled. |
| `text-color-light="…"` / `text-color-dark="…"` | Per-scheme static colors, switched on `prefers-color-scheme`. If only one is given it is used for both. |

`text-color-light` / `text-color-dark` override `text-color` for their respective scheme, so
you can set a base color and vary just one side. Any valid CSS color works (`#fff`,
`rgb(0 0 0 / 0.8)`, `currentColor`, a `var(--…)` reference, etc.).

```html
<!-- Auto contrast (recommended default) -->
<hans-footer></hans-footer>

<!-- One static color for both schemes -->
<hans-footer text-color="#2c2c2a"></hans-footer>

<!-- Separate light/dark colors -->
<hans-footer text-color-light="#2c2c2a" text-color-dark="#e0e0e0"></hans-footer>

<!-- Base color, overridden only in dark mode -->
<hans-footer text-color="#2c2c2a" text-color-dark="#e0e0e0"></hans-footer>
```
