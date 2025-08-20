// Bier Naam Generator - Gebruikt ALLEEN beer_data.json
// NL: Hoofdbestand voor de app-logica. Houdt state bij, laadt data en bedient de UI.
console.log('Beer Name Generator starting...');

let beerData = null;
let isDataLoaded = false;

// NL: Laad bierdata uit JSON (GEEN fallback). Zonder dit bestand stopt de app.
// Load beer data from JSON file (NO FALLBACK)
async function loadBeerData() {
  console.log('Attempting to load beer_data.json...');

  try {
    const response = await fetch('beer_data.json');

    if (response.ok) {
      const data = await response.json();
      // NL: Controle op noodzakelijke sleutels in de JSON
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

      // NL: Ook met ontbrekende (niet-kritieke) velden gaan we verder; de generator vangt fouten af.
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
    console.error('❌ CRITICAL: Failed to load beer_data.json:', error.message);

    // NL: Specifieke hint bij direct openen via file:// (fetch werkt dan niet)
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

    // Stop execution - we REQUIRE the JSON file
    throw new Error(
      `Beer Name Generator requires beer_data.json file. Error: ${error.message}`
    );
  }
}

// NL: Toon status van dataladen aan de gebruiker (klein statusbalkje linksboven)
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

// Wait for data to be loaded before proceeding
async function ensureDataLoaded() {
  if (!isDataLoaded) {
    await loadBeerData();
  }
  if (!beerData) {
    throw new Error('Beer data is not available');
  }
  return beerData;
}

// Initialize the beer generator
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
    console.error('FATAL ERROR: Cannot initialize without beer data:', error);
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
    beerSpecsContainer: !!beerSpecsContainer,
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
    console.log('No saved history found');
  }

  // NL: Hulpfuncties voor willekeurige keuzes en tekstgrootte
  // Utility functions
  const random = (array) => {
    if (!array || array.length === 0) {
      console.error('CRITICAL: Empty array passed to random function');
      throw new Error('Cannot select from empty array');
    }
    return array[Math.floor(Math.random() * array.length)];
  };

  // NL: Bepaal het lidwoord 'a' of 'an' op basis van het eerste woord/klank
  const articleFor = (word) => {
    if (!word || typeof word !== 'string') return 'a';
    const first = word.trim().toLowerCase()[0];
    return 'aeiou'.includes(first) ? 'an' : 'a';
  };

  // NL: Eenvoudige meervoudsvorming (basisregel)
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
    for (let i = 0; i < Math.min(count, available.length); i++) {
      const index = Math.floor(Math.random() * available.length);
      selected.push(available.splice(index, 1)[0]);
    }
    return selected;
  };

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
    // NL: Behoud de basisclass zodat centrering/breedte behouden blijft
    randomNameElement.className = `beer-name-text ${sizeClass}`.trim();
  };

  // NL: Generatie-functies met ALLEEN geladen JSON-data
  // Beer generation functions using ONLY loaded JSON data
  const generateTitle = () => {
    const templates = [
      () => {
        const [taste1, taste2] = randomMultiple(
          beerData.tasteProfiles,
          2,
          true
        );
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
        const noun = random([
          'Voyage',
          'Journey',
          'Quest',
          'Legend',
          'Tale',
          'Chronicle',
          'Saga',
          'Epic',
          'Odyssey',
          'Adventure',
        ]);
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
      },
    ];
    return random(templates)();
  };

  const generateDescription = () => {
    const [adj1, adj2] = randomMultiple(beerData.coolAdjectives, 2, true);
    const color = random(beerData.colors);
    // NL: Gebruik één stijlnaam (category) om dubbelingen te vermijden
    const category = random(beerData.categories);
    const glass = random(beerData.beerGlasses);
    const [taste1, taste2] = randomMultiple(beerData.tasteProfiles, 2, true);
    const mouthfeel = random(beerData.mouthfeelDescriptors);
    const creature = random(beerData.mythicalCreatures);
    const adverb = random(beerData.adverbs);
    const tasteNoun = random(beerData.tasteNouns);

    const art = articleFor(adj1);
    const tasteNounPlural = pluralize(tasteNoun);

    // Voorbeeld: "an ethereal, bold, amber Belgian Tripel, served gently in a tulip glass, with notes of citrus and clove and a silky finish..."
    return `${art} ${adj1}, ${adj2}, ${color} ${category}, served ${adverb} in a ${glass}, with ${tasteNounPlural} of ${taste1} and ${taste2} and a ${mouthfeel} finish, evoking the essence of a mythical ${creature}`;
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
      const description = `${name}, ${generateDescription()}. This ${specs.region} ${specs.technique} brew features ${specs.ibu} and ${specs.abv}, making it perfect for a ${specs.occasion}.`;

      return {
        name,
        description,
        timestamp: new Date(),
        id: `beer-${Date.now()}`,
        specs,
      };
    } catch (error) {
      console.error('Error generating beer:', error);
      throw error;
    }
  };

  // NL: UI-functies (toast-meldingen + weergave)
  // Display functions
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

    // NL: style varianten op basis van type
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
    if (randomNameElement) {
      randomNameElement.textContent = beer.description;
      adjustTextSize(beer.description);
      randomNameElement.style.animation = 'none';
      setTimeout(
        () => (randomNameElement.style.animation = 'fadeIn 0.5s ease-in'),
        10
      );
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
      setTimeout(() => (container.style.transform = 'scale(1)'), 200);
    }
  };

  const updateUI = () => {
    if (generationCountElement) {
      generationCountElement.textContent = `${totalGenerated} beers crafted`;
    }

    if (historyList) {
      historyList.innerHTML = '';
      generatedNames.slice(0, 10).forEach((beer) => {
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
        console.warn('Could not save to localStorage:', e);
        showToast(
          "Your beer history couldn't be saved to local storage.",
          3000,
          'warning'
        );
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
      }
      showToast('Auto-generation stopped');
    } else {
      generateAndDisplay();
      autoGenerateInterval = setInterval(generateAndDisplay, 10000);
      if (autoGenerateBtn) {
        autoGenerateBtn.innerHTML =
          '<i class="fas fa-stop-circle"></i> Stop Auto';
        autoGenerateBtn.classList.add('active');
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
        localStorage.removeItem('beerHistory');
        showToast('History cleared!', 2000, 'success');
      }
    });
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
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

  // Keyboard shortcuts
  // NL: Sneltoetsen
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      generateAndDisplay();
      showToast('New beer generated! 🍺', 2000, 'success');
    }
  });

  // NL: Ctrl+Shift+A selecteert de specificaties (zodat Ctrl+A standaard select-all blijft)
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
        showToast('Specificaties geselecteerd', 1500, 'info');
      }
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

  // NL: Maak functies globaal beschikbaar voor debug doeleinden
  window.showToast = showToast;
  window.generateAndDisplay = generateAndDisplay;
  window.beerData = beerData; // Expose loaded JSON data for debugging

  console.log('✅ Beer Generator initialized successfully with JSON data!');
}

// Start loading data immediately
loadBeerData();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBeerGenerator);
} else {
  initializeBeerGenerator();
}
