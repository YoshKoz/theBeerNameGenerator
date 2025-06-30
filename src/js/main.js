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
  const generateImageBtn = document.getElementById('generate-image-btn');

  // App state
  let autoGenerateInterval = null;
  let generatedNames = [];
  let maxStoredNames = 50;
  let currentBeer = null;

  // Make currentBeer accessible globally for the Midjourney integration
  window.currentBeer = null;

  // Helper function to adjust text size based on length
  const adjustTextSize = (text) => {
    if (!randomNameElement) return;

    randomNameElement.classList.remove('medium-text', 'small-text', 'smaller-text');

    if (text.length > 200) {
      randomNameElement.classList.add('smaller-text');
    } else if (text.length > 130) {
      randomNameElement.classList.add('small-text');
    } else if (text.length > 75) {
      randomNameElement.classList.add('medium-text');
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

  // Beer name generation functions
  const generateTitle = () => {
    const [taste1, taste2] = getRandomElements(beerData.tasteProfiles, 2, true);
    const creature = getRandomElement(beerData.mythicalCreatures);
    const adjective = getRandomElement(beerData.coolAdjectives);
    return `The ${adjective} ${taste1} and ${taste2} ${creature}`;
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
    return `served ${adjective}, ${adverb} in a ${glassStyle}-styled glass, with hints of ${tasteProfile} and a ${mouthfeel} finish`;
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

    return {
      region,
      technique,
      ibu,
      abv,
      occasion
    };
  };

  const generateAdditionalDetail = (specs) => {
    return `This ${specs.region} ${specs.technique} brew features ${specs.ibu} and ${specs.abv}, making it perfect for a ${specs.occasion}.`;
  };

  const generateFullBeerDescription = () => {
    const specs = generateBeerSpecs();
    const description = `${generateTitle()}, ${generateAppearanceAndStyle()}, ${generateServingAndPresentation()}, ${generateMouthfeelAndTaste()}. ${generateAdditionalDetail(specs)}`;

    return {
      name: description,
      timestamp: new Date(),
      id: `beer-${Date.now()}`,
      isFavorite: false,
      specs
    };
  };

  // Show a temporary notification
  const showToast = (message) => {
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
      }, 2000);
    }, 10);
  };

  // Make showToast accessible globally for the Midjourney integration
  window.showToast = showToast;

  // Update generation count
  const updateGenerationCount = () => {
    if (generationCountElement) {
      generationCountElement.textContent = `${generatedNames.length} names generated`;
    }
  };

  // Update history display
  const updateHistoryDisplay = () => {
    if (!historyList) return;

    historyList.innerHTML = '';
    generatedNames.slice(0, 10).forEach(beer => {
      const item = document.createElement('div');
      if (beer.isFavorite) item.classList.add('favorite');
      item.textContent = beer.name;
      historyList.appendChild(item);
    });
  };

  // Generate a new beer name and display it
  const generateAndDisplay = () => {
    const beer = generateFullBeerDescription();
    currentBeer = beer;

    // Update global currentBeer for Midjourney integration
    window.currentBeer = beer;

    // Add to history (limit size)
    generatedNames.unshift(beer);
    if (generatedNames.length > maxStoredNames) {
      generatedNames.pop();
    }

    // Update display
    if (randomNameElement) {
      randomNameElement.textContent = beer.name;
      adjustTextSize(beer.name);
    }

    updateHistoryDisplay();
    updateGenerationCount();

    return beer;
  };

  // Toggle automatic generation
  const toggleAutoGenerate = () => {
    if (autoGenerateInterval) {
      clearInterval(autoGenerateInterval);
      autoGenerateInterval = null;
      if (autoGenerateBtn) {
        autoGenerateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Generate Every 10 Secs';
        autoGenerateBtn.classList.remove('active');
      }
    } else {
      generateAndDisplay();
      autoGenerateInterval = setInterval(() => generateAndDisplay(), 10000);
      if (autoGenerateBtn) {
        autoGenerateBtn.innerHTML = '<i class="fas fa-stop-circle"></i> Stop Generating';
        autoGenerateBtn.classList.add('active');
      }
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
    });

    // Apply saved mode preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
      document.body.classList.add('dark-mode');
    }
  };

  // Set up event listeners
  const setupEventListeners = () => {
    // Generate button click
    if (generateBtn) {
      generateBtn.addEventListener('click', () => generateAndDisplay());
    }

    // Auto-generate button click
    if (autoGenerateBtn) {
      autoGenerateBtn.addEventListener('click', () => toggleAutoGenerate());
    }

    // Clear history button click
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => {
        generatedNames = [];
        updateHistoryDisplay();
        updateGenerationCount();
        showToast('History cleared!');
      });
    }

    // Generate image button click
    if (generateImageBtn) {
      generateImageBtn.addEventListener('click', () => {
        showToast('Generating image... (This would connect to Midjourney)');
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        generateAndDisplay();
      }
    });
  };

  // Initialize application
  const initialize = () => {
    // Set up event listeners
    setupEventListeners();
    setupDarkMode();

    // Generate first beer name
    setTimeout(() => {
      generateAndDisplay();
    }, 500);
  };

  // Start initializing application
  initialize();
};