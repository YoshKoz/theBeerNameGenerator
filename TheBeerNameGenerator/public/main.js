// Beer Name Generator - main app logic with integrated validation and UI effects
console.log('Beer Name Generator starting...');
let beerData = null;
let isDataLoaded = false;

// ============================================================================
// LOCALSTORAGE UTILITIES
// ============================================================================

/**
 * LocalStorage utility for managing beer history
 */
const LocalStorageManager = {
  HISTORY_KEY: 'beerHistory',

  /**
   * Load beer history from localStorage
   * @returns {Array} Array of beer objects or empty array if invalid/missing
   */
  loadHistory() {
    try {
      const saved = localStorage.getItem(this.HISTORY_KEY);
      if (!saved) return [];

      const parsed = JSON.parse(saved);
      // Validate the parsed data structure
      const isValid =
        typeof isValidBeerHistory === 'function'
          ? isValidBeerHistory(parsed)
          : Array.isArray(parsed) &&
            parsed.every(
              (item) =>
                item &&
                typeof item === 'object' &&
                item.name &&
                item.description
            );

      if (isValid) {
        console.log(`Loaded ${parsed.length} beers from history`);
        return parsed;
      } else {
        console.warn('Invalid history data format, starting fresh');
        this.clearHistory();
        return [];
      }
    } catch (e) {
      console.error('Could not load localStorage:', e);
      // Clear corrupted data
      this.clearHistory();
      return [];
    }
  },

  /**
   * Save beer history to localStorage
   * @param {Array} history - Array of beer objects to save
   * @returns {boolean} True if saved successfully, false otherwise
   */
  saveHistory(history) {
    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
      return true;
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
      // Return specific error info for user notification
      return {
        success: false,
        error: e.name === 'QuotaExceededError' ? 'quota' : 'unknown',
      };
    }
  },

  /**
   * Clear beer history from localStorage
   */
  clearHistory() {
    try {
      localStorage.removeItem(this.HISTORY_KEY);
    } catch (e) {
      console.warn('Could not remove localStorage data:', e);
    }
  },

  /**
   * Get or set dark mode preference
   * @param {string} [value] - Optional value to set ('enabled' or 'disabled')
   * @returns {string|null} Current value or null if getting
   */
  darkMode(value) {
    const DARK_MODE_KEY = 'darkMode';
    if (value !== undefined) {
      localStorage.setItem(DARK_MODE_KEY, value);
      return null;
    }
    return localStorage.getItem(DARK_MODE_KEY);
  },
};

// ============================================================================
// VALIDATION UTILITIES (merged from validation.js)
// ============================================================================

/**
 * Validate that a string is not empty and within length limits
 * @param {string} value - The string to validate
 * @param {number} [minLength=1] - Minimum allowed length
 * @param {number} [maxLength=1000] - Maximum allowed length
 * @returns {boolean} True if valid, false otherwise
 */
function isValidString(value, minLength = 1, maxLength = 1000) {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
}

/**
 * Validate localStorage data structure
 * @param {*} data - The data to validate
 * @returns {boolean} True if data is a valid beer history array
 */
function isValidBeerHistory(data) {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(
    (item) =>
      item &&
      typeof item === 'object' &&
      typeof item.name === 'string' &&
      typeof item.description === 'string' &&
      typeof item.id === 'string' &&
      item.specs &&
      typeof item.specs === 'object'
  );
}

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

/**
 * Apply a fade-in animation to an element
 * @param {HTMLElement} element - The element to animate
 */
function applyFadeIn(element) {
  if (!element) return;
  element.style.animation = 'none';
  setTimeout(() => (element.style.animation = 'fadeIn 0.5s ease-in'), 10);
}

/**
 * Apply a scale pop animation to an element
 * @param {HTMLElement} element - The element to animate
 * @param {number} [duration=200] - Duration of the animation in ms
 */
function applyScalePop(element, duration = 200) {
  if (!element) return;
  element.style.transform = 'scale(0.95)';
  setTimeout(() => (element.style.transform = 'scale(1)'), duration);
}

// ============================================================================
// KEYBOARD EVENT UTILITIES
// ============================================================================

