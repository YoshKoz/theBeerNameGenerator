window.onload = function () {
    // Function to load beer data from a JSON file
    const loadBeerData = async () => {
        try {
            const response = await fetch('./beer_data.json'); // Fetch the JSON file
            if (!response.ok) throw new Error('Failed to fetch beer data. Check file location or permissions.');
            return await response.json(); // Parse and return the JSON data
        } catch (error) {
            console.error('Error loading beer data:', error.message);
            return null; // Return null to handle failure gracefully
        }
    };

    // Helper function to get a random integer between 0 and max (exclusive)
    const getRandomInt = (max) => Math.floor(Math.random() * max);

    // Helper function to get random elements from an array
    const getRandomElements = (array, count, unique = false) => {
        if (!array || array.length === 0) {
            console.warn('Attempting to pick random elements from an empty or undefined array.');
            return [];
        }

        // If unique elements are not required, just pick random items
        if (!unique) return Array.from({ length: count }, () => array[getRandomInt(array.length)]);

        // Otherwise, ensure selected elements are unique
        const uniqueIndices = new Set();
        while (uniqueIndices.size < count) {
            uniqueIndices.add(getRandomInt(array.length));
        }

        return Array.from(uniqueIndices).map((index) => array[index]);
    };

    // Helper function to get a single random element from an array
    const getRandomElement = (array) => {
        if (!array || array.length === 0) {
            console.warn('Attempting to pick a random element from an empty or undefined array.');
            return '';
        }
        return array[getRandomInt(array.length)];
    };

    // Function to generate a random beer title
    const generateTitle = (beerData) => {
        const [tasteProfile1, tasteProfile2] = getRandomElements(beerData.tasteProfiles, 2, true);
        const creature = getRandomElement(beerData.mythicalCreatures);
        const adjective = getRandomElement(beerData.coolAdjectives);

        return `The ${adjective} ${tasteProfile1} and ${tasteProfile2} ${creature}`;
    };

    // Function to generate appearance and style description
    const generateAppearanceAndStyle = (beerData) => {
        const [adjective, secondaryAdjective] = getRandomElements(beerData.coolAdjectives, 2, true);
        const color = getRandomElement(beerData.colors);
        const tasteProfile = getRandomElement(beerData.tasteProfiles);
        const type = getRandomElement(beerData.types);
        const category = getRandomElement(beerData.categories);

        return `a ${adjective}, ${secondaryAdjective}, ${color}-colored ${tasteProfile} ${type} ${category}`;
    };

    // Function to generate serving and presentation details
    const generateServingAndPresentation = (beerData) => {
        const servingAdjective = getRandomElement(beerData.coolAdjectives);
        const adverb = getRandomElement(beerData.adverbs);
        const glassStyle = getRandomElement(beerData.beerGlasses);
        const extraTasteProfile = getRandomElement(beerData.tasteProfiles);
        const mouthfeel = getRandomElement(beerData.mouthfeelDescriptors);

        return `served ${servingAdjective}, ${adverb} in a ${glassStyle}-styled glass, with hints of ${extraTasteProfile} and a ${mouthfeel} finish`;
    };

    // Function to generate mouthfeel and taste description
    const generateMouthfeelAndTaste = (beerData) => {
        const mouthfeel = getRandomElement(beerData.mouthfeelDescriptors);
        const tasteNoun = getRandomElement(beerData.tasteNouns);
        const [tasteProfile1, tasteProfile2] = getRandomElements(beerData.tasteProfiles, 2, true);
        const mythicalCreature = getRandomElement(beerData.mythicalCreatures);

        return `it has a ${mouthfeel} ${tasteNoun} with notes of ${tasteProfile1} and ${tasteProfile2}, evoking the essence of a mythical ${mythicalCreature}`;
    };

    // Function to generate additional details about the beer
    const generateAdditionalDetail = (beerData) => {
        const category = getRandomElement(beerData.categories);
        const adjective = getRandomElement(beerData.coolAdjectives);
        const tasteProfile = getRandomElement(beerData.tasteProfiles);
        const mythicalCreature = getRandomElement(beerData.mythicalCreatures);

        return `Inspired by a ${adjective} ${category}, with the soul of a legendary ${mythicalCreature}, and delicate hints of ${tasteProfile}.`;
    };

    // Main function to randomize and generate beer name and description
    const getRandomName = (beerData) => {
        return `${generateTitle(beerData)}, ${generateAppearanceAndStyle(beerData)}, ${generateServingAndPresentation(
            beerData
        )}, ${generateMouthfeelAndTaste(beerData)}. ${generateAdditionalDetail(beerData)}`;
    };

    // Initialize the application
    const initialize = async () => {
        const beerData = await loadBeerData();

        if (!beerData) {
            console.error('Beer data could not be loaded or is invalid.');
            return;
        }

        const randomNameElement = document.getElementById('random-name');
        const generateButton = document.getElementById('generate');

        if (!randomNameElement || !generateButton) {
            console.error("DOM elements with IDs 'random-name' or 'generate' are missing.");
            return;
        }

        // Set a random name on button click
        const setRandomName = () => {
            randomNameElement.innerText = getRandomName(beerData);
        };

        generateButton.addEventListener('click', setRandomName);
        setRandomName(); // Generate a random name on page load
    };

    initialize(); // Start the application
};