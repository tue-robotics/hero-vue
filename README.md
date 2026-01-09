# hero-vue

[![CI][gh-actions-image]][gh-actions-url] [![NPM version][npm-version-image]][npm-version-url]

Library of Vue 3 components to be used in HERO JavaScript apps

## Features

- Vue 3 with Composition API
- TypeScript support
- Pure Rollup build system (no bundler frameworks)
- Bootstrap 5
- Font Awesome icons

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build library
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## Requirements

- Node.js >= 20

## Build Output

The library produces:
- `dist/hero-vue.esm.js` + `hero-vue.esm.css` - ES Module format
- `dist/hero-vue.ssr.js` - CommonJS format for SSR
- `dist/hero-vue.min.js` - IIFE format for browser (CSS inlined)

[gh-actions-image]: https://github.com/tue-robotics/hero-vue/actions/workflows/main.yml/badge.svg
[gh-actions-url]: https://github.com/tue-robotics/hero-vue/actions/workflows/main.yml

[npm-version-image]: https://img.shields.io/npm/v/hero-vue.svg
[npm-version-url]: https://www.npmjs.com/package/hero-vue