/**
 * Add keyboard activation to an element (handles Enter and Space keys)
 * @param {HTMLElement} element - The element to add keyboard support to
 * @param {Function} callback - Function to call when Enter or Space is pressed
 */
function addKeyboardActivation(element, callback) {
  if (!element) return;

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback(e);
    }
  });
}

// ============================================================================
// UI EFFECTS (merged from ui-effects.js)
// ============================================================================

/**
 * Generic bubble creator that handles both types of bubbles
 * @param {string} containerId - The ID of the container element
 * @param {Object} config - Configuration for bubble creation
 * @param {string} config.className - CSS class name for the bubble
 * @param {number} config.minSize - Minimum bubble size in pixels
 * @param {number} config.maxSize - Maximum bubble size in pixels
 * @param {number} config.minDuration - Minimum animation duration in seconds
 * @param {number} config.maxDuration - Maximum animation duration in seconds
 * @param {number} config.interval - Interval between bubble creation in milliseconds
 * @param {number} config.lifetime - How long bubble lives before removal in milliseconds
 * @param {Object} [config.extraStyles] - Additional CSS styles to apply
 */
function createBubbleEffect(containerId, config) {
  const container = document.getElementById(containerId);
  if (!container) return;

  setInterval(() => {
    const bubble = document.createElement('div');
    bubble.className = config.className;

    // Calculate size
    const size =
      Math.random() * (config.maxSize - config.minSize) + config.minSize;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';

    // Common positioning
    bubble.style.left = Math.random() * 100 + '%';

    // Animation timing
    const duration =
      Math.random() * (config.maxDuration - config.minDuration) +
      config.minDuration;
    bubble.style.animationDuration = duration + 's';
    bubble.style.animationDelay = Math.random() * 2 + 's';

    // Apply extra styles if provided
    if (config.extraStyles) {
      Object.assign(bubble.style, config.extraStyles());
    }

    container.appendChild(bubble);

    // Remove bubble after lifetime expires
    setTimeout(() => bubble.remove(), config.lifetime);
  }, config.interval);
}

/**
 * Create floating bubbles inside the beer glass container
 */
function createBubbles() {
  createBubbleEffect('bubbles', {
    className: 'bubble',
    minSize: 6,
    maxSize: 18,
    minDuration: 8,
    maxDuration: 14,
    interval: 800,
    lifetime: 15000,
  });
}

/**
 * Create background bubbles that float across the entire page
 */
function createBackgroundBubbles() {
  createBubbleEffect('bubbles-bg', {
    className: 'bg-bubble',
    minSize: 10,
    maxSize: 30,
    minDuration: 12,
    maxDuration: 22,
    interval: 600,
    lifetime: 20000,
    extraStyles: () => ({
      bottom: -20 - Math.random() * 40 + 'px',
    }),
  });
}

/**
 * Set up history panel toggle functionality
 */
function setupHistoryPanelToggle() {
  const historyToggleBtn = document.getElementById('history-toggle');
  const historyPanel = document.querySelector('.history');

  if (historyToggleBtn && historyPanel) {
    const togglePanel = () => {
      const isExpanded = historyPanel.classList.contains('show');
      historyPanel.classList.toggle('show');

      historyToggleBtn.setAttribute('aria-expanded', !isExpanded);

      const newIcon = !isExpanded
        ? '<i class="fas fa-chevron-down" aria-hidden="true"></i>'
        : '<i class="fas fa-history" aria-hidden="true"></i>';
      historyToggleBtn.innerHTML = newIcon;

      const newLabel = !isExpanded ? 'Close beer history' : 'View beer history';
      historyToggleBtn.setAttribute('aria-label', newLabel);
    };

    historyToggleBtn.addEventListener('click', togglePanel);
    addKeyboardActivation(historyToggleBtn, togglePanel);
  }
}

// ============================================================================
// MAIN APPLICATION CODE
// ============================================================================

/**
 * Centralized error handler for the application
 * @param {Error} error - The error object
 * @param {string} context - Description of where the error occurred
 * @param {string} userMessage - Optional custom message to show to the user
 * @param {boolean} showToUser - Whether to show a toast notification to the user
 */
