// Beer Name Generator - Main Script

// Data structure containing all beer attributes
const drinkAttributes = {
    categories: ["Abbey Beer", "Amber", "Barley-wine", "Belgian Ale", "Berliner Weisse", "Bière de Garde", "Bitter", "Black IPA", "Blond", "Bock", "Brown", "California Common", "Cream Ale", "Doppelbock", "Dubbel", "Dunkel", "Eisbock", "English Pale Ale", "Export Stout", "Fruit beer", "Gose", "Grisette", "Gueuze", "Hefeweizen", "IPA", "Imperial Stout", "Irish Red Ale", "Kölsch", "Lager", "Lambic", "Maibock", "Malt", "Mild Ale", "Munich Dunkel", "NEIPA (New England IPA)", "Oatmeal Stout", "Oktoberfest/Märzen", "Old Ale", "Pale Ale", "Pilsner", "Porter", "Quadrupel", "Red Ale", "Roggenbier", "Russian Imperial Stout", "Saison", "Schwarzbier", "Scotch Ale", "Session IPA", "Smoked Beer", "Sour Ale", "Spice/Herb/Vegetable Beer", "Stout", "Strong Ale", "Tripel", "Vienna Lager", "Wee Heavy", "Weizenbock", "Wheat", "Wheat beer", "White IPA", "Wild Ale"],
    coolAdjectives: ["Beautiful", "Intrusive", "Mesmerizing", "Visionary", "Charming", "Gritty", "Creon", "Fantasied", "Wicked Gothic", "Obscure", "Incomprehensible", "Depraved", "Cortical", "Fawning", "Unwanted", "Lovely", "Captivating", "Endearing", "Passionate", "Contemporary", "Recognizable", "Satisfying", "Wildest", "Giggly", "Torrid", "Ready", "Captivating"],
    types: ["Single", "Double", "Triple", "Quadruple"],
    beerGlasses: ["Teku-stemmed", "Pint", "Mug", "Steiner", "Goblet", "Chalice", "Snifter", "Tulip", "Stange", "Sampler"],
    colors: ["Black", "Silver", "Gray", "White", "Maroon", "Red", "Purple", "Fuchsia", "Green", "Lime", "Olive", "Yellow", "Navy", "Blue", "Teal", "Aqua"],
    mythicalCreatures: ["Abatwa", "Adarna", "Aethon", "Apsara", "Astral Dragon", "Bake-Kujira", "Bakeneko", "Bakunawa", "Banshee", "Barghest", "Basilisk", "Baba Yaga", "Balayang", "Banshee", "Carbunclo", "Ceffyl Dwr", "Celestial Unicorn", "Centaur", "Cerberus", "Chaneques", "Cherub", "Chaneques", "Chimera", "Chimera", "Chupacabra", "Crocotta", "Cyclops", "Cyclops", "Cuca", "Cynocephaly", "Doppelganger", "Dragon", "Divine Phoenix", "Echidna", "Elohim", "Faerie", "Faun", "Fenrir", "Fomorian", "Garuda", "Gargoyle", "Gnome", "Gorgimera", "Gorgon", "Griffin", "Harpy", "Heavenly Kitsune", "Hippocampus", "Hippogriff", "Itsumade", "Jackalope", "Jingwei", "Jersey Devil", "Jinn", "Jormungandr", "Kappa", "Karkadann", "Kelpie", "Kitsune", "Koschei the Deathless", "Koschei the Deathless", "Kraken", "La Llorona", "La Llorona", "Lamia", "Leutogi", "Leprechaun", "Manticore", "Medusa", "Mermaid", "Minotaur", "Mngwa", "Mothman", "Naga", "Nemean Lion", "Nian", "Nightcrawler", "Nuckelavee", "Ogre", "Orthrus", "Ouroboros", "Pegasus", "Phoenix", "Phoenix", "Pixie", "Quetzalcoatl", "Roc", "Roc", "Satyr", "Satyress", "Selkie", "Seraphim", "Seraphic Sphinx", "Shug Monkey", "Siren", "Sphinx", "Treant", "Tengu", "Tikbalang", "Thunderbird", "Typhon", "Unicorn", "Valkyrie", "Valkyrie", "Wendigo", "Werewolf", "Wraith", "Xorn", "Yale", "Yara-ma-yha-who", "Yeti", "Yowie", "Zaratan", "Zarathustra", "Zephyr Hound", "Ziz"],
    tasteProfiles: ["Acai", "Acidic", "Almond", "Anise", "Apple", "Apricot", "Ash", "Astringent", "Banana", "Barnyard", "Basil", "Bay Leaf", "Beechwood", "Berry", "Bitter", "Black Currant", "Black Pepper", "Blackberry", "Blood Orange", "Blueberry", "Bourbon", "Brandy", "Bread", "Brioche", "Brown Sugar", "Bubblegum", "Butter", "Butterscotch", "Cacao", "Caramel", "Cardamom", "Cedar", "Chamomile", "Cherry", "Chestnut", "Chocolate", "Cinnamon", "Citrus", "Clove", "Cocoa", "Coconut", "Coffee", "Cola", "Cookie", "Coriander", "Cranberry", "Cream", "Creamy", "Crisp", "Cucumber", "Currant", "Dark Chocolate", "Dark Fruit", "Date", "Dill", "Dough", "Dry", "Earthy", "Elderberry", "Espresso", "Eucalyptus", "Fig", "Floral", "Fruity", "Funky", "Ginger", "Gooseberry", "Grapefruit", "Grapes", "Grassy", "Green Apple", "Green Tea", "Guava", "Hazelnut", "Herbal", "Hibiscus", "Honey", "Honeydew", "Hops", "Jasmine", "Juniper", "Kiwi", "Lavender", "Leafy", "Leather", "Lemon", "Lemongrass", "Licorice", "Lime", "Lychee", "Macadamia", "Malt", "Mandarin", "Mango", "Maple", "Melon", "Menthol", "Metallic", "Milk", "Mint", "Molasses", "Mushroom", "Musty", "Nectarine", "Nutmeg", "Nutty", "Oak", "Oats", "Orange", "Oregano", "Papaya", "Passionfruit", "Peach", "Peanut", "Pear", "Pecan", "Pepper", "Peppercorn", "Peppermint", "Persimmon", "Pine", "Pineapple", "Pistachio", "Plum", "Pomegranate", "Popcorn", "Prune", "Pumpkin", "Quince", "Raisin", "Raspberry", "Resin", "Rhubarb", "Roasted", "Rosemary", "Rum", "Rye", "Sage", "Salt", "Salty", "Sarsaparilla", "Savory", "Seaweed", "Sherry", "Smoke", "Smoky", "Sour", "Sourdough", "Spicy", "Star Anise", "Strawberry", "Sweet", "Tangerine", "Tangy", "Tannin", "Tarragon", "Tart", "Tea", "Thyme", "Toffee", "Tomato", "Tropical", "Umami", "Vanilla", "Vinous", "Violet", "Walnut", "Watermelon", "Wheat", "Whiskey", "White Chocolate", "White Pepper", "Woody", "Yeast", "Yogurt", "Zesty"],
    mouthfeelDescriptors: ["Airy", "Astringent", "Bold", "Biting", "Brisk", "Bubbly", "Buttery", "Chewy", "Crisp", "Creamy", "Delicate", "Dense", "Effervescent", "Ethereal", "Fluffy", "Fizzy", "Full-bodied", "Grippy", "Hearty", "Intense", "Juicy", "Light", "Luscious", "Moist", "Parched", "Piquant", "Popping", "Prickly", "Rich", "Robust", "Round", "Satiny", "Sharp", "Silky", "Smooth", "Sparkling", "Substantial", "Syrupy", "Tangy", "Tart", "Taut", "Thick", "Tingly", "Velvety", "Vibrant", "Viscous", "Wet", "Weighty", "Zesty"],
    tasteNouns: ["Accent", "Aftertaste", "Aroma", "Bite", "Blend", "Bouquet", "Essence", "Flavor", "Hint", "Medley", "Mingle", "Note", "Nuance", "Palate", "Ripple", "Savor", "Sensation", "Tang", "Texture", "Tinge", "Undertone", "Zest", "Zing"],
    adverbs: ["Astoundingly", "Boldly", "Briskly", "Breathtakingly", "Captivatingly", "Carefully", "Cheerfully", "Daintily", "Delicately", "Divinely", "Dreamily", "Eclipsingly", "Effervescently", "Effortlessly", "Effulgently", "Elegantly", "Enchantingly", "Enigmatically", "Ethereally", "Exquisitely", "Fascinatingly", "Gently", "Gracefully", "Harmoniously", "Immaculately", "Impeccably", "Ineffably", "Intricately", "Irresistibly", "Lavishly", "Luxuriously", "Magically", "Majestically", "Mesmerizingly", "Mysteriously", "Pristinely", "Quickly", "Radiantly", "Rapturously", "Resplendently", "Rhythmically", "Silently", "Sensuously", "Seductively", "Serene", "Smoothly", "Softly", "Stellarly", "Stylishly", "Subtly", "Serenely", "Tenderly", "Transcendentally", "Unearthly", "Unfalteringly", "Vibrantly", "Vividly", "Voraciously", "Whimsically", "Euphorically", "Spiritedly", "Ardently", "Rhapsodically"],
    // Enhanced attributes
    regions: ["Belgian", "German", "Czech", "British", "American", "Irish", "Scottish", "Japanese", "Australian", "New Zealand", "Canadian", "Nordic", "Dutch", "French", "Italian", "Spanish", "Mexican", "South African", "Brazilian", "Chinese", "Korean"],
    brewingTechniques: ["Barrel-Aged", "Cold-Fermented", "Bottle-Conditioned", "Dry-Hopped", "Kettle-Soured", "Spontaneously Fermented", "Open-Fermented", "Cask-Conditioned", "Nitro-Infused", "Oak-Aged", "Wild-Fermented", "Decoction Mashed", "Chill-Filtered", "Ice-Distilled", "Smoked", "Spice-Infused", "Fruit-Infused", "Cold-Brewed", "Hot-Side Whirlpooled", "Double Mashed"],
    ibuRanges: ["5-10 IBU", "10-20 IBU", "20-30 IBU", "30-40 IBU", "40-50 IBU", "50-60 IBU", "60-70 IBU", "70-80 IBU", "80-90 IBU", "90-100 IBU", "100+ IBU"],
    abvRanges: ["2-3% ABV", "3-4% ABV", "4-5% ABV", "5-6% ABV", "6-7% ABV", "7-8% ABV", "8-9% ABV", "9-10% ABV", "10-11% ABV", "11-12% ABV", "12%+ ABV"],
    occasions: ["Summer Session", "Winter Warmer", "Oktoberfest Special", "Christmas Limited Edition", "Springtime Release", "Harvest Celebration", "Anniversary Edition", "Brewmaster's Reserve", "Seasonal Small Batch", "Brewpub Exclusive", "Festival Special", "Cellar Reserve", "Limited Release", "Collaboration Series"]
};

