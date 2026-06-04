# 🍺 The Beer Name Generator

A mythical beer name generator web application that crafts creative and unique names for your brews.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)

## ✨ Features

- **Random Beer Name Generation** — Unique, creative beer names with mythical themes
- **Beer Specifications** — Each generated beer includes:
  - Beer type and color
  - ABV and IBU ranges
  - Taste profiles and mouthfeel descriptors
  - Recommended glassware
  - Brewing techniques and occasion pairings
- **Customizable Filters** — Lock in specific categories, adjectives, or styles
- **Auto Generate Mode** — New beer names at 10-second intervals
- **Beer History** — Last 100 generated beers (persisted to localStorage)
- **Favorites** — Save up to 25 favorites
- **Dark/Light Theme** — Toggle between modes (persisted)
- **Share** — Web Share API with clipboard fallback
- **Image Prompt** — Copies DALL·E-compatible prompt and opens ChatGPT
- **Animated UI** — Bubble animations (respects `prefers-reduced-motion`)
- **Keyboard Shortcut** — Press Space to generate
- **Stats Panel** — Top 3 categories, total brewed, unique names

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm (comes with Node.js)

### Installation

```bash
git clone https://github.com/YoshKoz/TheBeerNameGenerator.git
cd TheBeerNameGenerator
npm install
```

### Running the Application

```bash
npm run serve
```

Starts a local dev server at `http://localhost:3000`.

## 📁 Project Structure

```
TheBeerNameGenerator/
├── public/
│   ├── index.html          # App shell (semantic HTML, ARIA)
│   ├── main.js             # Core logic — generation, history, favorites, stats
│   ├── utils.js            # random(), articleFor(), pluralize(), randomMultiple()
│   ├── ui-effects.js       # Bubble animations, visual effects
│   ├── validation.js       # Input validation, sanitization
│   ├── beer_data.js        # Word lists (ES module, 15 categories)
│   ├── beer_data.json      # Word lists (pure JSON reference)
│   ├── styles.css          # CSS @layer, nesting, oklch() colors
│   └── favicon.ico         # Site favicon
├── .github/                # GitHub Copilot instructions
├── package.json            # Scripts and dev dependencies
├── eslint.config.js        # ESLint 9 flat config (ES2025)
├── .prettierrc             # Prettier formatting config
├── commitlint.config.cjs   # Conventional commit enforcement
├── IMPROVEMENTS.md         # Refactoring changelog (May 2026)
└── README.md               # This file
```

## 🛠️ Scripts

| Script               | Description                           |
| -------------------- | ------------------------------------- |
| `npm run serve`      | Start dev server on `:3000`           |
| `npm run lint`       | Lint JavaScript files                 |
| `npm run lint:fix`   | Auto-fix lint issues                  |
| `npm run format`     | Check code formatting                 |
| `npm run format:fix` | Auto-format all files                 |
| `npm run check`      | Run lint + format checks              |

## 🎨 Tech Stack (2026)

| Concern    | Choice                                  |
|------------|-----------------------------------------|
| Runtime    | Vanilla JS (ES2025), no bundler         |
| CSS        | @layer, nesting, oklch(), logical props |
| Linting    | ESLint 9 (flat config)                  |
| Formatting | Prettier 3                              |
| Icons      | Font Awesome 6.5                        |
| Fonts      | Google Fonts (Playfair Display, Inter)  |

## 🔧 Development

### Code Quality

- **ESLint 9** — Flat config, ES2025 target
- **Prettier** — Consistent code formatting
- **Commitlint** — [Conventional Commits](https://www.conventionalcommits.org/)

### Commit Convention

```
type(scope): description
```

Examples:
- `feat: add new beer category data`
- `fix: resolve bubble animation performance`
- `docs: update README with new scripts`

## 📝 License

MIT License.

## 👤 Author

**Yoshi Tacke**

---

_Craft the perfect name for your brew!_ 🍻
