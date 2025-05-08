// Data structure containing all beer attributes
const drinkAttributes = {
    // Original data arrays preserved...
    categories: ["Abbey Beer", "Amber", "Barley-wine", "Belgian Ale", "Berliner Weisse", "Bière de Garde", "Bitter", "Black IPA", "Blond", "Bock", "Brown", "California Common", "Cream Ale", "Doppelbock", "Dubbel", "Dunkel", "Eisbock", "English Pale Ale", "Export Stout", "Fruit beer", "Gose", "Grisette", "Gueuze", "Hefeweizen", "IPA", "Imperial Stout", "Irish Red Ale", "Kölsch", "Lager", "Lambic", "Maibock", "Malt", "Mild Ale", "Munich Dunkel", "NEIPA (New England IPA)", "Oatmeal Stout", "Oktoberfest/Märzen", "Old Ale", "Pale Ale", "Pilsner", "Porter", "Quadrupel", "Red Ale", "Roggenbier", "Russian Imperial Stout", "Saison", "Schwarzbier", "Scotch Ale", "Session IPA", "Smoked Beer", "Sour Ale", "Spice/Herb/Vegetable Beer", "Stout", "Strong Ale", "Tripel", "Vienna Lager", "Wee Heavy", "Weizenbock", "Wheat", "Wheat beer", "White IPA", "Wild Ale"],
    coolAdjectives: ["Beautiful", "Intrusive", "Mesmerizing", "Visionary", "Charming", "Gritty", "Creon", "Fantasied", "Wicked Gothic", "Obscure", "Incomprehensible", "Depraved", "Cortical", "Fawning", "Unwanted", "Lovely", "Captivating", "Endearing", "Passionate", " Contemporary", "Recognizable", "Satisfying", "Wildest", "Giggly", "Torrid", "Ready", "Captivating"],
    types: ["Single", "Double", "Triple", "Quadruple"],
    beerGlasses: ["Teku-stemmed", "Pint", "Mug", "Steiner", "Goblet", "Chalice", "Snifter", "Tulip", "Stange", "Sampler"],
    colors: ["Black", "Silver", "Gray", "White", "Maroon", "Red", "Purple", "Fuchsia", "Green", "Lime", "Olive", "Yellow", "Navy", "Blue", "Teal", "Aqua"],
    mythicalCreatures: ["Abatwa", "Adarna", "Aethon", "Apsara", "Astral Dragon", "Bake-Kujira", "Bakeneko", "Bakunawa", "Banshee", "Barghest", "Basilisk", "Baba Yaga", "Balayang", "Banshee", "Carbunclo", "Ceffyl Dwr", "Celestial Unicorn", "Centaur", "Cerberus", "Chaneques", "Cherub", "Chaneques", "Chimera", "Chimera", "Chupacabra", "Crocotta", "Cyclops", "Cyclops", "Cuca", "Cynocephaly", "Doppelganger", "Dragon", "Divine Phoenix", "Echidna", "Elohim", "Faerie", "Faun", "Fenrir", "Fomorian", "Garuda", "Gargoyle", "Gnome", "Gorgimera", "Gorgon", "Griffin", "Harpy", "Heavenly Kitsune", "Hippocampus", "Hippogriff", "Itsumade", "Jackalope", "Jingwei", "Jersey Devil", "Jinn", "Jormungandr", "Kappa", "Karkadann", "Kelpie", "Kitsune", "Koschei the Deathless", "Koschei the Deathless", "Kraken", "La Llorona", "La Llorona", "Lamia", "Leutogi", "Leprechaun", "Manticore", "Medusa", "Mermaid", "Minotaur", "Mngwa", "Mothman", "Naga", "Nemean Lion", "Nian", "Nightcrawler", "Nuckelavee", "Ogre", "Orthrus", "Ouroboros", "Pegasus", "Phoenix", "Phoenix", "Pixie", "Quetzalcoatl", "Roc", "Roc", "Satyr", "Satyress", "Selkie", "Seraphim", "Seraphic Sphinx", "Shug Monkey", "Siren", "Sphinx", "Treant", "Tengu", "Tikbalang", "Thunderbird", "Typhon", "Unicorn", "Valkyrie", "Valkyrie", "Wendigo", "Werewolf", "Wraith", "Xorn", "Yale", "Yara-ma-yha-who", "Yeti", "Yowie", "Zaratan", "Zarathustra", "Zephyr Hound", "Ziz"],
    tasteProfiles: ["Acai", "Acidic", "Acetaldehyde", "Allspice", "Apple", "Ash", "Autumnal", "Alcoholic", "Almond", "Apricot", "Astringent", "Bakelite", "Barley", "Banana", "Bay Leaf", "Berries", "Bitter", "Boozy", "Beany", "Birch", "Black Currant", "Bourbon", "Brandy", "Bread", "Bright", "Blackberry", "Body", "Boysenberry", "Brett", "Briny", "Brown Sugar", "Blueberry", "Autolysed", "Balanced", "Barrel aged", "Belgiany", "Biscuity", "Brilliant", "Acetic", "Alkaline", "Amaretto", "Aromatic", "Blood Orange", "Bubblegum", "Bubbly", "Burnt", "Butterfinger", "Buttery", "Butyric", "Can-liner", "Candy", "Caprylic", "Buckwheat", "Butterscotch", "Cake", "Cantaloupe", "Caramelly", "Cardamom", "Cereal", "Champagne", "Characterless", "Carbolic", "Carrot", "Catty", "Chai", "Chamomile", "Caramel", "Carbonated", "Cheesy", "Chewy", "Chlorophenol", "Citrus", "Clementine", "Clove", "Coffee", "Cherry", "Chestnuts", "Chili", "Chocolate", "Chipotle", "Cocoa", "Citrusy", "Clean", "Cloudberry", "Charred", "Coconut", "Cinnamon", "Cloudy", "Coffeeish", "Cognac", "Cola", "Corn", "Creamy", "Cucumber", "Dark", "Deep", "Dry", "Earthy", "Corn Grits", "Crisp", "Cumin", "Dates", "Delicate", "Fig", "Fluffy", "Full", "Cranberry", "Crushable", "Dank", "Decadent", "Dry-hop", "Effervescent", "Elderflower", "Esters", "Elegant", "Fatty", "Floral", "Fruity", "Funky", "Gentle", "Cookie", "Coriander", "Estery", "Diacetyl", "Drying", "Flat", "Fragrant", "Fullness", "Garlic", "Gassy", "Geraniol", "Ginger", "Graham Cracker", "Gooseberry", "Grapefruit Peel", "Grapefruity", "Grassy", "Guava", "Habanero", "Hazelnut", "Hazy", "Heady", "Heat", "Heavy", "Herbaceous", "Herbal", "Hibiscus", "Honey", "Honey Mustard", "Honeydew", "Hop oil", "Hoppy", "Hot Sauce", "Huckleberry", "Husky", "Intense", "Isovaleric", "Jalapeño", "Juniper", "Lactose", "Green", "Green Tea", "Harsh", "Layered", "Isodoform", "Juicy", "Kiwi", "Lavender", "Lemony", "Licorice", "Lightstruck", "Lime", "Grainy", "Kettle-hop", "Laquer-like", "Grapes", "Jam-like", "Leathery", "Light", "Lingonberry", "Loganberry", "Lychee", "Maillard", "Malty", "Mango", "Maple", "Marshmallow", "Melon", "Metallic", "Mineral", "Moldy", "Murked", "Pecan", "Phenolic", "Meaty", "Mandarin", "Marmalade", "Melony", "Milk", "Minty", "Mouthcoating", "Musty", "Nutty", "Oily", "Oversweet", "Passion Fruit", "Peppery", "Pickle", "Macadamia Nut", "Nutmeg", "Oatmeal", "Nectarine", "Oakey", "Opaque", "Papaya", "Peachy", "Peaty", "Perfumy", "Pineapple", "Prunes", "Pumpkin", "Orange", "Papery", "Peanut Butter", "Pear", "Mellow", "Mercaptan", "Mimosa", "Molasses", "Mouthfeel", "Plastics", "Piquant", "Plums", "Puckering", "Pungent", "Raisins", "Rancid", "Refreshing", "Quince", "Raspberry", "Red Wine", "Resiny", "Roasty", "Rustic", "Sage", "Savory", "Sharp", "Rhubarb", "Rosemary", "Rye", "Salty", "Red Currant", "Red Fruit", "Resinous", "Port Wine", "Sendable", "Sherry", "Slushy", "Primings", "Pulpy", "Quaffable", "Rich", "Rum", "Saffron", "Satiating", "Sessionable", "Skunky", "Smoked", "Smoky", "Soft", "Sparkling", "Spring", "Stale", "Stone Fruit", "Slick", "Piney", "Pithy", "Pomegranate", "Pomelo", "Potpourri", "Powdery", "Pinpoint", "Strawberry", "Subtle", "Tangerine", "Tarry", "Tequila", "Toasty", "Tonka", "Spicy", "Umami", "Spruce", "Strength", "Sulfitic", "Trub", "Smooth", "Soapy", "Sour", "Soy sauce", "Spiced", "Sweetener", "Syrupy", "Sweetness", "Synthetic", "Tangy", "Sweet", "Tart", "Thick", "Tobacco", "Tropical", "Trub +Tannic", "Tea", "Thin", "Toffee", "Spritzy", "Star anise", "Strong", "Sulfury", "Sticky", "Straw-like", "Vanilla", "Vegetal", "Vinous", "Warm", "Watery", "Wheat", "Woody", "Yuzu", "Velvety", "Viola", "Warming", "Waxy", "Whisky +Worty", "Zesty", "Vinegar", "Walnut", "Watermelon", "Wet", "White Wine", "Yeasty", "Zippy"],
    mouthfeelDescriptors: ["Airy", "Astringent", "Bold", "Biting", "Brisk", "Bubbly", "Buttery", "Chewy", "Crisp", "Creamy", "Delicate", "Dense", "Effervescent", "Ethereal", "Fluffy", "Fizzy", "Full-bodied", "Grippy", "Hearty", "Intense", "Juicy", "Light", "Luscious", "Moist", "Parched", "Piquant", "Popping", "Prickly", "Rich", "Robust", "Round", "Satiny", "Sharp", "Silky", "Smooth", "Sparkling", "Substantial", "Syrupy", "Tangy", "Tart", "Taut", "Thick", "Tingly", "Velvety", "Vibrant", "Viscous", "Wet", "Weighty", "Zesty"],
    tasteNouns: ["Accent", "Aftertaste", "Aroma", "Bite", "Blend", "Bouquet", "Essence", "Flavor", "Hint", "Medley", "Mingle", "Note", "Nuance", "Palate", "Ripple", "Savor", "Sensation", "Tang", "Texture", "Tinge", "Undertone", "Zest", "Zing"],
    adverbs: ["Astoundingly", "Boldly", "Briskly", "Breathtakingly", "Captivatingly", "Carefully", "Cheerfully", "Daintily", "Delicately", "Divinely", "Dreamily", "Eclipsingly", "Effervescently", "Effortlessly", "Effulgently", "Elegantly", "Enchantingly", "Enigmatically", "Ethereally", "Exquisitely", "Fascinatingly", "Gently", "Gracefully", "Harmoniously", "Immaculately", "Impeccably", "Ineffably", "Intricately", "Irresistibly", "Lavishly", "Luxuriously", "Magically", "Majestically", "Mesmerizingly", "Mysteriously", "Pristinely", "Quickly", "Radiantly", "Rapturously", "Resplendently", "Rhythmically", "Silently", "Sensuously", "Seductively", "Serene", "Smoothly", "Softly", "Stellarly", "Stylishly", "Subtly", "Serenely", "Tenderly", "Transcendentally", "Unearthly", "Unfalteringly", "Vibrantly", "Vividly", "Voraciously", "Whimsically", "Euphorically", "Spiritedly", "Ardently", "Rhapsodically"],
    // New attributes for enhanced generator
    regions: ["Belgian", "German", "Czech", "British", "American", "Irish", "Scottish", "Japanese", "Australian", "New Zealand", "Canadian", "Nordic", "Dutch", "French", "Italian", "Spanish", "Mexican", "South African", "Brazilian", "Chinese", "Korean"],
    brewingTechniques: ["Barrel-Aged", "Cold-Fermented", "Bottle-Conditioned", "Dry-Hopped", "Kettle-Soured", "Spontaneously Fermented", "Open-Fermented", "Cask-Conditioned", "Nitro-Infused", "Oak-Aged", "Wild-Fermented", "Decoction Mashed", "Chill-Filtered", "Ice-Distilled", "Smoked", "Spice-Infused", "Fruit-Infused", "Cold-Brewed", "Hot-Side Whirlpooled", "Double Mashed"],
    ibuRanges: ["5-10 IBU", "10-20 IBU", "20-30 IBU", "30-40 IBU", "40-50 IBU", "50-60 IBU", "60-70 IBU", "70-80 IBU", "80-90 IBU", "90-100 IBU", "100+ IBU"],
    abvRanges: ["2-3% ABV", "3-4% ABV", "4-5% ABV", "5-6% ABV", "6-7% ABV", "7-8% ABV", "8-9% ABV", "9-10% ABV", "10-11% ABV", "11-12% ABV", "12%+ ABV"],
    occasions: ["Summer Session", "Winter Warmer", "Oktoberfest Special", "Christmas Limited Edition", "Springtime Release", "Harvest Celebration", "Anniversary Edition", "Brewmaster's Reserve", "Seasonal Small Batch", "Brewpub Exclusive", "Festival Special", "Cellar Reserve", "Limited Release", "Collaboration Series"]
};