function handleError(error, context, userMessage = null, showToUser = true) {
  // Log detailed error information for debugging
  console.error(`[Error in ${context}]`, {
    message: error.message,
    stack: error.stack,
    name: error.name,
    error: error,
  });

  // If a user message is provided and showToUser is true, display it
  if (showToUser && typeof showDataLoadStatus === 'function') {
    const displayMessage =
      userMessage ||
      `An error occurred in ${context}. ${error.message || 'Please try again.'}`;
    showDataLoadStatus(displayMessage, 'error');
  }

  // Return the error for potential further handling
  return error;
}

/**
 * Load beer data from the JSON file
 * @async
 * @returns {Promise<Object>} The loaded beer data object containing categories, adjectives, etc.
 * @throws {Error} If the beer_data.json file cannot be loaded or parsed
 */
async function loadBeerData() {
  console.log('Attempting to load beer_data.json...');

  try {
    const response = await fetch('beer_data.json');

    if (response.ok) {
      const data = await response.json();
      // Check for expected keys in the JSON
      const requiredKeys = [
        'categories',
        'coolAdjectives',
        'mythicalCreatures',
        'tasteProfiles',
        'colors',
        'types',
        'beerGlasses',
        'mouthfeelDescriptors',
        'tasteNouns',
        'adverbs',
        'regions',
        'brewingTechniques',
        'ibuRanges',
        'abvRanges',
        'occasions',
      ];
      const missingKeys = requiredKeys.filter((key) => !data[key]);
      if (missingKeys.length > 0) {
        console.warn(
          `Missing required keys in JSON: ${missingKeys.join(', ')}`
        );
        showDataLoadStatus(
          `⚠️ Ontbrekende velden in beer_data.json: ${missingKeys.join(', ')}`,
          'warning'
        );
      }

      // Continue even if some non-critical fields are missing; generator will
      // surface errors later if it needs missing arrays.
      beerData = data;
      isDataLoaded = true;
      console.log('✅ Successfully loaded beer_data.json!');
      console.log(`📊 Comprehensive Data Stats:
          - Categories: ${Array.isArray(data.categories) ? data.categories.length : 0}
          - Adjectives: ${Array.isArray(data.coolAdjectives) ? data.coolAdjectives.length : 0}
          - Mythical Creatures: ${Array.isArray(data.mythicalCreatures) ? data.mythicalCreatures.length : 0}
          - Taste Profiles: ${Array.isArray(data.tasteProfiles) ? data.tasteProfiles.length : 0}
          - Colors: ${Array.isArray(data.colors) ? data.colors.length : 0}
          - Beer Glasses: ${Array.isArray(data.beerGlasses) ? data.beerGlasses.length : 0}
          - Regions: ${Array.isArray(data.regions) ? data.regions.length : 0}
          - Brewing Techniques: ${Array.isArray(data.brewingTechniques) ? data.brewingTechniques.length : 0}`);
      showDataLoadStatus(
        `✅ Bierdatabase geladen! (${Array.isArray(data.categories) ? data.categories.length : 0} categorieën)`,
        'success'
      );
      return data;
    } else {
      throw new Error(
        `Failed to load beer_data.json - HTTP ${response.status}: ${response.statusText}`
      );
    }
  } catch (error) {
    handleError(
      error,
      'loadBeerData',
      null,
      false // We'll handle user notification below
    );

    // If the page is opened via file:// protocol, provide a helpful hint
    // because fetch won't work without a local server.
    if (
      typeof window !== 'undefined' &&
      location &&
      location.protocol === 'file:'
    ) {
      showDataLoadStatus(
        '❌ Kan beer_data.json niet laden via file://. Start een lokale server (bijv. "python3 -m http.server 8000 --directory public") en open http://localhost:8000/index.html',
        'error'
      );
    } else {
      // Show generic error to user
      showDataLoadStatus(
        `❌ Fout: kan beer_data.json niet laden - ${error.message}`,
        'error'
      );
    }

    // Stop initialization - the app requires the JSON dataset to function.
    const wrappedError = new Error(
      `Beer Name Generator requires beer_data.json file. Error: ${error.message}`
    );
    wrappedError.cause = error;
    throw wrappedError;
  }
}

/**
 * Display a data loading status message to the user
 * @param {string} message - The message to display
 * @param {string} [type='info'] - The type of message ('success', 'warning', 'error', 'info')
 */
