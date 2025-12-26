# 🍺 The Beer Name Generator

A fun web application that generates creative beer names and descriptions, complete with Midjourney image generation capabilities for creating unique beer label art! 

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)

## ✨ Features

- 🎲 **Random Beer Name Generation** - Generate unique and creative beer names with matching descriptions
- ⏱️ **Auto-Generate Mode** - Automatically creates new names every 10 seconds
- 🌙 **Dark Mode Support** - Easy on the eyes with a beautiful dark theme
- 📜 **History Tracking** - Keep track of all your generated beer names
- 🎨 **Midjourney Integration** - Generate stunning beer label images via Discord
- ⌨️ **Keyboard Shortcuts** - Press Space bar to quickly generate a new beer
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop devices

## 📁 Project Structure

```
TheBeerNameGenerator/
├── public/                    # Client-side assets
│   ├── index.html            # Main application page
│   ├── main.js               # Main application logic
│   ├── structure.html        # Visual structure overview (Mermaid)
│   └── beer_data.json        # Beer-related data for name generation
├── src/                       # Source code
│   ├── js/
│   │   ├── midjourney-integration.js
│   │   └── utils.js
│   ├── css/
│   │   └── styles.css
│   └── assets/               # Images and other assets
├── config/                    # Configuration files
└── docs/                      # Documentation
```

## 🚀 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YoshKoz/TheBeerNameGenerator.git
   cd TheBeerNameGenerator
   ```

2. **Serve the application:**

   No build process is required!  Simply open `public/index.html` in your browser or use a local server: 

   ```bash
   npx serve public
   ```

## 🎮 How to Use

1. Open `public/index.html` in your web browser
2. Click **"Generate"** to create a new beer name and description
3. Click **"Auto Generate"** to automatically create new names every 10 seconds
4. Use the **history panel** to view and restore previously generated names
5. Toggle **dark mode** using the button in the status bar
6. Press **Space bar** to quickly generate a new beer name

### 📊 Visual Structure

Open `public/structure.html` to view a Mermaid-based visual overview of the app's files and data flow.

## 🎨 Midjourney Integration Setup

To use the image generation feature, you need to set up a Discord webhook with Midjourney: 

1. Create or use an existing Discord server
2. Add the [Midjourney bot](https://www.midjourney. com/home/) to your server
3. Create a webhook: 
   - Go to **Server Settings** > **Integrations** > **Webhooks**
   - Click **"New Webhook"**
   - Name it "Beer Image Generator"
   - Choose your target channel
   - Copy the webhook URL
4. Open `src/js/midjourney-integration.js` and replace `YOUR_DISCORD_WEBHOOK_URL` with your webhook URL

### How Image Generation Works

1. Click **"Generate Image"** to send a prompt to your Discord server via webhook
2. The prompt includes the `/imagine` command with a description based on your beer name
3. Midjourney bot processes the prompt and generates the image
4. The image appears in your Discord channel

> ⚠️ **Note:** An active Midjourney subscription is required.  Images are generated in Discord, not directly in the web app.  Keep your webhook URL private! 

## 🛠️ Technologies Used

- **HTML5, CSS3, JavaScript** - Core web technologies
- **LocalStorage** - History persistence
- **Discord Webhooks** - Midjourney integration
- **Midjourney AI** - Image generation

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with 🍻 by [YoshKoz](https://github.com/YoshKoz)
