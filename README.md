# The Beer Name Generator

A web application that generates creative beer names and descriptions. Now with Midjourney image generation capabilities!

## Features

- Generate random beer names and descriptions
- Auto-generate names every 10 seconds
- Dark mode support
- History tracking of generated names
- Generate beer label images using Midjourney via Discord

## How to Use

1. Open `lists/TheBeerNameGenerator.html` in your web browser
2. Click "Generate" to create a new beer name and description
3. Click "Generate Image" to create a beer label image based on the current beer name

## Setting Up Midjourney Integration

To use the image generation feature, you need to set up a Discord webhook and have Midjourney bot in your Discord server:

1. Create a Discord server or use an existing one
2. Add the Midjourney bot to your server (https://www.midjourney.com/home/)
3. Create a webhook in your Discord server:
   - Go to Server Settings > Integrations > Webhooks
   - Click "New Webhook"
   - Name it "Beer Image Generator"
   - Choose the channel where you want the images to appear
   - Copy the webhook URL
4. Open `lists/midjourney-integration.js` and replace `YOUR_DISCORD_WEBHOOK_URL` with your actual webhook URL

## How the Image Generation Works

1. When you click "Generate Image", the application sends a prompt to your Discord server via the webhook
2. The prompt includes the Midjourney command `/imagine` followed by a description based on your beer name
3. Midjourney bot in your Discord server processes the prompt and generates the image
4. The image appears in your Discord channel

## Notes

- You need an active Midjourney subscription to use the image generation feature
- The image generation happens in Discord, not directly in the web application
- Make sure to keep your webhook URL private to prevent unauthorized use

## Technologies Used

- HTML, CSS, JavaScript
- Discord Webhooks
- Midjourney AI