// BeerNameGenerator class to encapsulate all functionality
class BeerNameGenerator {
    constructor(attributes) {
        this.attributes = attributes;
        this.generatedNames = [];
        this.autoGenerateInterval = null;
        this.maxStoredNames = 50;
        this.initializeElements();
        this.setupEventListeners();
        this.generateAndDisplay(); // Generate first beer on load
    }

    // Initialize DOM elements
    initializeElements() {
        this.nameDisplay = document.getElementById('random-name');
        this.generateButton = document.getElementById('generate');
        this.autoGenerateButton = document.getElementById('tensecondsgenerator');
        this.colorPicker = document.getElementById('color-picker');
        this.historyList = document.getElementById('history-list');

        // Create new elements for enhanced functionality
        this.createEnhancedUI();
    }

    // Create additional UI elements for enhanced functionality
    createEnhancedUI() {
        // Create favorite button
        this.favoriteButton = document.createElement('button');
        this.favoriteButton.id = 'favorite-button';
        this.favoriteButton.className = 'btn btn-secondary';
        this.favoriteButton.innerHTML = '❤️ Favorite';

        // Create export button
        this.exportButton = document.createElement('button');
        this.exportButton.id = 'export-button';
        this.exportButton.className = 'btn btn-info';
        this.exportButton.innerHTML = '📤 Export Names';

        // Create filter controls
        this.filterContainer = document.createElement('div');
        this.filterContainer.id = 'filter-container';
        this.filterContainer.className = 'filter-controls';

        // Add category filter
        const categoryFilter = document.createElement('select');
        categoryFilter.id = 'category-filter';
        categoryFilter.innerHTML = '<option value="">All Beer Types</option>' + 
            this.attributes.categories.slice(0, 15).map(cat => 
                `<option value="${cat}">${cat}</option>`).join('');

        // Add favorites toggle
        const showFavoritesToggle = document.createElement('label');
        showFavoritesToggle.innerHTML = '<input type="checkbox" id="show-favorites"> Show Favorites Only';

        // Assemble filter container
        this.filterContainer.appendChild(categoryFilter);
        this.filterContainer.appendChild(showFavoritesToggle);

        // Add new elements to the DOM
        const controlsContainer = document.querySelector('.whatbeer');
        controlsContainer.appendChild(this.favoriteButton);
        controlsContainer.appendChild(this.exportButton);
        controlsContainer.appendChild(this.filterContainer);

        // Create stats container
        this.statsContainer = document.createElement('div');
        this.statsContainer.id = 'stats-container';
        this.statsContainer.className = 'stats-info';
        this.statsContainer.innerHTML = '<h4>Beer Stats</h4><div id="beer-stats"></div>';
        controlsContainer.appendChild(this.statsContainer);
    }

