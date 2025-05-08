const categorys = ["Porter", "Stout", "IPA", "Pils", "Lager", "Malt", "Witbier", "Fruitbier", "Blond", "Weizen", "Bruin", "Bock", "Abdijbier", "Amber", "Saison" ];

const coolAdjectives = ["Beautiful", "Intrusive", "Mesmerizing", "Visionary", "Charming", "Gritty", "Creon", "Fantasied", "Wicked Gothic", "Obscure", "Incomprehensible", "Depraved", "Cortical", "Fawning", "Unwanted", "Lovely", "Captivating", "Endearing", "Passionate"," Contemporary","Recognizable","Satisfying", "Wildest", "Giggly", "Torrid", "Ready", "Captivating" ];

const tastes = ["Licht Fris", "Licht Bitter", "Donker Zoet", "Donker Bitter", "Kruidig" ];

const types = ["Single", "Dubble", "Triple", "Quadrupple" ];

const beerGlasses = ["Pint Glass", "Mug", "Steiner", "Goblet","Chalice","Snifter","Tulip","Thistle","Stange","Sampler Glass" ];

const colors = ["Black", "Silver","Gray","White","Maroon","Red","Purple","Fuchsia","Green","Lime","Olive","Yellow","Navy","Blue","Teal","Aqua" ];

const mythicalCreatures = ["Bake-Kujira","Ceffyl Dwr","Cyclops","Ogre","Leprechaun","Gnome","Faerie","Carbunclo","Gorgon","Mermaid","Balayang","Leutogi","Tjinimin","Anzu","Anga","Adarna","Aethon","Alkonost","Jingwei","Itsumade","Caladrius","Barghest","Shug Monkey","Werewolf","Crocotta","Cynocephaly" ];

const getRandomNumber = (max) => Math.floor(Math.random() * max);

const getRandomName = () =>
    `${coolAdjectives[getRandomNumber(coolAdjectives.length)]}
    ${types[getRandomNumber(types.length)]}`;

const setRandomName = () => {
    document.getElementById('random-name').innerText = getRandomName();
}

document.getElementById('generate')
    .addEventListener('click', setRandomName);

setRandomName();

console.log(getRandomName());

