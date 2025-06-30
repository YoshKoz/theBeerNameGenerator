// Store beer data directly in the script since fetch might be failing
const beerData = {
  "categories": [
    "Abbey Beer", "Amber", "American IPA", "Baltic Porter", "Barrel-Aged Stout",
    "Belgian Blonde", "Brown Ale", "Craft IPA", "Dunkel", "English Bitter",
    "Farmhouse Ale", "Gose", "Hefeweizen", "Imperial Stout", "Kolsch",
    "Lager", "Milk Stout", "NEIPA", "Pale Ale", "Porter",
    "Quadrupel", "Red Ale", "Saison", "Tripel", "Wheat Beer",
    "West Coast IPA"
  ],
  "coolAdjectives": [
    "Absorbing", "Ambitious", "Bold", "Brilliant", "Captivating",
    "Celestial", "Charming", "Cosmic", "Dazzling", "Divine",
    "Elegant", "Enchanting", "Extraordinary", "Fierce", "Glorious",
    "Golden", "Harmonious", "Impressive", "Intense", "Lustrous",
    "Majestic", "Mesmerizing", "Passionate", "Pristine", "Radiant",
    "Refined", "Striking", "Sublime", "Vibrant", "Wondrous"
  ],
  "beerGlasses": [
    "American Pint", "Belgian Tulip", "Chalice", "Crystal", "Dimple Mug",
    "Flared", "Goblet", "Hefeweizen", "Imperial Pint", "Mug",
    "Pilsner", "Snifter", "Stein", "Tankard", "Tulip"
  ],
  "types": [
    "Artisanal", "Barrel-aged", "Blended", "Craft", "Crisp",
    "Dark", "Dry-Hopped", "Filtered", "Hoppy", "Imperial",
    "Infused", "Light", "Malty", "Organic", "Smooth",
    "Spiced", "Strong", "Unfiltered", "Velvety", "Wild-Fermented"
  ],
  "colors": [
    "Amber", "Auburn", "Black", "Blonde", "Bronze",
    "Brown", "Caramel", "Chestnut", "Copper", "Crimson",
    "Dark", "Deep Gold", "Golden", "Mahogany", "Ruby"
  ],
  "mythicalCreatures": [
    "Basilisk", "Centaur", "Dragon", "Elf", "Fairy",
    "Griffin", "Hydra", "Kraken", "Mermaid", "Minotaur",
    "Phoenix", "Sphinx", "Unicorn", "Vampire", "Werewolf"
  ],
  "tasteProfiles": [
    "Bitter", "Caramelized", "Citrus", "Coffee", "Floral",
    "Fruity", "Hoppy", "Malty", "Nutty", "Roasted",
    "Smoky", "Spicy", "Sweet", "Tropical", "Vanilla"
  ],
  "mouthfeelDescriptors": [
    "Bold", "Bubbly", "Creamy", "Crisp", "Full-bodied",
    "Juicy", "Light", "Rich", "Silky", "Smooth"
  ],
  "tasteNouns": [
    "Aroma", "Flavor", "Hint", "Note", "Sensation"
  ],
  "adverbs": [
    "Delicately", "Elegantly", "Impressively", "Majestically", "Wonderfully"
  ],
  "regions": [
    "Belgian", "British", "Czech", "German", "American",
    "Irish", "Japanese", "Nordic", "Dutch", "Australian"
  ],
  "brewingTechniques": [
    "Barrel-Aged", "Dry-Hopped", "Open-Fermented", "Oak-Aged", "Wild-Fermented",
    "Cask-Conditioned", "Bottle-Conditioned", "Cold-Fermented", "Spice-Infused", "Double Mashed"
  ],
  "ibuRanges": [
    "10-20 IBU", "20-30 IBU", "30-40 IBU", "40-50 IBU", "50-60 IBU",
    "60-70 IBU", "70-80 IBU", "80-90 IBU", "90-100 IBU", "100+ IBU"
  ],
  "abvRanges": [
    "4-5% ABV", "5-6% ABV", "6-7% ABV", "7-8% ABV", "8-9% ABV",
    "9-10% ABV", "10-11% ABV", "11-12% ABV", "12%+ ABV"
  ],
  "occasions": [
    "Summer Session", "Winter Warmer", "Oktoberfest Special", "Limited Release",
    "Anniversary Edition", "Brewmaster's Reserve", "Seasonal Small Batch", "Festival Special"
  ]
};

