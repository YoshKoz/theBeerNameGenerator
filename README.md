# TheBeerNameGenerator

A static web app that generates whimsical craft beer names by combining randomized adjectives, mythical creatures, styles, and brewing specs.

## Features

- Generates names like "The Gilded Spectral Basilisk" with full tasting notes
- Customizable adjective, category, and style filters
- Favorites list, history (last 100), and stats panel
- Dark/light mode, clipboard sharing, and keyboard shortcut (Space)
- Auto-generate mode (every 10 seconds)
- Animated bubble background (respects `prefers-reduced-motion`)

## Run

```bash
cd TheBeerNameGenerator
npm install
npm run serve
```

App starts on `http://localhost:3000`.

## Structure

```
TheBeerNameGenerator/
├── public/
│   ├── index.html          # App shell (semantic HTML, ARIA)
│   ├── main.js             # Core logic — generate, history, favorites, stats
│   ├── utils.js            # random(), articleFor(), pluralize(), randomMultiple()
│   ├── ui-effects.js       # Bubble animations, visual effects
│   ├── validation.js       # Input validation, sanitization, safeParseArray
│   ├── beer_data.js        # Word lists (ES module, 15 categories)
│   ├── beer_data.json      # Word lists (pure JSON reference)
│   └── styles.css          # CSS @layer, nesting, oklch() colors
├── package.json            # Scripts, dev dependencies
├── eslint.config.js        # ESLint 9 flat config (ES2025)
├── .prettierrc             # Code formatting
└── commitlint.config.cjs   # Conventional commits
```

## Tech Stack (2026)

| Concern    | Choice                                  |
|------------|-----------------------------------------|
| Runtime    | Vanilla JS (ES2025), no bundler         |
| CSS        | @layer, nesting, oklch(), logical props |
| Linting    | ESLint 9 (flat config)                  |
| Formatting | Prettier 3                              |

## Scripts

```bash
npm run serve        # Start dev server on :3000
npm run lint         # Check JS for issues
npm run lint:fix     # Auto-fix lint issues
npm run format       # Check formatting
npm run format:fix   # Auto-format all files
npm run check        # Run lint + format checks
```
