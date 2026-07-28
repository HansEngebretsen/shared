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

3. Insert the component where you want the footer to display:
```html
<!-- Default version -->
<hans-footer></hans-footer>

<!-- Version with GitHub source link -->
<hans-footer github-url="https://github.com/HansEngebretsen/score"></hans-footer>
```