window.onload = function () {
  // Element references
  const randomNameElement = document.getElementById('random-name');
  const generateBtn = document.getElementById('generate');
  const autoGenerateBtn = document.getElementById('auto-generate');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history');
  const generationCountElement = document.getElementById('generation-count');
  const themeToggleBtn = document.getElementById('theme-toggle');

  // Beer spec elements
  const beerSpecsContainer = document.getElementById('beer-specs');
  const specStyle = document.getElementById('spec-style');
  const specAbv = document.getElementById('spec-abv');
  const specIbu = document.getElementById('spec-ibu');
  const specOrigin = document.getElementById('spec-origin');

  // App state
  let autoGenerateInterval = null;
  let generatedNames = [];
  let maxStoredNames = 50;
  let currentBeer = null;
  let totalGenerated = 0;

  // Make currentBeer accessible globally
  window.currentBeer = null;

  // Load saved data
  function loadSavedData() {
    const saved = localStorage.getItem('beerHistory');
    if (saved) {
      generatedNames = JSON.parse(saved);
      totalGenerated = generatedNames.length;
      updateGenerationCount();
      updateHistoryDisplay();
    }
  }

  // Save data
  function saveData() {
    localStorage.setItem('beerHistory', JSON.stringify(generatedNames));
  }

  // Helper function to adjust text size based on length
  const adjustTextSize = (text) => {
    if (!randomNameElement) return;

    randomNameElement.style.fontSize = '';

    if (text.length > 300) {
      randomNameElement.style.fontSize = '1.2rem';
    } else if (text.length > 200) {
      randomNameElement.style.fontSize = '1.4rem';
    } else if (text.length > 150) {
      randomNameElement.style.fontSize = '1.6rem';
    }
  };

  // Helper functions for random selection
  const getRandomInt = max => Math.floor(Math.random() * max);

  const getRandomElement = array => array && array.length ? array[getRandomInt(array.length)] : "";

  const getRandomElements = (array, count, unique = false) => {
    if (!array || array.length === 0) {
      console.warn("Array empty or undefined during random selection.");
      return [];
    }
    if (!unique) {
      return Array.from({ length: count }, () => array[getRandomInt(array.length)]);
    }
    const uniqueIndices = new Set();
    const maxCount = Math.min(count, array.length);
    while (uniqueIndices.size < maxCount) {
      uniqueIndices.add(getRandomInt(array.length));
    }
    return [...uniqueIndices].map(index => array[index]);
  };

  // Enhanced beer name generation functions
  const generateTitle = () => {
    const templates = [
      () => {
        const [taste1, taste2] = getRandomElements(beerData.tasteProfiles, 2, true);
        const creature = getRandomElement(beerData.mythicalCreatures);
        const adjective = getRandomElement(beerData.coolAdjectives);
        return `The ${adjective} ${taste1} and ${taste2} ${creature}`;
      },
      () => {
        const adjective = getRandomElement(beerData.coolAdjectives);
        const creature = getRandomElement(beerData.mythicalCreatures);
        const region = getRandomElement(beerData.regions);
        return `${region} ${adjective} ${creature}`;
      },
      () => {
        const taste = getRandomElement(beerData.tasteProfiles);
        const adjective = getRandomElement(beerData.coolAdjectives);
        const noun = getRandomElement(['Voyage', 'Journey', 'Quest', 'Legend', 'Tale']);
        return `The ${adjective} ${taste} ${noun}`;
      }
    ];

    return templates[getRandomInt(templates.length)]();
  };

  const generateAppearanceAndStyle = () => {
    const [adj1, adj2] = getRandomElements(beerData.coolAdjectives, 2, true);
    const color = getRandomElement(beerData.colors);
    const tasteProfile = getRandomElement(beerData.tasteProfiles);
    const type = getRandomElement(beerData.types);
    const category = getRandomElement(beerData.categories);
    return `a ${adj1}, ${adj2}, ${color}-colored ${tasteProfile} ${type} ${category}`;
  };

  const generateServingAndPresentation = () => {
    const adjective = getRandomElement(beerData.coolAdjectives);
    const adverb = getRandomElement(beerData.adverbs);
    const glassStyle = getRandomElement(beerData.beerGlasses);
    const tasteProfile = getRandomElement(beerData.tasteProfiles);
    const mouthfeel = getRandomElement(beerData.mouthfeelDescriptors);
    return `served ${adjective}, ${adverb} in a ${glassStyle}, with hints of ${tasteProfile} and a ${mouthfeel} finish`;
  };

  const generateMouthfeelAndTaste = () => {
    const mouthfeel = getRandomElement(beerData.mouthfeelDescriptors);
    const tasteNoun = getRandomElement(beerData.tasteNouns);
    const [taste1, taste2] = getRandomElements(beerData.tasteProfiles, 2, true);
    const creature = getRandomElement(beerData.mythicalCreatures);
    return `it has a ${mouthfeel} ${tasteNoun} with notes of ${taste1} and ${taste2}, evoking the essence of a mythical ${creature}`;
  };

  // Generate beer specifications
  const generateBeerSpecs = () => {
    const region = getRandomElement(beerData.regions);
    const technique = getRandomElement(beerData.brewingTechniques);
    const ibu = getRandomElement(beerData.ibuRanges);
    const abv = getRandomElement(beerData.abvRanges);
    const occasion = getRandomElement(beerData.occasions);
    const category = getRandomElement(beerData.categories);

    return {
      region,
      technique,
      ibu,
      abv,
      occasion,
      category
    };
  };

  const generateAdditionalDetail = (specs) => {
    return `This ${specs.region} ${specs.technique} brew features ${specs.ibu} and ${specs.abv}, making it perfect for a ${specs.occasion}.`;
  };

  const generateFullBeerDescription = () => {
    const specs = generateBeerSpecs();
    const name = generateTitle();
    const description = `${name}, ${generateAppearanceAndStyle()}, ${generateServingAndPresentation()}, ${generateMouthfeelAndTaste()}. ${generateAdditionalDetail(specs)}`;

    return {
      name,
      description,
      timestamp: new Date(),
      id: `beer-${Date.now()}`,
      isFavorite: false,
      specs
    };
  };

  // Show a temporary notification
  const showToast = (message, duration = 2000) => {
    let toast = document.querySelector('.toast');

    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;

    // Animate
    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          if (document.body.contains(toast)) {
            toast.remove();
          }
        }, 300);
      }, duration);
    }, 10);
  };

  // Make showToast accessible globally
  window.showToast = showToast;

  // Update generation count
  const updateGenerationCount = () => {
    if (generationCountElement) {
      generationCountElement.textContent = `${totalGenerated} beers crafted`;
    }
  };

  // Update history display
  const updateHistoryDisplay = () => {
    if (!historyList) return;

    historyList.innerHTML = '';
    generatedNames.slice(0, 10).forEach((beer, index) => {
      const item = document.createElement('div');
      item.innerHTML = `
        <strong>${beer.name}</strong>
        <div style="font-size: 0.85rem; opacity: 0.7; margin-top: 0.5rem;">
          ${beer.specs.category} • ${beer.specs.abv} • ${beer.specs.ibu}
        </div>
      `;
      item.addEventListener('click', () => {
        currentBeer = beer;
        window.currentBeer = beer;
        displayBeer(beer);
        showToast('Beer loaded from history!');
      });
      historyList.appendChild(item);
    });
  };

  // Display a beer
  const displayBeer = (beer) => {
    if (randomNameElement) {
      randomNameElement.textContent = beer.description;
      adjustTextSize(beer.description);
    }

    // Update specs display
    if (beerSpecsContainer) {
      beerSpecsContainer.style.display = 'grid';
      if (specStyle) specStyle.textContent = beer.specs.category;
      if (specAbv) specAbv.textContent = beer.specs.abv;
      if (specIbu) specIbu.textContent = beer.specs.ibu;
      if (specOrigin) specOrigin.textContent = beer.specs.region;
    }

    // Add animation
    if (randomNameElement) {
      randomNameElement.style.animation = 'none';
      setTimeout(() => {
        randomNameElement.style.animation = 'fadeIn 0.5s ease-in';
      }, 10);
    }
  };

  // Generate a new beer name and display it
  const generateAndDisplay = () => {
    const beer = generateFullBeerDescription();
    currentBeer = beer;
    window.currentBeer = beer;

    // Add to history
    generatedNames.unshift(beer);
    if (generatedNames.length > maxStoredNames) {
      generatedNames.pop();
    }

    // Update total count
    totalGenerated++;

    // Display the beer
    displayBeer(beer);

    // Update other displays
    updateHistoryDisplay();
    updateGenerationCount();

    // Save to localStorage
    saveData();

    // Visual feedback
    const container = document.querySelector('.beer-name-container');
    if (container) {
      container.style.transform = 'scale(0.95)';
      setTimeout(() => {
        container.style.transform = 'scale(1)';
      }, 200);
    }

    return beer;
  };

  // Toggle automatic generation
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
      autoGenerateInterval = setInterval(() => generateAndDisplay(), 10000);
      if (autoGenerateBtn) {
        autoGenerateBtn.innerHTML = '<i class="fas fa-stop-circle"></i> Stop Auto';
        autoGenerateBtn.classList.add('active');
      }
      showToast('Auto-generating every 10 seconds');
    }
  };

  // Set up the dark mode toggle
  const setupDarkMode = () => {
    if (!themeToggleBtn) {
      console.warn("Theme toggle button not found");
      return;
    }

    // Event listener for toggling dark mode
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDarkMode = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');

      // Update button text
      themeToggleBtn.innerHTML = isDarkMode
        ? '<i class="fas fa-sun"></i> Light Mode'
        : '<i class="fas fa-moon"></i> Dark Mode';

      showToast(isDarkMode ? 'Dark mode enabled' : 'Light mode enabled');
    });

    // Apply saved mode preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
      document.body.classList.add('dark-mode');
      themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
  };

  // Set up event listeners
  const setupEventListeners = () => {
    // Generate button click
    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        generateAndDisplay();
        showToast('New beer generated! 🍺');
      });
    }

    // Auto-generate button click
    if (autoGenerateBtn) {
      autoGenerateBtn.addEventListener('click', () => toggleAutoGenerate());
    }

    // Clear history button click
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all history?')) {
          generatedNames = [];
          totalGenerated = 0;
          updateHistoryDisplay();
          updateGenerationCount();
          saveData();
          showToast('History cleared!');
        }
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
  };

  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // Initialize application
  const initialize = () => {
    // Load saved data
    loadSavedData();

    // Set up event listeners
    setupEventListeners();
    setupDarkMode();

    // Generate first beer name
    setTimeout(() => {
      if (generatedNames.length === 0) {
        generateAndDisplay();
        showToast('Welcome to the Beer Name Generator! 🍻');
      } else {
        // Display the most recent beer
        displayBeer(generatedNames[0]);
      }
    }, 500);
  };

  // Start initializing application
  initialize();
};