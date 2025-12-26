# 🍺 The Beer Name Generator

A fun web application that generates creative beer names and descriptions with mythical themes!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)

## ✨ Features

- 🎲 **Random Beer Name Generation** - Generate unique and creative beer names with matching descriptions
- ⏱️ **Auto-Generate Mode** - Automatically creates new names every 10 seconds
- 🌙 **Dark Mode Support** - Easy on the eyes with a beautiful dark theme
- 📜 **History Tracking** - Keep track of all your generated beer names
- ⌨️ **Keyboard Shortcuts** - Press Space bar to quickly generate a new beer
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop devices

## 📁 Project Structure

```
TheBeerNameGenerator/
├── public/                    # Client-side assets
│   ├── index.html            # Main application page
│   ├── main.js               # Main application logic (includes validation and UI effects)
│   ├── styles.css            # Application styles
│   ├── beer_data.json        # Beer-related data for name generation
│   └── favicon.ico           # Application icon
├── package.json              # Project dependencies and scripts
├── .prettierrc               # Code formatting configuration
├── commitlint.config.cjs     # Commit message linting
├── README.md                 # Project documentation
└── TODO.md                   # Future improvements and tasks
```

## 🚀 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YoshKoz/TheBeerNameGenerator.git
   cd TheBeerNameGenerator
   ```

2. **Serve the application:**

   No build process is required! Simply open `public/index.html` in your browser or use a local server:

   ```bash
   npx serve public
   # or
   npm run serve
   ```

## 🎮 How to Use

1. Open `public/index.html` in your web browser
2. Click **"Generate"** to create a new beer name and description
3. Click **"Auto Generate"** to automatically create new names every 10 seconds
4. Use the **history panel** to view and restore previously generated names
5. Toggle **dark mode** using the button in the status bar
6. Press **Space bar** to quickly generate a new beer name

## 🛠️ Technologies Used

- **HTML5, CSS3, JavaScript** - Core web technologies
- **LocalStorage** - History persistence
- **Prettier** - Code formatting
- **Commitlint** - Commit message linting

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with 🍻 by [YoshKoz](https://github.com/YoshKoz)