// BeerNameGenerator Class
class BeerNameGenerator {
    constructor() {
        this.initializeElements();
        this.generatedNames = [];
        this.currentBeer = null;
        this.autoGenerateInterval = null;
        this.maxStoredNames = 50;
        this.setupEventListeners();
        this.populateFilters();
        this.generateAndDisplay(); // Generate first beer on load
    }

    // Initialize DOM elements
    initializeElements() {
        this.nameDisplay = document.getElementById('random-name');
        this.generateButton = document.getElementById('generate');
        this.autoGenerateButton = document.getElementById('tensecondsgenerator');
        this.colorPicker = document.getElementById('color-picker');
        this.historyList = document.getElementById('history-list');
        this.favoriteButton = document.getElementById('favorite-button');
        this.exportButton = document.getElementById('export-button');
        this.categoryFilter = document.getElementById('category-filter');
        this.showFavoritesCheckbox = document.getElementById('show-favorites');
        this.beerStats = document.getElementById('beer-stats');
        this.aboutLink = document.getElementById('about-link');
        this.aboutModal = document.getElementById('about-modal');
        this.closeModal = document.querySelector('.close-modal');

        // Midjourney prompt elements
        this.midjourneyPromptDisplay = document.getElementById('midjourney-prompt');
        this.copyMidjourneyButton = document.getElementById('copy-midjourney');
    }

