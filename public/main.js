// Beer Name Generator - Uses ONLY beer_data.json file
console.log("Beer Name Generator starting...");

let beerData = null;
let isDataLoaded = false;

// Load beer data from JSON file (NO FALLBACK)
async function loadBeerData() {
  console.log("Attempting to load beer_data.json...");

  try {
    const response = await fetch('beer_data.json');

    if (!response.ok) {
      throw new Error(`Failed to load beer_data.json - HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate the data has required properties
    const requiredKeys = ['categories', 'coolAdjectives', 'mythicalCreatures', 'tasteProfiles', 'colors', 'types', 'beerGlasses', 'mouthfeelDescriptors', 'tasteNouns', 'adverbs', 'regions', 'brewingTechniques', 'ibuRanges', 'abvRanges', 'occasions'];
    const missingKeys = requiredKeys.filter(key => !data[key] || !Array.isArray(data[key]));

    if (missingKeys.length > 0) {
      throw new Error(`Missing required keys in JSON: ${missingKeys.join(', ')}`);
    }

    beerData = data;
    isDataLoaded = true;

    console.log("✅ Successfully loaded beer_data.json!");
    console.log(`📊 Comprehensive Data Stats:
      - Categories: ${data.categories.length}
      - Adjectives: ${data.coolAdjectives.length}
      - Mythical Creatures: ${data.mythicalCreatures.length}
      - Taste Profiles: ${data.tasteProfiles.length}
      - Colors: ${data.colors.length}
      - Beer Glasses: ${data.beerGlasses.length}
      - Regions: ${data.regions.length}
      - Brewing Techniques: ${data.brewingTechniques.length}`);

    // Show success message to user
    showDataLoadStatus(`✅ Loaded comprehensive beer database! (${data.categories.length} categories, ${data.mythicalCreatures.length} creatures)`, 'success');

    return data;

  } catch (error) {
    console.error("❌ CRITICAL: Failed to load beer_data.json:", error.message);

    // Show error to user
    showDataLoadStatus(`❌ ERROR: Could not load beer_data.json - ${error.message}`, 'error');

    // Stop execution - we REQUIRE the JSON file
    throw new Error(`Beer Name Generator requires beer_data.json file. Error: ${error.message}`);
  }
}

// Show data loading status to user
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
    document.body.appendChild(statusEl);
  }

  // Style based on type
  const styles = {
    success: 'background: #4CAF50; color: white;',
    warning: 'background: #FF9800; color: white;',
    error: 'background: #f44336; color: white;',
    info: 'background: #2196F3; color: white;'
  };

  statusEl.style.cssText += styles[type];
  statusEl.textContent = message;

  // Auto-hide success messages after 4 seconds, keep errors longer
  const hideDelay = type === 'error' ? 10000 : 4000;
  setTimeout(() => {
    if (statusEl && statusEl.parentNode) {
      statusEl.remove();
    }
  }, hideDelay);
}

// Wait for data to be loaded before proceeding
async function ensureDataLoaded() {
  if (!isDataLoaded) {
    await loadBeerData();
  }
  if (!beerData) {
    throw new Error("Beer data is not available");
  }
  return beerData;
}

// Initialize the beer generator
async function initializeBeerGenerator() {
  console.log("Initializing Beer Generator...");

  try {
    // Load beer data first - REQUIRED
    await ensureDataLoaded();

    console.log("🍺 Using JSON data with", beerData.categories.length, "beer categories");

  } catch (error) {
    console.error("FATAL ERROR: Cannot initialize without beer data:", error);
    showDataLoadStatus(`❌ FATAL: Cannot start without beer_data.json file`, 'error');
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

  console.log("DOM elements found:", {
    randomNameElement: !!randomNameElement,
    generateBtn: !!generateBtn,
    beerSpecsContainer: !!beerSpecsContainer
  });

  // App state
  let autoGenerateInterval = null;
  let generatedNames = [];
  let totalGenerated = 0;
  let currentBeer = null;

  // Load saved data from localStorage
  try {
    const saved = localStorage.getItem('beerHistory');
    if (saved) {
      generatedNames = JSON.parse(saved);
      totalGenerated = generatedNames.length;
      console.log(`Loaded ${generatedNames.length} beers from history`);
    }
  } catch (e) {
    console.log("No saved history found");
  }

  // Utility functions
  const random = (array) => {
    if (!array || array.length === 0) {
      console.error("CRITICAL: Empty array passed to random function");
      throw new Error("Cannot select from empty array");
    }
    return array[Math.floor(Math.random() * array.length)];
  };

  const randomMultiple = (array, count, unique = false) => {
    if (!array || array.length === 0) {
      console.error("CRITICAL: Empty array passed to randomMultiple function");
      throw new Error("Cannot select from empty array");
    }

    if (!unique) return Array.from({ length: count }, () => random(array));

    const selected = [];
    const available = [...array];
    for (let i = 0; i < Math.min(count, available.length); i++) {
      const index = Math.floor(Math.random() * available.length);
      selected.push(available.splice(index, 1)[0]);
    }
    return selected;
  };

  const adjustTextSize = (text) => {
    if (!randomNameElement) return;
    randomNameElement.className = text.length > 300 ? 'smaller-text' :
                                   text.length > 200 ? 'small-text' :
                                   text.length > 150 ? 'medium-text' : '';
  };

  // Beer generation functions using ONLY loaded JSON data
  const generateTitle = () => {
    const templates = [
      () => {
        const [taste1, taste2] = randomMultiple(beerData.tasteProfiles, 2, true);
        const creature = random(beerData.mythicalCreatures);
        const adjective = random(beerData.coolAdjectives);
        return `The ${adjective} ${taste1} and ${taste2} ${creature}`;
      },
      () => {
        const adjective = random(beerData.coolAdjectives);
        const creature = random(beerData.mythicalCreatures);
        const region = random(beerData.regions);
        return `${region} ${adjective} ${creature}`;
      },
      () => {
        const taste = random(beerData.tasteProfiles);
        const adjective = random(beerData.coolAdjectives);
        const noun = random(['Voyage', 'Journey', 'Quest', 'Legend', 'Tale', 'Chronicle', 'Saga', 'Epic', 'Odyssey', 'Adventure']);
        return `The ${adjective} ${taste} ${noun}`;
      },
      () => {
        const [adj1, adj2] = randomMultiple(beerData.coolAdjectives, 2, true);
        const creature = random(beerData.mythicalCreatures);
        return `${adj1} ${adj2} ${creature}`;
      },
      () => {
        const color = random(beerData.colors);
        const creature = random(beerData.mythicalCreatures);
        const region = random(beerData.regions);
        return `${region} ${color} ${creature}`;
      }
    ];
    return random(templates)();
  };

  const generateDescription = () => {
    const [adj1, adj2] = randomMultiple(beerData.coolAdjectives, 2, true);
    const color = random(beerData.colors);
    const type = random(beerData.types);
    const category = random(beerData.categories);
    const glass = random(beerData.beerGlasses);
    const [taste1, taste2] = randomMultiple(beerData.tasteProfiles, 2, true);
    const mouthfeel = random(beerData.mouthfeelDescriptors);
    const creature = random(beerData.mythicalCreatures);
    const adverb = random(beerData.adverbs);
    const tasteNoun = random(beerData.tasteNouns);

    return `a ${adj1}, ${adj2}, ${color}-colored ${type} ${category}, served ${adverb} in a ${glass}, with ${tasteNoun}s of ${taste1} and ${taste2} and a ${mouthfeel} finish, evoking the essence of a mythical ${creature}`;
  };

  const generateSpecs = () => ({
    region: random(beerData.regions),
    technique: random(beerData.brewingTechniques),
    ibu: random(beerData.ibuRanges),
    abv: random(beerData.abvRanges),
    occasion: random(beerData.occasions),
    category: random(beerData.categories)
  });

  const generateBeer = () => {
    try {
      const specs = generateSpecs();
      const name = generateTitle();
      const description = `${name}, ${generateDescription()}. This ${specs.region} ${specs.technique} brew features ${specs.ibu} and ${specs.abv}, making it perfect for a ${specs.occasion}.`;

      return {
        name,
        description,
        timestamp: new Date(),
        id: `beer-${Date.now()}`,
        specs
      };
    } catch (error) {
      console.error("Error generating beer:", error);
      throw error;
    }
  };

  // Display functions
  const showToast = (message, duration = 2000) => {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;

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
    if (randomNameElement) {
      randomNameElement.textContent = beer.description;
      adjustTextSize(beer.description);
      randomNameElement.style.animation = 'none';
      setTimeout(() => randomNameElement.style.animation = 'fadeIn 0.5s ease-in', 10);
    }

    if (beerSpecsContainer) {
      beerSpecsContainer.style.display = 'grid';
      if (specStyle) specStyle.textContent = beer.specs.category;
      if (specAbv) specAbv.textContent = beer.specs.abv;
      if (specIbu) specIbu.textContent = beer.specs.ibu;
      if (specOrigin) specOrigin.textContent = beer.specs.region;
    }

    const container = document.querySelector('.beer-name-container');
    if (container) {
      container.style.transform = 'scale(0.95)';
      setTimeout(() => container.style.transform = 'scale(1)', 200);
    }
  };

  const updateUI = () => {
    if (generationCountElement) {
      generationCountElement.textContent = `${totalGenerated} beers crafted`;
    }

    if (historyList) {
      historyList.innerHTML = '';
      generatedNames.slice(0, 10).forEach(beer => {
        const item = document.createElement('div');
        item.innerHTML = `
          <strong>${beer.name}</strong>
          <div style="font-size: 0.85rem; opacity: 0.7; margin-top: 0.5rem;">
            ${beer.specs.category} • ${beer.specs.abv} • ${beer.specs.ibu}
          </div>
        `;
        item.addEventListener('click', () => {
          currentBeer = window.currentBeer = beer;
          displayBeer(beer);
          showToast('Beer loaded from history!');
        });
        historyList.appendChild(item);
      });
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

      try {
        localStorage.setItem('beerHistory', JSON.stringify(generatedNames));
      } catch (e) {
        console.log("Could not save to localStorage");
      }

      return beer;
    } catch (error) {
      console.error("Error in generateAndDisplay:", error);
      showToast(`Error generating beer: ${error.message}`, 3000);
    }
  };

  const toggleAutoGenerate = () => {
    if (autoGenerateInterval) {
      clearInterval(autoGenerateInterval);
      autoGenerateInterval = null;
      if (autoGenerateBtn) {
        autoGenerateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Auto Generate';
        autoGenerateBtn.classList.remove('active');
      }
      showToast('Auto-generation stopped');
    } else {
      generateAndDisplay();
      autoGenerateInterval = setInterval(generateAndDisplay, 10000);
      if (autoGenerateBtn) {
        autoGenerateBtn.innerHTML = '<i class="fas fa-stop-circle"></i> Stop Auto';
        autoGenerateBtn.classList.add('active');
      }
      showToast('Auto-generating every 10 seconds');
    }
  };

  // Event listeners
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      generateAndDisplay();
      showToast('New beer generated! 🍺');
    });
    console.log("✅ Generate button listener attached");
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
        localStorage.removeItem('beerHistory');
        showToast('History cleared!');
      }
    });
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
      themeToggleBtn.innerHTML = isDark ?
        '<i class="fas fa-sun"></i> Light Mode' :
        '<i class="fas fa-moon"></i> Dark Mode';
      showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      generateAndDisplay();
      showToast('New beer generated! 🍺');
    }
  });

  // Initialize dark mode
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
  }

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

  // Add CSS animation if not already present
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

  // Make functions globally accessible for debugging
  window.showToast = showToast;
  window.generateAndDisplay = generateAndDisplay;
  window.beerData = beerData; // Expose loaded JSON data for debugging

  console.log("✅ Beer Generator initialized successfully with JSON data!");
}

// Start loading data immediately
loadBeerData();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBeerGenerator);
} else {
  initializeBeerGenerator();
}