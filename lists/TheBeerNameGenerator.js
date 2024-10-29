const drinkAttributes = {

    categories : ["Abbey Beer", "Amber", "Barley-wine", "Belgian Ale", "Berliner Weisse", "Bière de Garde", "Bitter", "Black IPA", "Blond", "Bock", "Brown", "California Common", "Cream Ale", "Doppelbock", "Dubbel", "Dunkel", "Eisbock", "English Pale Ale", "Export Stout", "Fruit beer", "Gose", "Grisette", "Gueuze", "Hefeweizen", "IPA", "Imperial Stout", "Irish Red Ale", "Kölsch", "Lager", "Lambic", "Maibock", "Malt", "Mild Ale", "Munich Dunkel", "NEIPA (New England IPA)", "Oatmeal Stout", "Oktoberfest/Märzen", "Old Ale", "Pale Ale", "Pilsner", "Porter", "Quadrupel", "Red Ale", "Roggenbier", "Russian Imperial Stout", "Saison", "Schwarzbier", "Scotch Ale", "Session IPA", "Smoked Beer", "Sour Ale", "Spice/Herb/Vegetable Beer", "Stout", "Strong Ale", "Tripel", "Vienna Lager", "Wee Heavy", "Weizenbock", "Wheat", "Wheat beer", "White IPA", "Wild Ale"],
    coolAdjectives : ["Beautiful", "Intrusive", "Mesmerizing", "Visionary", "Charming", "Gritty", "Creon", "Fantasied", "Wicked Gothic", "Obscure", "Incomprehensible", "Depraved", "Cortical", "Fawning", "Unwanted", "Lovely", "Captivating", "Endearing", "Passionate", " Contemporary", "Recognizable", "Satisfying", "Wildest", "Giggly", "Torrid", "Ready", "Captivating"],
    types : ["Single", "Double", "Triple", "Quadruple"],
    beerGlasses : ["Teku-stemmed", "Pint", "Mug", "Steiner", "Goblet", "Chalice", "Snifter", "Tulip", "Stange", "Sampler"],
    colors : ["Black", "Silver", "Gray", "White", "Maroon", "Red", "Purple", "Fuchsia", "Green", "Lime", "Olive", "Yellow", "Navy", "Blue", "Teal", "Aqua"],
    mythicalCreatures : ["Abatwa", "Adarna", "Aethon", "Apsara", "Astral Dragon", "Bake-Kujira", "Bakeneko", "Bakunawa", "Banshee", "Barghest", "Basilisk", "Baba Yaga", "Balayang", "Banshee", "Carbunclo", "Ceffyl Dwr", "Celestial Unicorn", "Centaur", "Cerberus", "Chaneques", "Cherub", "Chaneques", "Chimera", "Chimera", "Chupacabra", "Crocotta", "Cyclops", "Cyclops", "Cuca", "Cynocephaly", "Doppelganger", "Dragon", "Divine Phoenix", "Echidna", "Elohim", "Faerie", "Faun", "Fenrir", "Fomorian", "Garuda", "Gargoyle", "Gnome", "Gorgimera", "Gorgon", "Griffin", "Harpy", "Heavenly Kitsune", "Hippocampus", "Hippogriff", "Itsumade", "Jackalope", "Jingwei", "Jersey Devil", "Jinn", "Jormungandr", "Kappa", "Karkadann", "Kelpie", "Kitsune", "Koschei the Deathless", "Koschei the Deathless", "Kraken", "La Llorona", "La Llorona", "Lamia", "Leutogi", "Leprechaun", "Manticore", "Medusa", "Mermaid", "Minotaur", "Mngwa", "Mothman", "Naga", "Nemean Lion", "Nian", "Nightcrawler", "Nuckelavee", "Ogre", "Orthrus", "Ouroboros", "Pegasus", "Phoenix", "Phoenix", "Pixie", "Quetzalcoatl", "Roc", "Roc", "Satyr", "Satyress", "Selkie", "Seraphim", "Seraphic Sphinx", "Shug Monkey", "Siren", "Sphinx", "Treant", "Tengu", "Tikbalang", "Thunderbird", "Typhon", "Unicorn", "Valkyrie", "Valkyrie", "Wendigo", "Werewolf", "Wraith", "Xorn", "Yale", "Yara-ma-yha-who", "Yeti", "Yowie", "Zaratan", "Zarathustra", "Zephyr Hound", "Ziz"],
    tasteProfiles : ["Acai", "Acidic", "Acetaldehyde", "Allspice", "Apple", "Ash", "Autumnal", "Alcoholic", "Almond", "Apricot", "Astringent", "Bakelite", "Barley", "Banana", "Bay Leaf", "Berries", "Bitter", "Boozy", "Beany", "Birch", "Black Currant", "Bourbon", "Brandy", "Bread", "Bright", "Blackberry", "Body", "Boysenberry", "Brett", "Briny", "Brown Sugar", "Blueberry", "Autolysed", "Balanced", "Barrel aged", "Belgiany", "Biscuity", "Brilliant", "Acetic", "Alkaline", "Amaretto", "Aromatic", "Blood Orange", "Bubblegum", "Bubbly", "Burnt", "Butterfinger", "Buttery", "Butyric", "Can-liner", "Candy", "Caprylic", "Buckwheat", "Butterscotch", "Cake", "Cantaloupe", "Caramelly", "Cardamom", "Cereal", "Champagne", "Characterless", "Carbolic", "Carrot", "Catty", "Chai", "Chamomile", "Caramel", "Carbonated", "Cheesy", "Chewy", "Chlorophenol", "Citrus", "Clementine", "Clove", "Coffee", "Cherry", "Chestnuts", "Chili", "Chocolate", "Chipotle", "Cocoa", "Citrusy", "Clean", "Cloudberry", "Charred", "Coconut", "Cinnamon", "Cloudy", "Coffeeish", "Cognac", "Cola", "Corn", "Creamy", "Cucumber", "Dark", "Deep", "Dry", "Earthy", "Corn Grits", "Crisp", "Cumin", "Dates", "Delicate", "Fig", "Fluffy", "Full", "Cranberry", "Crushable", "Dank", "Decadent", "Dry-hop", "Effervescent", "Elderflower", "Esters", "Elegant", "Fatty", "Floral", "Fruity", "Funky", "Gentle", "Cookie", "Coriander", "Estery", "Diacetyl", "Drying", "Flat", "Fragrant", "Fullness", "Garlic", "Gassy", "Geraniol", "Ginger", "Graham Cracker", "Gooseberry", "Grapefruit Peel", "Grapefruity", "Grassy", "Guava", "Habanero", "Hazelnut", "Hazy", "Heady", "Heat", "Heavy", "Herbaceous", "Herbal", "Hibiscus", "Honey", "Honey Mustard", "Honeydew", "Hop oil", "Hoppy", "Hot Sauce", "Huckleberry", "Husky", "Intense", "Isovaleric", "Jalapeño", "Juniper", "Lactose", "Green", "Green Tea", "Harsh", "Layered", "Isodoform", "Juicy", "Kiwi", "Lavender", "Lemony", "Licorice", "Lightstruck", "Lime", "Grainy", "Kettle-hop", "Laquer-like", "Grapes", "Jam-like", "Leathery", "Light", "Lingonberry", "Loganberry", "Lychee", "Maillard", "Malty", "Mango", "Maple", "Marshmallow", "Melon", "Metallic", "Mineral", "Moldy", "Murked", "Pecan", "Phenolic", "Meaty", "Mandarin", "Marmalade", "Melony", "Milk", "Minty", "Mouthcoating", "Musty", "Nutty", "Oily", "Oversweet", "Passion Fruit", "Peppery", "Pickle", "Macadamia Nut", "Nutmeg", "Oatmeal", "Nectarine", "Oakey", "Opaque", "Papaya", "Peachy", "Peaty", "Perfumy", "Pineapple", "Prunes", "Pumpkin", "Orange", "Papery", "Peanut Butter", "Pear", "Mellow", "Mercaptan", "Mimosa", "Molasses", "Mouthfeel", "Plastics", "Piquant", "Plums", "Puckering", "Pungent", "Raisins", "Rancid", "Refreshing", "Quince", "Raspberry", "Red Wine", "Resiny", "Roasty", "Rustic", "Sage", "Savory", "Sharp", "Rhubarb", "Rosemary", "Rye", "Salty", "Red Currant", "Red Fruit", "Resinous", "Port Wine", "Sendable", "Sherry", "Slushy", "Primings", "Pulpy", "Quaffable", "Rich", "Rum", "Saffron", "Satiating", "Sessionable", "Skunky", "Smoked", "Smoky", "Soft", "Sparkling", "Spring", "Stale", "Stone Fruit", "Slick", "Piney", "Pithy", "Pomegranate", "Pomelo", "Potpourri", "Powdery", "Pinpoint", "Strawberry", "Subtle", "Tangerine", "Tarry", "Tequila", "Toasty", "Tonka", "Spicy", "Umami", "Spruce", "Strength", "Sulfitic", "Trub", "Smooth", "Soapy", "Sour", "Soy sauce", "Spiced", "Sweetener", "Syrupy", "Sweetness", "Synthetic", "Tangy", "Sweet", "Tart", "Thick", "Tobacco", "Tropical", "Trub +Tannic", "Tea", "Thin", "Toffee", "Spritzy", "Star anise", "Strong", "Sulfury", "Sticky", "Straw-like", "Vanilla", "Vegetal", "Vinous", "Warm", "Watery", "Wheat", "Woody", "Yuzu", "Velvety", "Viola", "Warming", "Waxy", "Whisky +Worty", "Zesty", "Vinegar", "Walnut", "Watermelon", "Wet", "White Wine", "Yeasty", "Zippy"],
    mouthfeelDescriptors : ["Airy", "Astringent", "Bold", "Biting", "Brisk", "Bubbly", "Buttery", "Chewy", "Crisp", "Creamy", "Delicate", "Dense", "Effervescent", "Ethereal", "Fluffy", "Fizzy", "Full-bodied", "Grippy", "Hearty", "Intense", "Juicy", "Light", "Luscious", "Moist", "Parched", "Piquant", "Popping", "Prickly", "Rich", "Robust", "Round", "Satiny", "Sharp", "Silky", "Smooth", "Sparkling", "Substantial", "Syrupy", "Tangy", "Tart", "Taut", "Thick", "Tingly", "Velvety", "Vibrant", "Viscous", "Wet", "Weighty", "Zesty"],
    tasteNouns : ["Accent", "Aftertaste", "Aroma", "Bite", "Blend", "Bouquet", "Essence", "Flavor", "Hint", "Medley", "Mingle", "Note", "Nuance", "Palate", "Ripple", "Savor", "Sensation", "Tang", "Texture", "Tinge", "Undertone", "Zest", "Zing"],
    adverbs : ["Astoundingly", "Boldly", "Briskly", "Breathtakingly", "Captivatingly", "Carefully", "Cheerfully", "Daintily", "Delicately", "Divinely", "Dreamily", "Eclipsingly", "Effervescently", "Effortlessly", "Effulgently", "Elegantly", "Enchantingly", "Enigmatically", "Ethereally", "Exquisitely", "Fascinatingly", "Gently", "Gracefully", "Harmoniously", "Immaculately", "Impeccably", "Ineffably", "Intricately", "Irresistibly", "Lavishly", "Luxuriously", "Magically", "Majestically", "Mesmerizingly", "Mysteriously", "Pristinely", "Quickly", "Radiantly", "Rapturously", "Resplendently", "Rhythmically", "Silently", "Sensuously", "Seductively", "Serene", "Smoothly", "Softly", "Stellarly", "Stylishly", "Subtly", "Serenely", "Tenderly", "Transcendentally", "Unearthly", "Unfalteringly", "Vibrantly", "Vividly", "Voraciously", "Whimsically", "Euphorically", "Spiritedly", "Ardently", "Rhapsodically"],
}

