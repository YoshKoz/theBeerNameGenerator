// Midjourney Integration via Discord Webhook
// This file handles sending prompts to Discord for Midjourney image generation

// Configuration
const config = {
  // Replace with your Discord webhook URL where Midjourney bot is present
  webhookUrl: 'YOUR_DISCORD_WEBHOOK_URL',
  // Command prefix for Midjourney
  commandPrefix: '/imagine',
};

// Function to generate an image using Midjourney via Discord webhook
async function generateMidjourneyImage(prompt) {
  try {
    // Create the full prompt with the Midjourney command
    const fullPrompt = `${config.commandPrefix} prompt: ${prompt}`;
    
    // Send the prompt to Discord webhook
    const response = await axios.post(config.webhookUrl, {
      content: fullPrompt,
      // You can customize the username that will appear in Discord
      username: 'Beer Image Generator',
    });
    
    // Show success message
    showToast('Prompt sent to Midjourney! Check your Discord channel for the generated image.');
    
    // Return the response
    return response.data;
  } catch (error) {
    console.error('Error generating image with Midjourney:', error);
    showToast('Failed to generate image. Check console for details.');
    throw error;
  }
}

// Function to generate an image based on the current beer description
function generateImageForCurrentBeer() {
  if (!currentBeer) {
    showToast('Please generate a beer first!');
    return;
  }
  
  // Extract a shorter version of the beer name for the prompt
  const beerTitle = currentBeer.name.split(',')[0]; // Just use the first part of the description
  
  // Create a prompt for Midjourney
  const prompt = `A photorealistic beer label for "${beerTitle}", craft beer, high quality, detailed, professional design`;
  
  // Show loading state
  document.getElementById('generate-image-btn').disabled = true;
  document.getElementById('generate-image-btn').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  
  // Generate the image
  generateMidjourneyImage(prompt)
    .finally(() => {
      // Reset button state
      document.getElementById('generate-image-btn').disabled = false;
      document.getElementById('generate-image-btn').innerHTML = '<i class="fas fa-image"></i> Generate Image';
    });
}

// Function to set up event listeners for image generation
function setupImageGenerationListeners() {
  const generateImageBtn = document.getElementById('generate-image-btn');
  if (generateImageBtn) {
    generateImageBtn.addEventListener('click', generateImageForCurrentBeer);
  }
}

// Initialize the image generation functionality
function initializeMidjourneyIntegration() {
  // Set up event listeners when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupImageGenerationListeners);
  } else {
    setupImageGenerationListeners();
  }
}

// Export functions for use in the main script
window.midjourneyIntegration = {
  generateImage: generateMidjourneyImage,
  generateImageForCurrentBeer: generateImageForCurrentBeer,
  initialize: initializeMidjourneyIntegration
};

// Initialize
initializeMidjourneyIntegration();