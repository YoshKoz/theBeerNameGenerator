# The Beer Name Generator

A web application that generates creative beer names and descriptions. Now with Midjourney image generation capabilities!

## Features

- Generate random beer names and descriptions
- Auto-generate names every 10 seconds
- Dark mode support
- History tracking of generated names
- Generate beer label images using Midjourney via Discord
- Keyboard shortcuts (Space bar to generate new beer)
- Responsive design for mobile and desktop

## Project Structure

The project has been reorganized with a cleaner structure:

- `public/` - Contains the main HTML file and client-side assets
  - `index.html` - The main application page
  - `main.js` - Main application logic
  - `beer_data.json` - Beer-related data for name generation
- `src/` - Source code directory
  - `js/` - JavaScript files
    - `midjourney-integration.js` - Integration with Midjourney
    - `utils.js` - Utility functions
  - `css/` - Stylesheets
    - `styles.css` - Main application styles
  - `assets/` - Images and other assets
- `config/` - Configuration files
- `docs/` - Documentation

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/TheBeerNameGenerator.git
cd TheBeerNameGenerator
```

1. No build process is required as this is a client-side application.

1. Open `public/index.html` in your web browser or serve it using a local server:

```bash
npx serve public
```

## How to Use

1. Open `public/index.html` in your web browser
2. Click "Generate" to create a new beer name and description
3. Click "Auto Generate" to automatically create new names every 10 seconds
4. Use the history panel to view and restore previously generated names
5. Toggle dark mode using the button in the status bar
6. Press the Space bar to quickly generate a new beer name

### Visual structure

Open `public/structure.html` to view a Mermaid-based visual overview of the app's files and data flow.

## Setting Up Midjourney Integration

To use the image generation feature, you need to set up a Discord webhook and have Midjourney bot in your Discord server:

1. Create a Discord server or use an existing one
2. Add the Midjourney bot to your server (<https://www.midjourney.com/home/>)
3. Create a webhook in your Discord server:
   - Go to Server Settings > Integrations > Webhooks
   - Click "New Webhook"
   - Name it "Beer Image Generator"
   - Choose the channel where you want the images to appear
   - Copy the webhook URL
4. Open `src/js/midjourney-integration.js` and replace `YOUR_DISCORD_WEBHOOK_URL` with your actual webhook URL

## How the Image Generation Works

1. When you click "Generate Image", the application sends a prompt to your Discord server via the webhook
2. The prompt includes the Midjourney command `/imagine` followed by a description based on your beer name
3. Midjourney bot in your Discord server processes the prompt and generates the image
4. The image appears in your Discord channel

## Notes

- You need an active Midjourney subscription to use the image generation feature
- The image generation happens in Discord, not directly in the web application
- Make sure to keep your webhook URL private to prevent unauthorized use
- The application stores your generated beer names in localStorage

## Technologies Used

- HTML, CSS, JavaScript
- LocalStorage for history persistence
- Discord Webhooks
- Midjourney AI

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
