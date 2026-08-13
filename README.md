# Integration Instructions

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