    // Set up event listeners
    setupEventListeners() {
        this.generateButton.addEventListener('click', () => this.generateAndDisplay());

        this.autoGenerateButton.addEventListener('click', () => this.toggleAutoGenerate());

        this.colorPicker.addEventListener('change', (e) => {
            document.getElementById('color').textContent = e.target.value;
            document.documentElement.style.setProperty('--accent-color', e.target.value);
        });

        this.favoriteButton.addEventListener('click', () => this.favoriteCurrent());

        this.exportButton.addEventListener('click', () => this.exportNames());

        // Add filter event listeners
        document.getElementById('category-filter').addEventListener('change', () => this.applyFilters());
        document.getElementById('show-favorites').addEventListener('change', () => this.applyFilters());

        // Keyboard shortcut for generating new name (spacebar)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
                e.preventDefault();
                this.generateAndDisplay();
            }
        });
    }

    // Get random element from array
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Get multiple random elements from array
    getRandomElements(array, count, unique = false) {
        if (!unique) return Array.from({length: count}, () => this.getRandomElement(array));

        const uniqueIndices = new Set();
        while (uniqueIndices.size < count && uniqueIndices.size < array.length) {
            uniqueIndices.add(Math.floor(Math.random() * array.length));
        }
        return Array.from(uniqueIndices).map(i => array[i]);
    }

    // Generate title component
    generateTitle() {
        const [tasteProfile1, tasteProfile2] = this.getRandomElements(this.attributes.tasteProfiles, 2, true);
        const creature = this.getRandomElement(this.attributes.mythicalCreatures);
        return `The ${tasteProfile1} 'N ${tasteProfile2} ${creature}`;
    }

    // Generate appearance and style component
    generateAppearanceAndStyle() {
        const adjective = this.getRandomElement(this.attributes.coolAdjectives);
        const color = this.getRandomElement(this.attributes.colors);
        const secondTasteProfile = this.getRandomElement(this.attributes.tasteProfiles);
        const type = this.getRandomElement(this.attributes.types);
        const category = this.getRandomElement(this.attributes.categories);

        return `a ${adjective} ${color}-coloured ${secondTasteProfile} ${type} ${category}`;
    }

    // Generate serving and presentation component
    generateServingAndPresentation() {
        const servingAdjective = this.getRandomElement(this.attributes.coolAdjectives);
        const adverb = this.getRandomElement(this.attributes.adverbs);
        const glassStyle = this.getRandomElement(this.attributes.beerGlasses);

        return `served ${servingAdjective} and presented ${adverb} in a ${glassStyle}-styled glass`;
    }

    // Generate mouthfeel and taste component
    generateMouthfeelAndTaste() {
        const mouthfeel = this.getRandomElement(this.attributes.mouthfeelDescriptors);
        const tasteNoun = this.getRandomElement(this.attributes.tasteNouns);

        return `it has a ${mouthfeel} ${tasteNoun}`;
    }

    // Generate beer specifications
    generateBeerSpecs() {
        const region = this.getRandomElement(this.attributes.regions);
        const technique = this.getRandomElement(this.attributes.brewingTechniques);
        const ibu = this.getRandomElement(this.attributes.ibuRanges);
        const abv = this.getRandomElement(this.attributes.abvRanges);
        const occasion = this.getRandomElement(this.attributes.occasions);

        return {
            region,
            technique,
            ibu,
            abv,
            occasion
        };
    }

    // Generate complete random beer name with specs
    generateBeerName() {
        const title = this.generateTitle();
        const appearance = this.generateAppearanceAndStyle();
        const presentation = this.generateServingAndPresentation();
        const taste = this.generateMouthfeelAndTaste();
        const specs = this.generateBeerSpecs();

        // Create a longer, more detailed description by incorporating the beer specs
        const specDescription = `This ${specs.region} ${specs.technique} brew features ${specs.ibu} and ${specs.abv}, making it perfect for a ${specs.occasion}`;

        return {
            name: `${title}, ${appearance}, ${presentation}, ${taste}. ${specDescription}.`,
            timestamp: new Date(),
            id: `beer-${Date.now()}`,
            isFavorite: false,
            specs
        };
    }

    // Generate a new beer name and display it
    generateAndDisplay() {
        const beer = this.generateBeerName();
        this.currentBeer = beer;

        // Add to history (limit size)
        this.generatedNames.unshift(beer);
        if (this.generatedNames.length > this.maxStoredNames) {
            this.generatedNames.pop();
        }

        // Update display
        this.nameDisplay.innerHTML = beer.name;
        this.updateHistoryDisplay();
        this.updateStats(beer);

        return beer;
    }

    // Toggle automatic generation
    toggleAutoGenerate() {
        if (this.autoGenerateInterval) {
            clearInterval(this.autoGenerateInterval);
            this.autoGenerateInterval = null;
            this.autoGenerateButton.textContent = 'Generate new name every 10 seconds';
            this.autoGenerateButton.classList.remove('active');
        } else {
            this.autoGenerateInterval = setInterval(() => this.generateAndDisplay(), 10000);
            this.autoGenerateButton.textContent = 'Stop Auto-Generation';
            this.autoGenerateButton.classList.add('active');
        }
    }

    // Favorite current beer name
    favoriteCurrent() {
        if (this.currentBeer) {
            this.currentBeer.isFavorite = !this.currentBeer.isFavorite;
            this.updateHistoryDisplay();

            const message = this.currentBeer.isFavorite 
                ? 'Added to favorites!' 
                : 'Removed from favorites';

            this.showToast(message);
        }
    }

    // Show a temporary notification
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Animate
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        }, 10);
    }

    // Update history display
    updateHistoryDisplay() {
        const names = this.applyFilters(true);

        this.historyList.innerHTML = '';
        names.slice(0, 10).forEach(beer => {
            const item = document.createElement('div');
            item.className = 'history-item';
            if (beer.isFavorite) item.classList.add('favorite');

            item.innerHTML = `
                <span class="beer-name">${beer.name}</span>
                <div class="beer-actions">
                    <button class="favorite-toggle">${beer.isFavorite ? '❤️' : '🤍'}</button>
                    <button class="copy-name">📋</button>
                </div>
            `;

            // Add event listeners
            item.querySelector('.favorite-toggle').addEventListener('click', () => {
                beer.isFavorite = !beer.isFavorite;
                this.updateHistoryDisplay();
            });

            item.querySelector('.copy-name').addEventListener('click', () => {
                navigator.clipboard.writeText(beer.name)
                    .then(() => this.showToast('Copied to clipboard!'))
                    .catch(err => console.error('Copy failed:', err));
            });

            this.historyList.appendChild(item);
        });
    }

    // Apply filters to history list
    applyFilters(returnFiltered = false) {
        const categoryFilter = document.getElementById('category-filter').value;
        const showFavoritesOnly = document.getElementById('show-favorites').checked;

        const filtered = this.generatedNames.filter(beer => {
            let match = true;

            if (categoryFilter && !beer.name.includes(categoryFilter)) {
                match = false;
            }

            if (showFavoritesOnly && !beer.isFavorite) {
                match = false;
            }

            return match;
        });

        if (returnFiltered) return filtered;

        this.updateHistoryDisplay();
        return filtered;
    }

    // Update beer stats display
    updateStats(beer) {
        const statsContainer = document.getElementById('beer-stats');
        statsContainer.innerHTML = `
            <p><strong>Origin:</strong> ${beer.specs.region}</p>
            <p><strong>Technique:</strong> ${beer.specs.technique}</p>
            <p><strong>Bitterness:</strong> ${beer.specs.ibu}</p>
            <p><strong>Strength:</strong> ${beer.specs.abv}</p>
            <p><strong>Type:</strong> ${beer.specs.occasion}</p>
        `;
    }

    // Export generated names
    exportNames() {
        const names = this.generatedNames.map(beer => {
            return {
                name: beer.name,
                favorite: beer.isFavorite,
                specs: beer.specs,
                generated: beer.timestamp
            };
        });

        const dataStr = JSON.stringify(names, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportName = `beer-names-${new Date().toISOString().slice(0,10)}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportName);
        linkElement.click();

        this.showToast('Names exported successfully!');
    }
}

// Initialize the generator when the document is loaded
window.onload = function() {
    // Initialize with the attributes dataset
    const generator = new BeerNameGenerator(drinkAttributes);

    // Store in window for debugging
    window.beerGenerator = generator;
};