    // Set up event listeners
    setupEventListeners() {
        this.generateButton.addEventListener('click', () => this.generateAndDisplay());

        this.autoGenerateButton.addEventListener('click', () => this.toggleAutoGenerate());

        this.colorPicker.addEventListener('change', (e) => {
            document.documentElement.style.setProperty('--primary-color', e.target.value);
            document.documentElement.style.setProperty('--accent-color', this.adjustColor(e.target.value, 20));
            document.getElementById('color').textContent = e.target.value;
        });

        this.favoriteButton.addEventListener('click', () => this.favoriteCurrent());

        this.exportButton.addEventListener('click', () => this.exportNames());

        // Midjourney prompt copy button
        this.copyMidjourneyButton.addEventListener('click', () => {
            if (this.currentBeer && this.currentBeer.midjourneyPrompt) {
                navigator.clipboard.writeText(this.currentBeer.midjourneyPrompt)
                    .then(() => this.showToast('Midjourney prompt copied to clipboard!'))
                    .catch(err => console.error('Copy failed:', err));
            }
        });

        this.categoryFilter.addEventListener('change', () => this.applyFilters());

        this.showFavoritesCheckbox.addEventListener('change', () => this.applyFilters());

        // Modal event listeners
        this.aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal();
        });

        this.closeModal.addEventListener('click', () => this.closeModalFunc());

        // Close modal when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === this.aboutModal) {
                this.closeModalFunc();
            }
        });

        // Keyboard shortcut for generating new name (spacebar)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
                e.preventDefault();
                this.generateAndDisplay();
            }
            // Close modal with Escape key
            if (e.key === 'Escape' && this.aboutModal.classList.contains('show')) {
                this.closeModalFunc();
            }
        });

        // Add click event to beer display for animation
        this.nameDisplay.addEventListener('click', () => {
            this.nameDisplay.classList.add('pulse');
            setTimeout(() => {
                this.nameDisplay.classList.remove('pulse');
            }, 2000);
        });
    }

    // Populate filter dropdowns
    populateFilters() {
        // Fill category filter with beer categories
        const categories = drinkAttributes.categories.slice(0, 15); // Just first 15 for simplicity
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            this.categoryFilter.appendChild(option);
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
        const [tasteProfile1, tasteProfile2] = this.getRandomElements(drinkAttributes.tasteProfiles, 2, true);
        const creature = this.getRandomElement(drinkAttributes.mythicalCreatures);
        return `The ${tasteProfile1} 'N ${tasteProfile2} ${creature}`;
    }

    // Generate appearance and style component
    generateAppearanceAndStyle() {
        const adjective = this.getRandomElement(drinkAttributes.coolAdjectives);
        const color = this.getRandomElement(drinkAttributes.colors);
        const secondTasteProfile = this.getRandomElement(drinkAttributes.tasteProfiles);
        const type = this.getRandomElement(drinkAttributes.types);
        const category = this.getRandomElement(drinkAttributes.categories);

        return `a ${adjective} ${color}-coloured ${secondTasteProfile} ${type} ${category}`;
    }

    // Generate serving and presentation component
    generateServingAndPresentation() {
        const servingAdjective = this.getRandomElement(drinkAttributes.coolAdjectives);
        const adverb = this.getRandomElement(drinkAttributes.adverbs);
        const glassStyle = this.getRandomElement(drinkAttributes.beerGlasses);

        return `served ${servingAdjective} and presented ${adverb} in a ${glassStyle}-styled glass`;
    }

    // Generate mouthfeel and taste component
    generateMouthfeelAndTaste() {
        const mouthfeel = this.getRandomElement(drinkAttributes.mouthfeelDescriptors);
        const tasteNoun = this.getRandomElement(drinkAttributes.tasteNouns);

        return `it has a ${mouthfeel} ${tasteNoun}`;
    }

    // Generate beer specifications
    generateBeerSpecs() {
        const region = this.getRandomElement(drinkAttributes.regions);
        const technique = this.getRandomElement(drinkAttributes.brewingTechniques);
        const ibu = this.getRandomElement(drinkAttributes.ibuRanges);
        const abv = this.getRandomElement(drinkAttributes.abvRanges);
        const occasion = this.getRandomElement(drinkAttributes.occasions);

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

        const fullName = `${title}, ${appearance}, ${presentation}, ${taste}. ${specDescription}.`;

        // Generate Midjourney prompt
        const midjourneyPrompt = this.generateMidjourneyPrompt(title, appearance, specs);

        return {
            name: fullName,
            timestamp: new Date(),
            id: `beer-${Date.now()}`,
            isFavorite: false,
            specs,
            midjourneyPrompt
        };
    }

    // Generate a Midjourney-friendly prompt based on the beer name
    generateMidjourneyPrompt(title, appearance, specs) {
        // Extract key visual elements from the beer name
        const creature = title.split(' ').slice(-1)[0]; // Get the mythical creature

        // Extract color from appearance
        const colorMatch = appearance.match(/([A-Za-z]+)-coloured/);
        const color = colorMatch ? colorMatch[1] : '';

        // Extract beer type
        const typeMatch = appearance.match(/(Single|Double|Triple|Quadruple) ([A-Za-z ]+)$/);
        const beerType = typeMatch ? typeMatch[2] : '';

        // Create a concise, visually-focused prompt for Midjourney
        let prompt = `A photorealistic bottle of beer labeled "${title}", `;
        prompt += `${color.toLowerCase()} colored ${beerType}, `;
        prompt += `${specs.region} style, ${specs.technique}, `;
        prompt += `with a mythical ${creature} on the label, `;
        prompt += `professional product photography, studio lighting, 8k, highly detailed`;

        return prompt;
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

        // Update display with animation using requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            this.nameDisplay.classList.remove('fadeIn');
            // Force reflow to ensure animation triggers
            void this.nameDisplay.offsetWidth;
            this.nameDisplay.classList.add('fadeIn');
            this.nameDisplay.innerHTML = beer.name;

            // Display Midjourney prompt
            this.midjourneyPromptDisplay.textContent = beer.midjourneyPrompt;

            this.updateHistoryDisplay();
            this.updateStats(beer);
        });

        return beer;
    }

    // Toggle automatic generation
    toggleAutoGenerate() {
        if (this.autoGenerateInterval) {
            clearInterval(this.autoGenerateInterval);
            this.autoGenerateInterval = null;
            this.autoGenerateButton.innerHTML = '<i class="fas fa-clock"></i> Generate every 10s';
            this.autoGenerateButton.classList.remove('active');
            this.showToast('Auto-generation stopped');
        } else {
            this.autoGenerateInterval = setInterval(() => this.generateAndDisplay(), 10000);
            this.autoGenerateButton.innerHTML = '<i class="fas fa-stop"></i> Stop Auto-Generation';
            this.autoGenerateButton.classList.add('active');
            this.showToast('Auto-generating every 10 seconds');
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
        // Remove any existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            // Force reflow
            void toast.offsetWidth;
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
                // Wait for transition to complete before removing
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        });
    }

    // Update history display
    updateHistoryDisplay() {
        const names = this.applyFilters(true);

        this.historyList.innerHTML = '';
        names.slice(0, 10).forEach(beer => {
            const item = document.createElement('div');
            item.className = 'history-item';
            if (beer.isFavorite) item.classList.add('favorite');
            // Add tabindex for keyboard accessibility
            item.tabIndex = 0;
            item.setAttribute('role', 'listitem');
            item.setAttribute('aria-label', `Beer name: ${beer.name}. ${beer.isFavorite ? 'Favorited' : 'Not favorited'}`);

            item.innerHTML = `
                <span class="beer-name">${beer.name}</span>
                <div class="beer-actions">
                    <button class="favorite-toggle" title="${beer.isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                        <i class="fas ${beer.isFavorite ? 'fa-heart' : 'fa-heart-o'}"></i>
                    </button>
                    <button class="copy-name" title="Copy to clipboard">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            `;

            // Add event listeners
            item.querySelector('.favorite-toggle').addEventListener('click', () => {
                beer.isFavorite = !beer.isFavorite;
                this.updateHistoryDisplay();
                this.showToast(beer.isFavorite ? 'Added to favorites!' : 'Removed from favorites');
            });

            item.querySelector('.copy-name').addEventListener('click', () => {
                navigator.clipboard.writeText(beer.name)
                    .then(() => this.showToast('Copied to clipboard!'))
                    .catch(err => console.error('Copy failed:', err));
            });

            // Add keyboard support
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    // Toggle favorite on Enter or Space
                    e.preventDefault();
                    beer.isFavorite = !beer.isFavorite;
                    this.updateHistoryDisplay();
                    this.showToast(beer.isFavorite ? 'Added to favorites!' : 'Removed from favorites');
                } else if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
                    // Copy on Ctrl+C or Cmd+C
                    navigator.clipboard.writeText(beer.name)
                        .then(() => this.showToast('Copied to clipboard!'))
                        .catch(err => console.error('Copy failed:', err));
                }
            });

            this.historyList.appendChild(item);
        });
    }

    // Apply filters to history list
    applyFilters(returnFiltered = false) {
        const categoryFilter = this.categoryFilter.value;
        const showFavoritesOnly = this.showFavoritesCheckbox.checked;

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
        this.beerStats.innerHTML = `
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

    // Open modal
    openModal() {
        this.aboutModal.classList.add('show');
    }

    // Close modal
    closeModalFunc() {
        this.aboutModal.classList.remove('show');
    }

    // Adjust color brightness (for generating accent color)
    adjustColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;

        return '#' + (
            0x1000000 + 
            (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 + 
            (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 + 
            (B < 255 ? (B < 0 ? 0 : B) : 255)
        ).toString(16).slice(1);
    }
}

// Initialize the generator when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    const generator = new BeerNameGenerator();

    // Store in window for debugging
    window.beerGenerator = generator;
});
