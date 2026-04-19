# TheBeerNameGenerator

A static web app that generates whimsical craft beer names by combining randomized adjectives, mythical creatures, styles, and brewing specs.

## Features

- Generates names like "The Gilded Spectral Basilisk" with full tasting notes
- Customizable adjective, category, and style filters
- Favorites list, history (last 100), and stats panel
- Dark/light mode, clipboard sharing, and keyboard shortcut (Space)
- Auto-generate mode (every 10 seconds)
- Animated bubble background

## Run

```bash
cd TheBeerNameGenerator
npm install
npm run serve
```

App starts on `http://localhost:8000`.

## Structure

```
TheBeerNameGenerator/public/
├── index.html          # App shell
├── main.js             # Core logic — generate, history, favorites
├── utils.js            # random(), articleFor(), randomMultiple()
├── beer_data.json      # Word lists (adjectives, creatures, styles, etc.)
└── styles.css          # Theming and animations
```