function showDataLoadStatus(message, type = 'info') {
  // Create or update status indicator
  let statusEl = document.getElementById('data-status');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.id = 'data-status';
    statusEl.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      max-width: 400px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 2px solid rgba(255,255,255,0.2);
    `;
    statusEl.setAttribute('role', 'alert');
    statusEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(statusEl);
  }

  // Style based on type
  const styles = {
    success: 'background: #4CAF50; color: white;',
    warning: 'background: #FF9800; color: white;',
    error: 'background: #f44336; color: white;',
    info: 'background: #2196F3; color: white;',
  };

  statusEl.style.cssText += styles[type] || '';
  statusEl.textContent = message;

  // Set appropriate ARIA label
  switch (type) {
    case 'error':
      statusEl.setAttribute('aria-label', 'Error: ' + message);
      break;
    case 'warning':
      statusEl.setAttribute('aria-label', 'Warning: ' + message);
      break;
    case 'success':
      statusEl.setAttribute('aria-label', 'Success: ' + message);
      break;
    default:
      statusEl.setAttribute('aria-label', 'Information: ' + message);
  }

  // Auto-hide success messages after 4 seconds, keep errors longer
  const hideDelay = type === 'error' ? 10000 : 4000;
  setTimeout(() => {
    if (statusEl && statusEl.parentNode) {
      statusEl.remove();
    }
  }, hideDelay);
}

/**
 * Ensure that beer data is loaded before proceeding
 * @async
 * @returns {Promise<Object>} The loaded beer data
 * @throws {Error} If beer data cannot be loaded or is unavailable
 */
async function ensureDataLoaded() {
  try {
    if (!isDataLoaded) {
      await loadBeerData();
    }
    if (!beerData) {
      throw new Error('Beer data is not available');
    }
    return beerData;
  } catch (error) {
    handleError(
      error,
      'ensureDataLoaded',
      'Failed to ensure beer data is loaded. Please refresh the page.'
    );
    throw error;
  }
}

/**
 * Initialize the Beer Name Generator application
 * Sets up all event listeners, loads data, and prepares the UI
 * @async
 * @returns {Promise<void>}
 */
async function initializeBeerGenerator() {
  console.log('Initializing Beer Generator...');

  try {
    // Load beer data first - REQUIRED
    await ensureDataLoaded();

    console.log(
      '🍺 Using JSON data with',
      Array.isArray(beerData.categories) ? beerData.categories.length : 0,
      'beer categories'
    );
  } catch (error) {
    handleError(
      error,
      'initializeBeerGenerator',
      '❌ FATAL: Cannot start without beer_data.json file',
      false
    );
    showDataLoadStatus(
      `❌ FATAL: Cannot start without beer_data.json file`,
      'error'
    );
    return; // Stop initialization
  }

  // Get DOM elements
  const randomNameElement = document.getElementById('random-name');
  const generateBtn = document.getElementById('generate');
  const autoGenerateBtn = document.getElementById('auto-generate');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history');
  const generationCountElement = document.getElementById('generation-count');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const beerSpecsContainer = document.getElementById('beer-specs');
  const specStyle = document.getElementById('spec-style');
  const specAbv = document.getElementById('spec-abv');
  const specIbu = document.getElementById('spec-ibu');
  const specOrigin = document.getElementById('spec-origin');

  console.log('DOM elements found:', {
    randomNameElement: !!randomNameElement,
    generateBtn: !!generateBtn,
  });

  // App state
  let autoGenerateInterval = null;
  let generatedNames = [];
  let totalGenerated = 0;
  let currentBeer = null;

  // Load saved data from localStorage
  generatedNames = LocalStorageManager.loadHistory();
  totalGenerated = generatedNames.length;

  // Utility functions
  const random = (array) => {
    if (!array || array.length === 0) {
      console.error('CRITICAL: Empty array passed to random function');
      throw new Error('Cannot select from empty array');
    }
    return array[Math.floor(Math.random() * array.length)];
  };

  // Determine the indefinite article ('a' or 'an') for a word.
  const articleFor = (word) => {
    if (!word || typeof word !== 'string') return 'a';
    const first = word.trim().toLowerCase()[0];
    return 'aeiou'.includes(first) ? 'an' : 'a';
  };

  // Basic pluralization for simple nouns (not comprehensive).
  const pluralize = (word) => {
    if (!word || typeof word !== 'string') return '';
    const w = word.trim();
    if (/s$|x$|z$|ch$|sh$/i.test(w)) return `${w}es`;
    if (/y$/i.test(w) && !/[aeiou]y$/i.test(w)) return `${w.slice(0, -1)}ies`;
    return `${w}s`;
  };

  const randomMultiple = (array, count, unique = false) => {
    if (!array || array.length === 0) {
      console.error('CRITICAL: Empty array passed to randomMultiple function');
      throw new Error('Cannot select from empty array');
    }

    if (!unique) return Array.from({ length: count }, () => random(array));

    const selected = [];
    const available = [...array];
    const limit = Math.min(count, available.length);
    for (let i = 0; i < limit; i++) {
      const index = Math.floor(Math.random() * available.length);
      selected.push(available.splice(index, 1)[0]);
    }
    return selected;
  };

  // Adjust CSS class on the main text element based on text length so
  // very long descriptions get a smaller font class applied.
  const adjustTextSize = (text) => {
    if (!randomNameElement) return;
    const sizeClass =
      text.length > 300
        ? 'smaller-text'
        : text.length > 200
          ? 'small-text'
          : text.length > 150
            ? 'medium-text'
            : '';
    // Keep base class so centering/width remain intact
    randomNameElement.className = `beer-name-text ${sizeClass}`.trim();
  };

  // Beer generation functions using loaded JSON data
  const generateTitle = () => {
    // Original-style title: The {Adjective1} {Adjective2} {MythicalCreature}
    const [adj1, adj2] = randomMultiple(beerData.coolAdjectives, 2, true);
    const creature = random(beerData.mythicalCreatures);
    return `The ${adj1} ${adj2} ${creature}`;
  };

  const generateDescription = () => {
    // Original short description format:
    // "The Wicked Gothic Ceffyl Dwr" a Torrid Gray-coloured Green Single Bock served "Fantasied" style in a Mug
    const bodyAdj = random(beerData.coolAdjectives); // e.g., Torrid
    const [color1, color2] = randomMultiple(beerData.colors, 2, true); // e.g., Gray, Green
    const styleName =
      beerData.types && beerData.types.length
        ? random(beerData.types)
        : random(beerData.categories); // e.g., Single Bock
    const styleWord = random(beerData.coolAdjectives); // e.g., Fantasied (approximate from adjectives)
    const glass = random(beerData.beerGlasses); // e.g., Mug

    const art = articleFor(bodyAdj);
    // Compose the classic compact line (without trailing extra prose)
    return `${art} ${bodyAdj} ${color1}-coloured ${color2} ${styleName} served "${styleWord}" style in a ${glass}`;
  };

  const generateSpecs = () => ({
    region: random(beerData.regions),
    technique: random(beerData.brewingTechniques),
    ibu: random(beerData.ibuRanges),
    abv: random(beerData.abvRanges),
    occasion: random(beerData.occasions),
    category: random(beerData.categories),
  });

  const generateBeer = () => {
    try {
      const specs = generateSpecs();
      const name = generateTitle();
      // Revert to original compact sentence format
      const description = `"${name}" ${generateDescription()}`;

      return {
        name,
        description,
        timestamp: new Date(),
        id: `beer-${Date.now()}`,
        specs,
      };
    } catch (error) {
      handleError(
        error,
        'generateBeer',
        'Failed to generate beer. Please ensure beer data is loaded correctly.'
      );
      throw error;
    }
  };

  // UI functions (toast + display)
  const showToast = (message, duration = 2000, type = 'info') => {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    // Set message
    toast.textContent = message;

    // style variants based on type
    toast.classList.remove('success', 'warning', 'error');
    if (type === 'success') toast.classList.add('success');
    if (type === 'warning') toast.classList.add('warning');
    if (type === 'error') toast.classList.add('error');

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          toast.remove();
        }
      }, 300);
    }, duration);
  };

  const displayBeer = (beer) => {
    try {
      if (!beer || !beer.description) {
        throw new Error('Invalid beer object provided to displayBeer');
      }

      if (randomNameElement) {
        randomNameElement.textContent = beer.description;
        adjustTextSize(beer.description);
        applyFadeIn(randomNameElement);
      }

      if (beerSpecsContainer) {
        beerSpecsContainer.style.display = 'grid';
        if (specStyle) specStyle.textContent = beer.specs?.category || '-';
        if (specAbv) specAbv.textContent = beer.specs?.abv || '-';
        if (specIbu) specIbu.textContent = beer.specs?.ibu || '-';
        if (specOrigin) specOrigin.textContent = beer.specs?.region || '-';
      }

      // Small pop animation to draw attention to the updated content
      const container = document.querySelector('.beer-name-container');
      applyScalePop(container);
    } catch (error) {
      handleError(
        error,
        'displayBeer',
        'Error displaying beer information.',
        true
      );
      // Set fallback content
      if (randomNameElement) {
        randomNameElement.textContent =
          'Error displaying beer. Please try generating a new one.';
      }
    }
  };

  const updateUI = () => {
    try {
      if (generationCountElement) {
        generationCountElement.textContent = `${totalGenerated} beers crafted`;
      }

      if (historyList) {
        historyList.innerHTML = '';
        generatedNames.slice(0, 10).forEach((beer) => {
          if (!beer || !beer.name) {
            console.warn('Skipping invalid beer entry in history');
            return;
          }

          const item = document.createElement('div');
          item.setAttribute('role', 'button');
          item.setAttribute('tabindex', '0');
          item.innerHTML = `
            <strong>${beer.name}</strong>
            <div style="font-size: 0.85rem; opacity: 0.7; margin-top: 0.5rem;">
              ${beer.specs?.category || '-'} • ${beer.specs?.abv || '-'} • ${beer.specs?.ibu || '-'}
            </div>
          `;

          const loadFromHistory = () => {
            try {
              currentBeer = window.currentBeer = beer;
              displayBeer(beer);
              showToast('Beer loaded from history!');
            } catch (error) {
              handleError(
                error,
                'loadFromHistory',
                'Failed to load beer from history.'
              );
            }
          };

          item.addEventListener('click', loadFromHistory);
          addKeyboardActivation(item, loadFromHistory);
          historyList.appendChild(item);
        });
      }
    } catch (error) {
      handleError(error, 'updateUI', 'Error updating user interface.', false);
    }
  };

  const generateAndDisplay = async () => {
    try {
      // Ensure data is loaded
      await ensureDataLoaded();

      const beer = generateBeer();
      currentBeer = window.currentBeer = beer;

      generatedNames.unshift(beer);
      if (generatedNames.length > 50) generatedNames.pop();

      totalGenerated++;
      displayBeer(beer);
      updateUI();

      const saveResult = LocalStorageManager.saveHistory(generatedNames);
      if (saveResult !== true) {
        // Handle save failure
        const errorMsg =
          saveResult.error === 'quota'
            ? 'Local storage is full. Consider clearing some history to save new beers.'
            : "Your beer history couldn't be saved to local storage.";
        showToast(errorMsg, 3000, 'warning');
      }

      return beer;
    } catch (error) {
      console.error('Error in generateAndDisplay:', error);

      // Provide more specific error messages based on error type
      let errorMessage = 'Error generating beer';

      if (error.message.includes('beer_data.json')) {
        errorMessage =
          'Could not load beer data. Please refresh the page and try again.';
      } else if (error.message.includes('Cannot select from empty array')) {
        errorMessage =
          'Error in beer generation algorithm. Some data may be missing.';
      } else if (error.message) {
        errorMessage = `${errorMessage}: ${error.message}`;
      }

      showToast(errorMessage, 5000, 'error');

      // Update UI to show error state
      if (randomNameElement) {
        randomNameElement.textContent =
          'Error generating beer. Please try again.';
      }
    }
  };

  const toggleAutoGenerate = () => {
    if (autoGenerateInterval) {
      clearInterval(autoGenerateInterval);
      autoGenerateInterval = null;
      if (autoGenerateBtn) {
        autoGenerateBtn.innerHTML =
          '<i class="fas fa-sync-alt"></i> Auto Generate';
        autoGenerateBtn.classList.remove('active');
        autoGenerateBtn.setAttribute('aria-pressed', 'false');
        autoGenerateBtn.setAttribute(
          'aria-label',
          'Automatically generate beer names every 10 seconds'
        );
      }
      showToast('Auto-generation stopped');
    } else {
      generateAndDisplay();
      autoGenerateInterval = setInterval(generateAndDisplay, 10000);
      if (autoGenerateBtn) {
        autoGenerateBtn.innerHTML =
          '<i class="fas fa-stop-circle"></i> Stop Auto';
        autoGenerateBtn.classList.add('active');
        autoGenerateBtn.setAttribute('aria-pressed', 'true');
        autoGenerateBtn.setAttribute(
          'aria-label',
          'Stop automatically generating beer names'
        );
      }
      showToast('Auto-generating every 10 seconds');
    }
  };

  // Event listeners
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      generateAndDisplay();
      showToast('New beer generated! 🍺', 2000, 'success');
    });
    console.log('✅ Generate button listener attached');
  }

  if (autoGenerateBtn) {
    autoGenerateBtn.addEventListener('click', toggleAutoGenerate);
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all history?')) {
        generatedNames = [];
        totalGenerated = 0;
        updateUI();
        LocalStorageManager.clearHistory();
        showToast('History cleared!', 2000, 'success');
      }
    });
  }

  // Initialize dark mode before attaching event listener
  if (LocalStorageManager.darkMode() === 'enabled') {
    document.body.classList.add('dark-mode');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      LocalStorageManager.darkMode(isDark ? 'enabled' : 'disabled');
      themeToggleBtn.innerHTML = isDark
        ? '<i class="fas fa-sun"></i> Light Mode'
        : '<i class="fas fa-moon"></i> Dark Mode';
      showToast(
        isDark ? 'Dark mode enabled' : 'Light mode enabled',
        2000,
        'info'
      );
    });
  }

  // Keyboard shortcuts with better accessibility
  document.addEventListener('keydown', (e) => {
    // Space bar generates beer (only when not focused on input elements)
    if (
      e.code === 'Space' &&
      !['INPUT', 'TEXTAREA', 'BUTTON'].includes(document.activeElement.tagName)
    ) {
      e.preventDefault();
      generateAndDisplay();
      showToast('New beer generated! 🍺', 2000, 'success');
    }

    // Escape key closes history panel if open
    if (e.key === 'Escape') {
      const historyPanel = document.querySelector('.history');
      const historyToggle = document.getElementById('history-toggle');
      if (historyPanel && historyPanel.classList.contains('show')) {
        historyPanel.classList.remove('show');
        if (historyToggle) {
          historyToggle.setAttribute('aria-expanded', 'false');
          historyToggle.innerHTML =
            '<i class="fas fa-history" aria-hidden="true"></i>';
          historyToggle.focus(); // Return focus to button
        }
      }
    }
  });

  // Ctrl+Shift+A selects the beer specs container contents
  document.addEventListener('keydown', function (event) {
    if (
      event.ctrlKey &&
      event.shiftKey &&
      (event.key === 'a' || event.key === 'A')
    ) {
      event.preventDefault();
      const outputElement = document.getElementById('beer-specs');
      if (outputElement) {
        const range = document.createRange();
        range.selectNodeContents(outputElement);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        showToast('Specifications selected', 1500, 'info');
      }
    }
  });

  // Initialize display
  updateUI();

  if (generatedNames.length === 0) {
    setTimeout(() => {
      generateAndDisplay();
      showToast('Welcome to the Beer Name Generator! 🍻');
    }, 500);
  } else {
    displayBeer(generatedNames[0]);
  }

  // Add a small fadeIn keyframes block if it's not already present.
  if (!document.querySelector('#fadeInAnimation')) {
    const style = document.createElement('style');
    style.id = 'fadeInAnimation';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  // Expose functions for debugging
  window.showToast = showToast;
  window.generateAndDisplay = generateAndDisplay;
  window.beerData = beerData; // read-only view of loaded JSON

  // Initialize UI effects
  createBubbles();
  createBackgroundBubbles();
  setupHistoryPanelToggle();

  console.log('✅ Beer Generator initialized successfully with JSON data!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBeerGenerator);
} else {
  initializeBeerGenerator();
}