window.onload = function () {
    const getRandomInt = (max) => Math.floor(Math.random() * max);

    const getRandomElements = (array, count, unique = false) => {
        if (!unique) return Array.from({ length: count }, () => array[getRandomInt(array.length)]);

        const uniqueIndices = new Set();
        while (uniqueIndices.size < count) {
            uniqueIndices.add(getRandomInt(array.length));
        }
        return Array.from(uniqueIndices).map(i => array[i]);
    };

    const getRandomElement = (array) => array[getRandomInt(array.length)];

    const generateTitle = () => {
        const [tasteProfile1, tasteProfile2] = getRandomElements(drinkAttributes.tasteProfiles, 2, true);
        const creature = getRandomElement(drinkAttributes.mythicalCreatures);
        return `The ${tasteProfile1} 'N ${tasteProfile2} ${creature}`;
    };

    const generateAppearanceAndStyle = () => {
        const [adjective] = getRandomElements(drinkAttributes.coolAdjectives, 1);
        const color = getRandomElement(drinkAttributes.colors);
        const [secondTasteProfile] = getRandomElements(drinkAttributes.tasteProfiles, 1);
        const type = getRandomElement(drinkAttributes.types);
        const category = getRandomElement(drinkAttributes.categories);

        return `a ${adjective} ${color}-coloured ${secondTasteProfile} ${type} ${category}`;
    };

    const generateServingAndPresentation = () => {
        const [servingAdjective] = getRandomElements(drinkAttributes.coolAdjectives, 1);
        const adverb = getRandomElement(drinkAttributes.adverbs);
        const glassStyle = getRandomElement(drinkAttributes.beerGlasses);

        return `served ${servingAdjective} and presented ${adverb} in a ${glassStyle}-styled glass`;
    };

    const generateMouthfeelAndTaste = () => {
        const mouthfeel = getRandomElement(drinkAttributes.mouthfeelDescriptors);
        const tasteNoun = getRandomElement(drinkAttributes.tasteNouns);

        return `it has a ${mouthfeel} ${tasteNoun}, high-fantasy style, high resolution, hyper-detail, --stylize 750`;
    };

    const getRandomName = () => {
        return `${generateTitle()}, ${generateAppearanceAndStyle()}, ${generateServingAndPresentation()}, ${generateMouthfeelAndTaste()}.`;
    };

    const setRandomName = () => {
        document.getElementById('random-name').innerText = getRandomName();
    };

    document.getElementById('generate').addEventListener('click', setRandomName);
    setRandomName();
};

