window.onload = function () {

  // Load beer data from JSON file
  const loadBeerData = async () => {
    try {
      const response = await fetch("./beer_data.json");
      if (!response.ok) throw new Error("Can't load beer_data.json. Check path and permissions.");
      return await response.json();
    } catch (error) {
      console.error("Error loading beer data:", error.message);
      return null;
    }
  };
  // Grab the toggle button and store it in a variable
const themeToggleBtn = document.getElementById('theme-toggle');

// Event listener for toggling dark mode
themeToggleBtn.addEventListener('click', () => {
  // Toggle the "dark-mode" class on the <body> element
  document.body.classList.toggle('dark-mode');

  // Save the mode to localStorage to persist the user's choice
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
});

// Automatically enable dark mode if it was saved as active before
document.addEventListener('DOMContentLoaded', () => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'enabled') {
    document.body.classList.add('dark-mode');
  }
});

  // Helper: get random integer
  const getRandomInt = max => Math.floor(Math.random() * max);

  // Helper: select multiple random elements from array
  const getRandomElements = (array, count, unique = false) => {
    if (!array || array.length === 0) {
      console.warn("Array empty or undefined during random selection.");
      return [];
    }
    if (!unique) {
      return Array.from({ length: count }, () => array[getRandomInt(array.length)]);
    }
    const uniqueIndices = new Set();
    while (uniqueIndices.size < count) uniqueIndices.add(getRandomInt(array.length));
    return [...uniqueIndices].map(index => array[index]);
  };

  // Helper: pick one random element from array
  const getRandomElement = array => array && array.length ? array[getRandomInt(array.length)] : "";

  // Beer-name generation functions
  const generateTitle = beerData => {
    const [taste1, taste2] = getRandomElements(beerData.tasteProfiles, 2, true);
    const creature = getRandomElement(beerData.mythicalCreatures);
    const adjective = getRandomElement(beerData.coolAdjectives);
    return `The ${adjective} ${taste1} and ${taste2} ${creature}`;
  };

  const generateAppearanceAndStyle = beerData => {
    const [adj1, adj2] = getRandomElements(beerData.coolAdjectives, 2, true);
    const color = getRandomElement(beerData.colors);
    const tasteProfile = getRandomElement(beerData.tasteProfiles);
    const type = getRandomElement(beerData.types);
    const category = getRandomElement(beerData.categories);
    return `a ${adj1}, ${adj2}, ${color}-colored ${tasteProfile} ${type} ${category}`;
  };

  const generateServingAndPresentation = beerData => {
    const adjective = getRandomElement(beerData.coolAdjectives);
    const adverb = getRandomElement(beerData.adverbs);
    const glassStyle = getRandomElement(beerData.beerGlasses);
    const tasteProfile = getRandomElement(beerData.tasteProfiles);
    const mouthfeel = getRandomElement(beerData.mouthfeelDescriptors);
    return `served ${adjective}, ${adverb} in a ${glassStyle}-styled glass, with hints of ${tasteProfile} and a ${mouthfeel} finish`;
  };

  const generateMouthfeelAndTaste = beerData => {
    const mouthfeel = getRandomElement(beerData.mouthfeelDescriptors);
    const tasteNoun = getRandomElement(beerData.tasteNouns);
    const [taste1, taste2] = getRandomElements(beerData.tasteProfiles, 2, true);
    const creature = getRandomElement(beerData.mythicalCreatures);
    return `it has a ${mouthfeel} ${tasteNoun} with notes of ${taste1} and ${taste2}, evoking the essence of a mythical ${creature}`;
  };

  const generateAdditionalDetail = beerData => {
    const category = getRandomElement(beerData.categories);
    const adjective = getRandomElement(beerData.coolAdjectives);
    const tasteProfile = getRandomElement(beerData.tasteProfiles);
    const creature = getRandomElement(beerData.mythicalCreatures);
    return `Inspired by a ${adjective} ${category}, with the soul of a legendary ${creature}, and delicate hints of ${tasteProfile}.`;
  };

  const generateFullBeerDescription = beerData => {
    return `${generateTitle(beerData)}, ${generateAppearanceAndStyle(beerData)}, ${generateServingAndPresentation(beerData)}, ${generateMouthfeelAndTaste(beerData)}. ${generateAdditionalDetail(beerData)}`;
  };

  // DOM Elements
  const randomNameElement = document.getElementById("random-name");
  const generateBtn = document.getElementById("generate");
  const autoGenerateBtn = document.getElementById("auto-generate");
  const historyList = document.getElementById("history-list");

  let autoGenerateInterval;  // Interval ID holder
  const generationHistory = []; // Generation history array

  // Functions to update UI and manage history
  const addToHistory = name => {
    generationHistory.push(name);
    updateHistoryUI();
  };

  const updateHistoryUI = () => {
    historyList.innerHTML = '';
    generationHistory.slice(-10).reverse().forEach(item => {
      const entry = document.createElement('div');
      entry.textContent = item;
      historyList.appendChild(entry);
    });
  };

  // Initialize beer generation
  const initialize = async () => {
    const beerData = await loadBeerData();
    if (!beerData) {
      console.error("Beer data unavailable. Application stopped.");
      return;
    }

    const setRandomName = () => {
      const beerDescription = generateFullBeerDescription(beerData);
      randomNameElement.textContent = beerDescription;
      addToHistory(beerDescription);
    };

    // Event: single generation
    generateBtn.addEventListener("click", setRandomName);

    // Event: automatic generation toggle
    autoGenerateBtn.addEventListener("click", () => {
      if (autoGenerateInterval) {
        clearInterval(autoGenerateInterval);
        autoGenerateInterval = null;
        autoGenerateBtn.innerHTML = `<i class="fas fa-sync-alt"></i> Generate Every 10 Secs`;
        autoGenerateBtn.classList.remove("active");
      } else {
        setRandomName();
        autoGenerateInterval = setInterval(setRandomName, 10000);
        autoGenerateBtn.innerHTML = `<i class="fas fa-stop-circle"></i> Stop Generating`;
        autoGenerateBtn.classList.add("active");
      }
    });

    // Generate first name immediately at load
    setRandomName();
  };

  // Initialize placeholder text
  randomNameElement.textContent = "Click below and savor the surprise!";

  // Start initializing application
  initialize();
};
