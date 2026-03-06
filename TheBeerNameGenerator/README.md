# 🍺 The Beer Name Generator

A mythical beer name generator web application that crafts creative and unique names for your brews.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)

## ✨ Features

- **Random Beer Name Generation** - Generate unique, creative beer names with mythical themes
- **Beer Specifications** - Each generated beer includes detailed specs like:
  - Beer type and color
  - ABV and IBU ranges
  - Taste profiles and mouthfeel descriptors
  - Recommended glassware
  - Brewing techniques
- **Auto Generate Mode** - Automatically generate new beer names at intervals
- **Beer History** - Keep track of all your generated beers
- **Dark/Light Theme** - Toggle between dark and light modes
- **Animated UI** - Beautiful bubble animations and visual effects
- **Responsive Design** - Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm (comes with Node.js)
- Python 3 (optional, for local server)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YoshKoz/TheBeerNameGenerator.git
   cd TheBeerNameGenerator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

**Option 1: Using Python HTTP Server**

```bash
npm run serve
```

This starts a local server at `http://localhost:8000`

**Option 2: Using npx serve**

```bash
npm run serve-alt
```

Then open your browser and navigate to the local server URL.

## 📁 Project Structure

```
TheBeerNameGenerator/
├── public/
│   ├── index.html       # Main HTML file
│   ├── main.js          # Core application logic
│   ├── styles.css       # Styling and animations
│   ├── beer_data.json   # Beer data (categories, adjectives, types, etc.)
│   └── favicon.ico      # Site favicon
├── .github/             # GitHub workflows and configurations
├── package.json         # Project configuration and scripts
├── commitlint.config.cjs # Commit message linting configuration
├── .prettierrc          # Prettier code formatting configuration
└── IMPROVEMENTS.md      # Documentation of code improvements
```

## 🛠️ Available Scripts

| Script                 | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `npm run serve`        | Start local development server using Python    |
| `npm run serve-alt`    | Start local development server using npx serve |
| `npm run format`       | Format all files with Prettier                 |
| `npm run format-check` | Check if files are properly formatted          |

## 🎨 Technologies Used

- **HTML5** - Structure and semantics
- **CSS3** - Styling with animations and transitions
- **Vanilla JavaScript** - Core application logic
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Playfair Display, Great Vibes, Bebas Neue, Roboto, Uncial Antiqua)

## 🔧 Development

### Code Quality Tools

- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Conventional commit message enforcement

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commit messages should follow the format:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:

- `feat: add new beer category`
- `fix: resolve bubble animation issue`
- `docs: update README`

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Yoshi Tacke**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/YoshKoz/TheBeerNameGenerator/issues).

---

_Craft the perfect name for your brew!_ 🍻
