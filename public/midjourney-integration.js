// Midjourney Integration via Discord Webhook
// This file handles sending prompts to Discord for Midjourney image generation

// Configuration
const config = {
  // Replace with your Discord webhook URL where Midjourney bot is present
  webhookUrl: 'YOUR_DISCORD_WEBHOOK_URL',
  // Command prefix for Midjourney
  commandPrefix: '/imagine',
  // Maximum prompt length to prevent abuse
  maxPromptLength: 500,
  // Rate limiting - minimum time between requests (ms)
  minRequestInterval: 5000,
};

// Rate limiting state
let lastRequestTime = 0;

// Function to validate webhook URL format
function isValidWebhookUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'discord.com' || urlObj.hostname === 'discordapp.com';
  } catch {
    return false;
  }
}

// Function to sanitize user input for prompts
function sanitizePrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    return '';
  }
  
  // Normalize Unicode, neutralize mentions/markdown, strip risky params/URLs, and normalize whitespace
  let sanitized = prompt
    .normalize('NFKC')
    // Break Discord-wide mentions
    .replace(/@everyone|@here/gi, (m) => m.replace('@', '@ '))
    // Remove explicit mention/channel patterns (defense-in-depth)
    .replace(/<@!?\d+>|<@&\d+>|<#\d+>/g, '')
    // Remove Markdown control characters that could affect formatting
    .replace(/[`*_~|]/g, '')
    // Remove potentially harmful characters
    .replace(/[<>"`'{}]/g, '')
    // Strip common Midjourney parameter patterns (e.g., --ar, --no, --style)
    .replace(/\s--[a-zA-Z0-9-_.:]+(\s+\S+)?/g, ' ')
    // Remove URLs
    .replace(/https?:\/\/[^\s]+/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();

  // Enforce length limit
  return sanitized.substring(0, config.maxPromptLength);
}

// Function to generate an image using Midjourney via Discord webhook
async function generateMidjourneyImage(prompt) {
  // Check rate limiting
  const now = Date.now();
  if (now - lastRequestTime < config.minRequestInterval) {
    const waitTime = Math.ceil((config.minRequestInterval - (now - lastRequestTime)) / 1000);
    const errorMsg = `Please wait ${waitTime} seconds before generating another image.`;
    console.warn(errorMsg);
    showToast(errorMsg, 3000, 'warning');
    return Promise.reject(new Error(errorMsg));
  }

  // Validate webhook URL
  if (!config.webhookUrl || config.webhookUrl === 'YOUR_DISCORD_WEBHOOK_URL') {
    const errorMsg = 'Discord webhook URL not configured. Please set it in the midjourney-integration.js file.';
    console.error(errorMsg);
    showToast(errorMsg, 5000, 'error');
    return Promise.reject(new Error(errorMsg));
  }

  // Additional webhook URL validation
  if (!isValidWebhookUrl(config.webhookUrl)) {
    const errorMsg = 'Invalid Discord webhook URL format. Please check your configuration.';
    console.error(errorMsg);
    showToast(errorMsg, 5000, 'error');
    return Promise.reject(new Error(errorMsg));
  }

  // Sanitize and validate prompt
  const sanitizedPrompt = sanitizePrompt(prompt);
  if (!sanitizedPrompt) {
    const errorMsg = 'Invalid prompt: Prompt must be a non-empty string';
    console.error(errorMsg);
    showToast(errorMsg, 3000, 'error');
    return Promise.reject(new Error(errorMsg));
  }

  // Update last request time for rate limiting
  lastRequestTime = now;

  try {
    // Create the full prompt with the Midjourney command using sanitized input
    const fullPrompt = `${config.commandPrefix} prompt: ${sanitizedPrompt}`;

    // Check if axios is available
    if (typeof axios !== 'function' && (!axios || !axios.post)) {
      throw new Error('Axios library not loaded. Make sure axios is included before this script.');
    }

    // Send the prompt to Discord webhook with timeout
    const response = await axios.post(config.webhookUrl, {
      content: fullPrompt,
      // You can customize the username that will appear in Discord
      username: 'Beer Image Generator',
    }, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Beer-Name-Generator/1.0'
      }
    });

    // Check response status
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Discord webhook returned status ${response.status}: ${response.statusText}`);
    }

    // Show success message with ARIA live region for accessibility
    showToast('Prompt sent to Midjourney! Check your Discord channel for the generated image.', 3000, 'success');

    // Return the response
    return response.data;
  } catch (error) {
    // Reset rate limiting on error to allow retry
    lastRequestTime = 0;
    
    // Handle specific error types with more detail
    let errorMessage = 'Failed to generate image: ';
    let errorType = 'error';

    if (error.code === 'ECONNABORTED') {
      errorMessage += 'Request timeout. Please check your internet connection and try again.';
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      
      if (status === 400) {
        errorMessage += 'Invalid webhook URL or malformed request.';
      } else if (status === 401) {
        errorMessage += 'Unauthorized. Please check your webhook URL.';
      } else if (status === 404) {
        errorMessage += 'Webhook not found. Please verify your Discord webhook URL.';
      } else if (status === 429) {
        errorMessage += 'Rate limited by Discord. Please wait before trying again.';
        errorType = 'warning';
      } else if (status >= 500) {
        errorMessage += 'Discord server error. Please try again later.';
      } else {
        errorMessage += `Server error ${status}: ${error.response.statusText}`;
      }
      
      console.error('Discord webhook error response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage += 'No response from Discord server. Please check your internet connection and webhook URL.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage += error.message || 'Unknown error occurred';
    }

    console.error('Error generating image with Midjourney:', {
      message: error.message,
      code: error.code,
      config: error.config ? { url: error.config.url, timeout: error.config.timeout } : undefined
    });
    
    showToast(errorMessage, 5000, errorType);
    return Promise.reject(error);
  }
}

// Function to generate an image based on the current beer description
function generateImageForCurrentBeer() {
  try {
    // Check if showToast function exists
    if (typeof showToast !== 'function') {
      console.error('showToast function not found. Make sure main.js is loaded before this script.');
      alert('Error: Toast notification system not available');
      return;
    }

    // Check if currentBeer exists
    if (!window.currentBeer && !currentBeer) {
      showToast('Please generate a beer first!', 3000, 'warning');
      return;
    }

    // Use the global or local currentBeer object
    const beer = window.currentBeer || currentBeer;

    // Extract a shorter version of the beer name for the prompt
    if (!beer.name) {
      showToast('Beer name not found in the current beer object', 3000, 'error');
      return;
    }

    const beerTitle = beer.name.split(',')[0]; // Just use the first part of the description

    // Create a prompt for Midjourney
    const prompt = `A photorealistic beer label for "${beerTitle}", craft beer, high quality, detailed, professional design`;

    // Get the button element
    const generateImageBtn = document.getElementById('generate-image-btn');
    if (!generateImageBtn) {
      console.error('Generate image button not found in the DOM');
      showToast('UI Error: Generate image button not found', 3000, 'error');
      return;
    }

    // Show loading state
    generateImageBtn.disabled = true;
    generateImageBtn.setAttribute('aria-busy', 'true');
    generateImageBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Generating...';

    // Generate the image
    generateMidjourneyImage(prompt)
      .catch(error => {
        console.error('Error in generateImageForCurrentBeer:', error);
        // Error is already handled in generateMidjourneyImage
      })
      .finally(() => {
        // Reset button state if the button still exists
        const btn = document.getElementById('generate-image-btn');
        if (btn) {
          btn.disabled = false;
          btn.setAttribute('aria-busy', 'false');
          btn.innerHTML = '<i class="fas fa-image" aria-hidden="true"></i> Generate Image';
        }
      });
  } catch (error) {
    console.error('Unexpected error in generateImageForCurrentBeer:', error);
    showToast(`Unexpected error: ${error.message || 'Unknown error'}`, 3000, 'error');
  }
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
