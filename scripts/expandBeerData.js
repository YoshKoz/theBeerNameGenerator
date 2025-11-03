import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_LENGTH = 500;
const DATA_PATH = path.join(__dirname, '..', 'public', 'beer_data.json');

function loadData() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

function normalize(str) {
  return str.toLowerCase();
}

function dedupeKeepOrder(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = normalize(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

function cartesian(primary, secondary, options = {}) {
  const {
    joiner = ' ',
    formatter = (a, b) => `${a}${joiner}${b}`.replace(/\s+/g, ' ').trim(),
  } = options;
  const combos = [];
  for (const a of primary) {
    for (const b of secondary) {
      combos.push(formatter(a, b));
    }
  }
  return combos;
}

function interleave(...arrays) {
  const maxLength = Math.max(...arrays.map((arr) => arr.length));
  const result = [];
  for (let i = 0; i < maxLength; i++) {
    for (const arr of arrays) {
      if (arr[i]) {
        result.push(arr[i]);
      }
    }
  }
  return result;
}

function ensureLength(key, list, candidateGenerator) {
  const deduped = dedupeKeepOrder(list);
  const seen = new Set(deduped.map((item) => normalize(item)));
  const candidates = candidateGenerator();
  for (const item of candidates) {
    if (deduped.length >= TARGET_LENGTH) break;
    const keyNorm = normalize(item);
    if (!seen.has(keyNorm)) {
      deduped.push(item);
      seen.add(keyNorm);
    }
  }
  if (deduped.length < TARGET_LENGTH) {
    throw new Error(
      `Unable to generate enough unique entries for ${key} (only ${deduped.length})`
    );
  }
  return deduped.slice(0, TARGET_LENGTH);
}

function buildCategoryCandidates() {
  const descriptors = [
    'Alpine',
    'Amberwood',
    'Ancient',
    'Arcadian',
    'Aurora',
    'Barrel-Fired',
    'Bavarian Hearth',
    'Celestial',
    'Cinder',
    'Coastal',
    'Copperleaf',
    'Coven',
    'Crescent',
    'Crystal',
    'Deepwater',
    'Desert Bloom',
    'Dragonstone',
    'Elder',
    'Emberlight',
    'Evergreen',
    'Fable',
    'Fireside',
    'Forge',
    'Frostglen',
    'Gilded',
    'Glacier',
    'Golden Orchard',
    'Grainwright',
    'Harbor',
    'Harvest Moon',
    'Highland',
    'Horizon',
    'Ironbark',
    'Ivory',
    'Lunar',
    'Meadowlark',
    'Midnight',
    'Moonrise',
    'Nebula',
    'Nightshade',
    'Northwind',
    'Oakspire',
    'Obsidian',
    'Old Grove',
    'Orchard',
    'Quartz',
    'Ridgeway',
    'Riverstone',
    'Saffron',
    'Seafoam',
    'Shadowfell',
    'Silverline',
    'Skyforge',
    'Solstice',
    'Starfall',
    'Stormbloom',
    'Sunfire',
    'Sunlit',
    'Thistle',
    'Timberline',
    'Twilight',
    'Verdant',
    'Wildflower',
    'Windborne',
    'Winterbloom',
    'Woodland',
  ];

  const styles = [
    'Ale',
    'Altbier',
    'Amber',
    'Bière de Mars',
    'Bock',
    'Braggot',
    'Brown',
    'Bruin',
    'Common',
    'Cream Lager',
    'Dark Lager',
    'Doppelbock',
    'Dortmunder',
    'Export',
    'Farmhouse',
    'Gose',
    'Grisette',
    'Harvest Lager',
    'Hefeweizen',
    'IPA',
    'Kellerbier',
    'Kolsch',
    'Lambic',
    'Lichtenhainer',
    'Maibock',
    'Märzen',
    'Mild',
    'Old Ale',
    'Pale',
    'Pilsner',
    'Porter',
    'Quadrupel',
    'Rauchbier',
    'Red',
    'Saison',
    'Schwarzbier',
    'Scotch',
    'Session',
    'Sour',
    'Stout',
    'Table Beer',
    'Tripel',
    'Vienna',
    'Weiss',
    'Wheat',
    'Wild Ale',
    'Winter Lager',
  ];

  const suffixes = [
    'Reserve',
    'Special',
    'Tradition',
    'Heritage',
    'Signature',
    'Vintage',
    'Collection',
    'Blend',
    'Cuvée',
    'Project',
    'Selection',
    'Series',
    'Lineage',
    'Batch',
    'Run',
  ];

  const combos = [];

  for (const descriptor of descriptors) {
    for (const style of styles) {
      combos.push(`${descriptor} ${style}`);
      for (const suffix of suffixes) {
        combos.push(`${descriptor} ${style} ${suffix}`);
      }
    }
  }

  const singleWordAdditions = [
    'Auroralager',
    'Frostbock',
    'Sunspire Saison',
    'Cinderporter',
    'Mooncrest Mild',
    'Glacierbrew',
    'Starward Stout',
    'Shadowmalt',
    'Wildhearth Ale',
    'Skyveil Lager',
  ];

  return interleave(combos, singleWordAdditions);
}

function buildAdjectiveCandidates() {
  const roots = [
    'Aetherial',
    'Alacritous',
    'Aqueous',
    'Arborescent',
    'Astriferous',
    'Auroral',
    'Balsamic',
    'Benevolent',
    'Bichromatic',
    'Blithe',
    'Boreal',
    'Cadent',
    'Caesious',
    'Calefacient',
    'Candescent',
    'Carminic',
    'Celestine',
    'Ceruline',
    'Chromatic',
    'Clematis',
    'Candescent',
    'Corybantic',
    'Crystalline',
    'Cyclonic',
    'Dappled',
    'Delphic',
    'Diaphanous',
    'Eburnean',
    'Ecliptic',
    'Efflorescent',
    'Elastoplastic',
    'Elusive',
    'Emberlit',
    'Emollient',
    'Epiphanic',
    'Evanid',
    'Exultant',
    'Fervid',
    'Filigreed',
    'Fluoridic',
    'Frangible',
    'Fulgent',
    'Gelid',
    'Geminate',
    'Geomantic',
    'Glissading',
    'Halcyonic',
    'Heliacal',
    'Hygge-like',
    'Illimitable',
    'Incalescent',
    'Incarnadine',
    'Ineffable',
    'Iridescent',
    'Jubilant',
    'Lambent',
    'Lapidary',
    'Lazuline',
    'Liminal',
    'Lissome',
    'Lithe',
    'Lyriform',
    'Macilent',
    'Madrigal',
    'Magniloquent',
    'Marmoreal',
    'Nebulous',
    'Noctilucent',
    'Nubecular',
    'Obcordate',
    'Opaline',
    'Oscillant',
    'Palatial',
    'Palimpsest',
    'Panoramic',
    'Parabolic',
    'Passerine',
    'Penumbral',
    'Peregrine',
    'Phosphoric',
    'Plenary',
    'Plenilunar',
    'Prismatic',
    'Pulchritudinous',
    'Pyric',
    'Quiescent',
    'Radiolytic',
    'Resplendent',
    'Refulgent',
    'Selenic',
    'Seraphic',
    'Silvan',
    'Sinfonic',
    'Solstitial',
    'Sonorous',
    'Splendent',
    'Stannous',
    'Stelliferous',
    'Sybaritic',
    'Telluric',
    'Tenebrous',
    'Tessellated',
    'Thermal',
    'Titanic',
    'Translunary',
    'Trepid',
    'Velutinous',
    'Vernal',
    'Vitreous',
    'Volant',
    'Zephyrean',
  ];

  const suffixes = [
    'Arcadian',
    'Auric',
    'Cascade',
    'Chromatic',
    'Crescent',
    'Drift',
    'Eclipse',
    'Elegy',
    'Fable',
    'Flare',
    'Flux',
    'Glow',
    'Harmony',
    'Illume',
    'Lattice',
    'Lyric',
    'Manifold',
    'Murmur',
    'Nebula',
    'Opus',
    'Pulse',
    'Rhapsody',
    'Silhouette',
    'Solace',
    'Spectrum',
    'Spiral',
    'Surge',
    'Symphony',
    'Tempest',
    'Tranquil',
    'Vale',
    'Vanguard',
    'Whisper',
    'Wonder',
  ];

  const forms = cartesian(roots, suffixes, {
    formatter: (a, b) => `${a} ${b}`,
  });

  const modifiers = roots.map((word) => `${word.replace(/ly$/, '')}ly`);
  const hyphenated = cartesian(roots, suffixes, {
    formatter: (a, b) => `${a}-${b}`,
  });

  return interleave(forms, modifiers, hyphenated);
}

function buildGlassCandidates() {
  const materials = [
    'Acacia',
    'Aged Copper',
    'Amber Crystal',
    'Aurora Glass',
    'Birchwood',
    'Blackened Steel',
    'Blown Glass',
    'Celestial Crystal',
    'Cerulean Glass',
    'Chromed Metal',
    'Cobalt Glass',
    'Cut Crystal',
    'Ebony Wood',
    'Emerald Glass',
    'Frosted Glass',
    'Gilded Glass',
    'Ivory Porcelain',
    'Lead-Free Crystal',
    'Marble Base',
    'Matte Ceramic',
    'Onyx Glass',
    'Opaline Glass',
    'Pewter',
    'Polished Oak',
    'Recycled Glass',
    'Rose Gold',
    'Smoked Glass',
    'Solar Flare',
    'Stoneware',
    'Titanium',
    'Uranium Glass',
    'Walnut',
    'Weathered Copper',
    'White Oak',
  ];

  const forms = [
    'Arc Goblet',
    'Artisan Flute',
    'Balloon Stem',
    'Barrel Stein',
    'Cascade Chalice',
    'Crown Mug',
    'Crystal Pils',
    'Curved Becher',
    'Double Wall Tulip',
    'Echo Tankard',
    'Etched Chalice',
    'Feather Flute',
    'Fjord Stein',
    'Flare Pint',
    'Flow Chalice',
    'Forge Stein',
    'Glacier Tulip',
    'Halo Goblet',
    'Harbor Mug',
    'Helix Tumbler',
    'Horizon Pils',
    'Lattice Snifter',
    'Lumen Mug',
    'Lyric Tulip',
    'Nautic Stein',
    'Nebula Glass',
    'Nightfall Chalice',
    'Nova Snifter',
    'Obsidian Mug',
    'Orbit Goblet',
    'Prism Flute',
    'Ridgeway Stein',
    'River Pint',
    'Sail Chalice',
    'Skyline Tumbler',
    'Solstice Goblet',
    'Spire Pils',
    'Spiral Stem',
    'Starfinder Glass',
    'Storm Chalice',
    'Sunrise Tulip',
    'Tidal Pint',
    'Timber Mug',
    'Twilight Snifter',
    'Vesper Flute',
    'Voyager Stein',
    'Wildflower Mug',
    'Windborne Chalice',
    'Zenith Tulip',
  ];

  const embellishments = [
    'with Brass Rim',
    'with Carved Base',
    'with Celestial Etching',
    'with Diamond Stem',
    'with Etched Constellations',
    'with Gilded Lip',
    'with Hammered Texture',
    'with Honeycomb Pattern',
    'with Integrated Coaster',
    'with Laser-etched Map',
    'with Lunar Engraving',
    'with Meteorite Details',
    'with Mosaic Inlay',
    'with Pearl Inset',
    'with Riverstone Base',
    'with Spiral Handle',
    'with Starburst Etch',
    'with Twisted Stem',
  ];

  const combos = [];

  for (const material of materials) {
    for (const form of forms) {
      combos.push(`${material} ${form}`);
      for (const emb of embellishments) {
        combos.push(`${material} ${form} ${emb}`);
      }
    }
  }

  const concise = cartesian(materials, forms);
  return interleave(combos, concise);
}

function buildTypeCandidates() {
  const qualifiers = [
    'Adaptive',
    'Aged',
    'Alchemist',
    'Amber-Hued',
    'Artisanal',
    'Barrel-Finished',
    'Basement-Born',
    'Bespoke',
    'Cask-Rolled',
    'Celebration',
    'Ceremonial',
    'Cinder-Roasted',
    'Cloud-Fermented',
    'Coastal',
    'Constellation',
    'Copper-Kissed',
    'Cycle-Aged',
    'Deep-Hopped',
    'Earthbound',
    'Echo-Barreled',
    'Elevated',
    'Evenfall',
    'Fire-Kilned',
    'Fjord-Born',
    'Foam-Laced',
    'Forged',
    'Frontier',
    'Garden-Crafted',
    'Gilded',
    'Grain-Kissed',
    'Hearthstone',
    'Hinterland',
    'Ironbound',
    'Kiln-Finished',
    'Lantern-Lit',
    'Liminal',
    'Moon-Aged',
    'Night-Focused',
    'Ocean-Sprayed',
    'Old-Growth',
    'Pioneer',
    'Pinstripe',
    'Quartz-Cleaned',
    'Refined',
    'River-Cooled',
    'Ritual',
    'Sage-Mashed',
    'Skyborne',
    'Solar',
    'Stoneground',
    'Storm-Captured',
    'Sunrise',
    'Tempest',
    'Timber-Cured',
    'Trail-Forged',
    'Tundra-Aged',
    'Twilight',
    'Vaulted',
    'Vintage-Style',
    'Wind-Spun',
    'Workshop',
  ];

  const bases = [
    'Ale',
    'Barleywine',
    'Bitter',
    'Blonde',
    'Braggot',
    'Brown',
    'Cask Lager',
    'Cream',
    'Dubbel',
    'Farmhouse',
    'Golden',
    'Helles',
    'IPA',
    'Kvass',
    'Lager',
    'Nitro Ale',
    'Pale',
    'Pilsner',
    'Porter',
    'Red',
    'Rye',
    'Saison',
    'Schwarzbier',
    'Session',
    'Sour',
    'Stout',
    'Strong Ale',
    'Table Beer',
    'Tripel',
    'Weisse',
    'Wheat',
  ];

  const endings = [
    'Blend',
    'Collection',
    'Craft',
    'Edition',
    'Expression',
    'Line',
    'Profile',
    'Reserve',
    'Series',
    'Signature',
    'Spectrum',
    'Study',
  ];

  const combos = [];

  for (const qualifier of qualifiers) {
    for (const base of bases) {
      combos.push(`${qualifier} ${base}`);
      for (const end of endings) {
        combos.push(`${qualifier} ${base} ${end}`);
      }
    }
  }

  const condensed = cartesian(qualifiers, bases);
  return interleave(combos, condensed);
}

function buildColorCandidates() {
  const tones = [
    'Aged Copper',
    'Amber Dusk',
    'Apricot Mist',
    'Aurora Gold',
    'Autumn Ember',
    'Barley Straw',
    'Birch Bark',
    'Blackberry Glint',
    'Blue Horizon',
    'Bronze Gleam',
    'Caramel Glow',
    'Celestial Blue',
    'Cinder Ash',
    'Citrine Flame',
    'Cloudstone',
    'Copper Glow',
    'Coral Gleam',
    'Crimson Haze',
    'Crystal Frost',
    'Dawn Amber',
    'Dusk Violet',
    'Ember Bloom',
    'Evening Plum',
    'Fir Needle',
    'Frosted Quartz',
    'Glacier Blue',
    'Golden Hour',
    'Harvest Amber',
    'Honey Gleam',
    'Icicle Silver',
    'Indigo Veil',
    'Iridescent Pearl',
    'Juniper Mist',
    'Lakeshore Blue',
    'Lava Rose',
    'Moonlit Slate',
    'Obsidian Sheen',
    'Opal Cascade',
    'Peach Glimmer',
    'Peridot Mist',
    'Prairie Gold',
    'Rosewood',
    'Saffron Beam',
    'Seafoam Glow',
    'Skyfire',
    'Solar Bronze',
    'Starshine',
    'Stone Moss',
    'Sunset Blush',
    'Terracotta Light',
    'Thundercloud',
    'Verdant Gleam',
    'Wildflower Pink',
    'Wintergreen',
  ];

  const variants = [
    'Aura',
    'Bloom',
    'Brilliance',
    'Burst',
    'Cascade',
    'Drift',
    'Flare',
    'Gleam',
    'Glow',
    'Halo',
    'Haze',
    'Highlight',
    'Hue',
    'Iridescence',
    'Luminescence',
    'Mist',
    'Radiance',
    'Sheen',
    'Shimmer',
    'Spectrum',
    'Tint',
    'Tone',
    'Trace',
    'Veil',
    'Wave',
  ];

  const combos = cartesian(tones, variants);
  const hyphenated = cartesian(tones, variants, {
    formatter: (a, b) => `${a}-${b}`,
  });

  return interleave(combos, hyphenated);
}

function buildCreatureCandidates() {
  const prefixes = [
    'Amber',
    'Astral',
    'Blaze',
    'Cinder',
    'Cloud',
    'Crystal',
    'Dawn',
    'Dusk',
    'Echo',
    'Elder',
    'Ember',
    'Fable',
    'Frost',
    'Gale',
    'Glimmer',
    'Glow',
    'Grain',
    'Hearth',
    'Iron',
    'Leaf',
    'Moon',
    'Mythic',
    'Nebula',
    'Night',
    'Rune',
    'Sage',
    'Shadow',
    'Sky',
    'Star',
    'Stone',
    'Storm',
    'Sun',
    'Thorn',
    'Thunder',
    'Twilight',
    'Wild',
    'Wind',
  ];

  const suffixes = [
    'bound',
    'caller',
    'drake',
    'fang',
    'geist',
    'herald',
    'horn',
    'kin',
    'ling',
    'mare',
    'mender',
    'monk',
    'myst',
    'pelt',
    'runner',
    'seer',
    'shade',
    'shaper',
    'song',
    'spawn',
    'spirit',
    'stride',
    'talon',
    'walker',
    'weaver',
    'wyrm',
  ];

  const titles = [
    'Guardian',
    'Harbinger',
    'Keeper',
    'Nomad',
    'Oracle',
    'Patron',
    'Protector',
    'Sentinel',
    'Soothsayer',
    'Warden',
  ];

  const combos = [];

  for (const prefix of prefixes) {
    for (const suffix of suffixes) {
      combos.push(`${prefix}${suffix}`);
      combos.push(
        `${prefix} ${suffix.charAt(0).toUpperCase() + suffix.slice(1)}`
      );
      for (const title of titles) {
        combos.push(
          `${prefix} ${title} of the ${suffix.charAt(0).toUpperCase() + suffix.slice(1)}`
        );
      }
    }
  }

  const duals = cartesian(prefixes, prefixes, {
    formatter: (a, b) => `${a}${b} Wyrm`,
  });

  return interleave(combos, duals);
}

function buildTasteProfileCandidates() {
  const bases = [
    'Agave',
    'Almond',
    'Amaretto',
    'Anise',
    'Apple Cider',
    'Apricot Jam',
    'Aronia',
    'Banana Cream',
    'Barrel Smoke',
    'Basil Honey',
    'Berry Cobbler',
    'Birch Sap',
    'Black Cherry',
    'Black Pepper',
    'Blackberry Jam',
    'Blood Orange',
    'Blueberry Muffin',
    'Brown Sugar',
    'Butter Toffee',
    'Cacao Nib',
    'Candied Ginger',
    'Caramel Apple',
    'Caraway',
    'Cardamom',
    'Carrot Cake',
    'Cascara',
    'Chestnut',
    'Cherry Blossom',
    'Chocolate Fudge',
    'Cigar Box',
    'Cinnamon Maple',
    'Citrus Peel',
    'Clove Honey',
    'Coconut Cream',
    'Coffee Blossom',
    'Cranberry',
    'Cream Soda',
    'Crisp Apple',
    'Crystallized Pineapple',
    'Dark Chocolate',
    'Date Syrup',
    'Dragonfruit',
    'Earl Grey',
    'Elderflower',
    'Fig Preserve',
    'Ginger Snap',
    'Ginseng',
    'Grapefruit Zest',
    'Hazelnut Praline',
    'Honeycomb',
    'Honeysuckle',
    'Hop Resin',
    'Kiwi',
    'Kumquat',
    'Lavender Honey',
    'Lemon Curd',
    'Lime Leaf',
    'Loganberry',
    'Macadamia',
    'Mango Chutney',
    'Maple Walnut',
    'Meyer Lemon',
    'Molasses Spice',
    'Mulled Wine',
    'Nectarine',
    'Nutmeg',
    'Orange Cream',
    'Papaya',
    'Passionfruit',
    'Peach Cobbler',
    'Pear Butter',
    'Peppercorn',
    'Pineapple Sage',
    'Pink Pepper',
    'Pistachio Cream',
    'Plum Jam',
    'Pomegranate',
    'Raspberry Coulis',
    'Roasted Almond',
    'Roasted Coconut',
    'Rosemary Citrus',
    'Rum Raisin',
    'Saffron Honey',
    'Salted Caramel',
    'Sandalwood',
    'Seaberry',
    'Sesame Brittle',
    'Smoked Cedar',
    'Smoked Pineapple',
    'Star Anise',
    'Strawberry Rhubarb',
    'Sumac',
    'Sweet Basil',
    'Tamarind',
    'Tangelo',
    'Toasted Brioche',
    'Toasted Marshmallow',
    'Tropical Breeze',
    'Vanilla Bean',
    'Watermelon Rind',
    'White Chocolate',
    'Wild Berry',
    'Wintergreen',
    'Yuzu Marmalade',
    'Clementine',
    'Gala Apple',
    'Golden Raisin',
    'Honeydew',
    'Ocean Brine',
    'Peppermint Cocoa',
    'Pluot',
    'Rooibos',
    'Rose Petal',
    'Sagebrush',
    'Spiced Berry',
    'Sugared Lime',
    'Toffee Crunch',
    'Treacle',
    'Walnut',
    'Wildflower Honey',
    'Woodsmoke',
    'Zesty Grapefruit',
  ];

  const descriptors = [
    'Accented',
    'Ampliﬁed',
    'Aromatic',
    'Balanced',
    'Bright',
    'Brûléed',
    'Bursting',
    'Candied',
    'Caramelized',
    'Cascading',
    'Complex',
    'Creamy',
    'Crystalline',
    'Crushed',
    'Deep',
    'Drenched',
    'Elevated',
    'Enriched',
    'Expressive',
    'Finessed',
    'Glazed',
    'Glistening',
    'Honeyed',
    'Infused',
    'Jammy',
    'Layered',
    'Lush',
    'Lux',
    'Macereated',
    'Marbled',
    'Marinated',
    'Mellow',
    'Misted',
    'Nuanced',
    'Perfumed',
    'Radiant',
    'Ribbons of',
    'Roasted',
    'Rounded',
    'Silky',
    'Spiced',
    'Sugared',
    'Sun-dried',
    'Syrupy',
    'Tangy',
    'Toasted',
    'Velvety',
    'Zested',
    'Zingy',
    'Drizzled',
    'Bloomed',
    'Frosted',
    'Glowing',
    'Heady',
    'Intense',
    'Plush',
    'Refined',
    'Sparkling',
    'Spritzed',
    'Tart',
    'Textured',
    'Tropical',
    'Verdant',
    'Vibrant',
  ];

  const combos = [];
  for (const descriptor of descriptors) {
    for (const base of bases) {
      combos.push(`${descriptor} ${base}`);
    }
  }
  const singular = [...bases];

  return interleave(combos, singular);
}

function buildMouthfeelCandidates() {
  const textures = [
    'Air-Silk',
    'Amber-Smooth',
    'Angelsoft',
    'Aqua-Crisp',
    'Aromatic',
    'Blooming',
    'Breeze-Light',
    'Bridge-Soft',
    'Candlelit',
    'Cascade-Soft',
    'Cloud-Like',
    'Cotton-Fine',
    'Cream-Lush',
    'Crystal-Smooth',
    'Downy',
    'Echo-Soft',
    'Feather-Float',
    'Featherlight',
    'Felted',
    'Finespun',
    'Fog-Soft',
    'Foam-Laced',
    'Frost-Cool',
    'Gauze-Light',
    'Gentle-Coated',
    'Glide-Rich',
    'Gossamer',
    'Grain-Silky',
    'Haze-Soft',
    'Honey-Smooth',
    'Illume-Soft',
    'Lace-Delicate',
    'Lantern-Warm',
    'Lilt-Light',
    'Linen-Soft',
    'Lotus-Smooth',
    'Mallow-Cream',
    'Marshmallowy',
    'Mellow-Cream',
    'Mist-Soft',
    'Moonlit',
    'Nimbus-Soft',
    'Opal-Smooth',
    'Pillow-Soft',
    'Plush-Coated',
    'Rain-kissed',
    'River-Slick',
    'Satin-Finish',
    'Silk-Threaded',
    'Snowsoft',
    'Soft-Edged',
    'Sueded',
    'Sun-Warmed',
    'Velour',
    'Velvet-Cascade',
    'Velvet-Cloaked',
    'Velvet-Wrapped',
    'Water-Brushed',
    'Whisper-Light',
    'Wind-Smoothed',
    'Wisp-Soft',
  ];

  const actions = [
    'and lingering',
    'and rounded',
    'with airy lift',
    'with bright lift',
    'with butter-smooth finish',
    'with cooling hush',
    'with creamy glow',
    'with crisp snap',
    'with delicate hush',
    'with downtempo glide',
    'with gentle bloom',
    'with gentle cascade',
    'with glacial hush',
    'with glowing finish',
    'with glowing hush',
    'with graceful hush',
    'with hush of velvet',
    'with hush-soft finish',
    'with lasting hush',
    'with lasting warmth',
    'with lingering embrace',
    'with mellow hush',
    'with plush finish',
    'with satin hush',
    'with silken glide',
    'with smooth hush',
    'with softness to spare',
    'with sugar-smooth finish',
    'with tender hush',
    'with velvet hush',
    'that glides',
    'that lingers',
    'that melts',
    'that rolls',
    'that shimmers',
    'that warms',
    'that whispers',
  ];

  const combos = [];
  for (const texture of textures) {
    combos.push(texture);
    for (const action of actions) {
      combos.push(`${texture} ${action}`);
    }
  }

  return combos;
}

function buildTasteNounCandidates() {
  const descriptors = [
    'Accent',
    'Acord',
    'Afflatus',
    'Afterglow',
    'Ambience',
    'Apex',
    'Aroma',
    'Aura',
    'Backbeat',
    'Balance',
    'Bloom',
    'Bouquet',
    'Burst',
    'Cadence',
    'Cadenza',
    'Cascade',
    'Chord',
    'Chorus',
    'Crest',
    'Current',
    'Echo',
    'Essence',
    'Fanfare',
    'Flair',
    'Flash',
    'Flight',
    'Flow',
    'Flourish',
    'Glow',
    'Harmony',
    'Inflection',
    'Luster',
    'Lyric',
    'Melody',
    'Momentum',
    'Mood',
    'Murmur',
    'Narrative',
    'Note',
    'Nuance',
    'Octave',
    'Overtone',
    'Palate',
    'Pulse',
    'Riff',
    'Rim',
    'Ripple',
    'Rush',
    'Savour',
    'Scent',
    'Signature',
    'Silhouette',
    'Sonata',
    'Spark',
    'Splash',
    'Surge',
    'Suspension',
    'Symphony',
    'Timbre',
    'Tone',
    'Trace',
    'Undertone',
    'Undercurrent',
    'Underscore',
    'Verse',
    'Vibrato',
    'Wave',
    'Whisper',
    'Wisp',
    'Zest',
  ];

  const modifiers = [
    'Amber',
    'Autumn',
    'Barrel',
    'Bright',
    'Caramel',
    'Celestial',
    'Cinder',
    'Citrus',
    'Copper',
    'Crimson',
    'Crystal',
    'Dawn',
    'Dusk',
    'Ember',
    'Fable',
    'Forest',
    'Glacier',
    'Gold',
    'Harvest',
    'Honey',
    'Iron',
    'Jade',
    'Juniper',
    'Lunar',
    'Meadow',
    'Midnight',
    'Molten',
    'Moonlight',
    'Nebula',
    'Nightfall',
    'River',
    'Rust',
    'Saffron',
    'Shadow',
    'Silver',
    'Smoke',
    'Solstice',
    'Star',
    'Stone',
    'Storm',
    'Sugar',
    'Sunrise',
    'Sunset',
    'Thistle',
    'Timber',
    'Velvet',
    'Verdant',
    'Wind',
    'Winter',
  ];

  const forms = cartesian(modifiers, descriptors, {
    formatter: (a, b) => `${a} ${b}`,
  });

  const suffixes = [
    'Accent',
    'Bend',
    'Burst',
    'Cascade',
    'Crescendo',
    'Edge',
    'Glow',
    'Highlight',
    'Lift',
    'Lilt',
    'Whirl',
  ];
  const hybrid = cartesian(modifiers, suffixes, {
    formatter: (a, b) => `${a} ${b}`,
  });

  return interleave(forms, descriptors, hybrid);
}

function buildAdverbCandidates() {
  const bases = [
    'Bold',
    'Brave',
    'Bright',
    'Brisk',
    'Careful',
    'Celestial',
    'Clever',
    'Cool',
    'Cosmic',
    'Crafted',
    'Crisp',
    'Daring',
    'Dewy',
    'Dreamy',
    'Effortless',
    'Elegant',
    'Ember',
    'Fine',
    'Gentle',
    'Gleaming',
    'Golden',
    'Graceful',
    'Harmonic',
    'Honeyed',
    'Ivory',
    'Joyful',
    'Lively',
    'Luminous',
    'Lush',
    'Mellow',
    'Merry',
    'Mighty',
    'Nimble',
    'Opal',
    'Playful',
    'Pure',
    'Quick',
    'Quiet',
    'Radiant',
    'Refined',
    'Ritual',
    'Robust',
    'Silken',
    'Sincere',
    'Slow',
    'Smooth',
    'Soft',
    'Solar',
    'Spry',
    'Steady',
    'Supple',
    'Swift',
    'Tender',
    'True',
    'Vibrant',
    'Warm',
    'Wild',
    'Wistful',
    'Wise',
    'Woven',
  ];

  const adverbs = bases.map((word) => {
    if (word.endsWith('y')) return `${word.slice(0, -1)}ily`;
    if (word.endsWith('e')) return `${word}ly`;
    if (word.endsWith('l')) return `${word}ly`;
    return `${word}ly`;
  });

  const compoundPrefixes = [
    'Above all',
    'Adventurously',
    'Affectionately',
    'All at once',
    'All over',
    'Almost magically',
    'Always',
    'Artfully',
    'Astride',
    'At length',
    'Avidly',
    'Barrel-deep',
    'Beautifully',
    'Beyond measure',
    'Blissfully',
    'Boldly',
    'Brightly',
    'Calmly',
    'Carefully',
    'Cheerfully',
    'Cleverly',
    'Closely',
    'Colorfully',
    'Comet-fast',
    'Completely',
    'Confidently',
    'Constantly',
    'Cosmically',
    'Courageously',
    'Curiously',
    'Daringly',
    'Dearly',
    'Decisively',
    'Deeply',
    'Delicately',
    'Deliciously',
    'Diligently',
    'Distinctly',
    'Dreamfully',
    'Dreamily',
    'Dutifully',
    'Earnestly',
    'Easily',
    'Ebulliently',
    'Ecstatically',
    'Elegantly',
    'Endlessly',
    'Energetically',
    'Engagingly',
    'Enigmatically',
    'Enthusiastically',
    'Ethereally',
    'Exactly',
    'Exquisitely',
    'Fabulously',
    'Faithfully',
    'Fearlessly',
    'Fervently',
    'Festively',
    'Fiery-fast',
    'Firmly',
    'Flawlessly',
    'Fluidly',
    'Fondly',
    'Forcefully',
    'Forthrightly',
    'Freely',
    'Freshly',
    'Full-heartedly',
    'Fully',
    'Gallantly',
    'Generously',
    'Gently',
    'Genuinely',
    'Gloriously',
    'Gracefully',
    'Gratefully',
    'Greatly',
    'Happily',
    'Heartily',
    'Heavenward',
    'Heedfully',
    'Heroically',
    'Holistically',
    'Honorably',
    'Hopefully',
    'Humbly',
    'Immensely',
    'Intrepidly',
    'Intuitively',
    'Joyously',
    'Justly',
    'Kindly',
    'Knowingly',
    'Lavishly',
    'Lightly',
    'Loftily',
    'Lovingly',
    'Loyally',
    'Luminously',
    'Luxuriously',
    'Magically',
    'Majestically',
    'Mindfully',
    'Mirthfully',
    'Mysteriously',
    'Neatly',
    'Nobly',
    'Openly',
    'Opulently',
    'Passionately',
    'Patiently',
    'Perfectly',
    'Playfully',
    'Poetically',
    'Powerfully',
    'Radiantly',
    'Reassuringly',
    'Recklessly',
    'Resolutely',
    'Rhythmically',
    'Richly',
    'Righteously',
    'Seamlessly',
    'Sensationally',
    'Sincerely',
    'Skyward',
    'Softly',
    'Solidly',
    'Soulfully',
    'Sparklingly',
    'Spiritedly',
    'Splendidly',
    'Spontaneously',
    'Steadfastly',
    'Sublimely',
    'Sweetly',
    'Tenderly',
    'Thoroughly',
    'Thoughtfully',
    'Timelessly',
    'Tranquilly',
    'Truly',
    'Trustingly',
    'Unabashedly',
    'Unapologetically',
    'Unwaveringly',
    'Vibrantly',
    'Victoriously',
    'Warmly',
    'Wholeheartedly',
    'Wildly',
    'Wistfully',
    'Wonderfully',
    'Wryly',
    'Yearningly',
    'Zealously',
    'Zestfully',
    'Zippily',
  ];

  const directional = cartesian(
    [
      'Bright',
      'Deep',
      'High',
      'Low',
      'Near',
      'Far',
      'Even',
      'True',
      'North',
      'South',
      'East',
      'West',
    ],
    ['ly', 'ward', 'wise', 'wards'],
    {
      formatter: (a, b) => `${a}${b}`,
    }
  );

  const lyricRoots = [
    'Amber',
    'Aurora',
    'Barrel',
    'Beryl',
    'Blazing',
    'Boreal',
    'Breeze',
    'Brook',
    'Cascade',
    'Celestial',
    'Cinder',
    'Cloud',
    'Copper',
    'Cosmos',
    'Crescent',
    'Crystal',
    'Dawn',
    'Dewdrop',
    'Drift',
    'Echo',
    'Eclipse',
    'Ember',
    'Ever',
    'Feather',
    'Festival',
    'Firelight',
    'Flame',
    'Fleck',
    'Frost',
    'Garden',
    'Glisten',
    'Glow',
    'Harbor',
    'Harvest',
    'Hearth',
    'Honey',
    'Ivory',
    'Lantern',
    'Lattice',
    'Leaf',
    'Lilt',
    'Loom',
    'Lumen',
    'Lunar',
    'Meadow',
    'Miracle',
    'Mist',
    'Moon',
    'Mosaic',
    'Night',
    'Ocean',
    'Opal',
    'Orbit',
    'Pine',
    'Prairie',
    'Quill',
    'Radiance',
    'Rain',
    'River',
    'Rose',
    'Saffron',
    'Salt',
    'Seafarer',
    'Shade',
    'Shimmer',
    'Silk',
    'Silver',
    'Sky',
    'Song',
    'Spark',
    'Star',
    'Stone',
    'Storm',
    'Sun',
    'Thistle',
    'Thunder',
    'Timber',
    'Twilight',
    'Velvet',
    'Vine',
    'Whisper',
    'Wild',
    'Willow',
    'Wind',
    'Winter',
    'Wonder',
    'Woven',
  ];

  const lyricEndings = [
    'fully',
    'ingly',
    'ishly',
    'ously',
    'ently',
    'ately',
    'edly',
    'esquely',
  ];
  const lyricForms = cartesian(lyricRoots, lyricEndings, {
    formatter: (a, b) => `${a}${b}`,
  });

  const hyphenated = cartesian(
    lyricRoots,
    ['brightly', 'boldly', 'calmly', 'softly', 'wildly', 'lightly'],
    {
      formatter: (a, b) => `${a}-${b}`,
    }
  );

  const adverbPhrases = cartesian(
    ['In', 'With', 'Through', 'Across', 'Beyond', 'Amid'],
    [
      'harmony',
      'wonder',
      'reverie',
      'delight',
      'euphoria',
      'gratitude',
      'glee',
      'stillness',
      'warmth',
      'whimsy',
    ],
    {
      formatter: (a, b) => `${a} ${b}`,
    }
  );

  return interleave(
    adverbs,
    compoundPrefixes,
    directional,
    lyricForms,
    hyphenated,
    adverbPhrases
  );
}

function buildRegionCandidates() {
  const geos = [
    'Alpine Coast',
    'Amber Isle',
    'Aurora Basin',
    'Barley Fields',
    'Black Forest',
    'Blue Ridge',
    'Boreal Expanse',
    'Canyonlands',
    'Cedar Valley',
    'Celestial Fjord',
    'Copper Coast',
    'Coral Bay',
    'Cranberry Coast',
    'Crescent Dunes',
    'Crystal Sound',
    'Desert Bloom',
    'Dragon Isles',
    'Emerald Belt',
    'Evergreen Range',
    'Fable Woods',
    'Fjordland',
    'Fog Hollow',
    'Golden Savannah',
    'Granite Peaks',
    'Harbor District',
    'High Mesa',
    'Highland Marches',
    'Hinterlands',
    'Honey Plains',
    'Iron Range',
    'Ivory Coast',
    'Jade Plateau',
    'Juniper Sound',
    'Lake District',
    'Lighthouse Coast',
    'Lunar Frontier',
    'Meadow Provinces',
    'Mistral Coast',
    'Moonlit Peninsula',
    'Moorlands',
    'Northern Wilds',
    'Oceanic Rim',
    'Opal Coast',
    'Orchard Belt',
    'Pine Barrens',
    'River Province',
    'Riverine Delta',
    'Saffron Steppe',
    'Sea Mist Coast',
    'Silver Peninsula',
    'Skyreach Range',
    'Solar District',
    'Southern Reach',
    'Starfall Coast',
    'Storm Coast',
    'Sunstone Islands',
    'Timber March',
    'Tundra Ring',
    'Twilight Territories',
    'Verdant Valley',
    'Western Reach',
    'Whispering Plains',
    'Windward Coast',
    'Winter Coast',
    'Woodland Expanse',
    'Woven Archipelago',
  ];

  const qualifiers = [
    'Alliance',
    'Barony',
    'Collective',
    'Commonwealth',
    'Confederacy',
    'Consortium',
    'Cooperative',
    'Dominion',
    'Enclave',
    'Federation',
    'Frontier',
    'Gathering',
    'Guild',
    'Harbor',
    'Highlands',
    'Keep',
    'Kingdom',
    'Marches',
    'Prefecture',
    'Province',
    'Reach',
    'Republic',
    'Sanctuary',
    'Shire',
    'Territory',
    'Trade Route',
    'Union',
    'Ward',
  ];

  const combos = cartesian(geos, qualifiers, {
    formatter: (a, b) => `${a} ${b}`,
  });

  const directional = cartesian(
    [
      'Eastern',
      'Western',
      'Northern',
      'Southern',
      'Central',
      'Outer',
      'Inner',
      'Upper',
      'Lower',
      'Far',
    ],
    [
      'Kingdom',
      'Dominion',
      'Provinces',
      'Circuit',
      'Expanse',
      'Marches',
      'Coast',
      'Archipelago',
      'Frontier',
      'Steppes',
    ],
    {
      formatter: (a, b) => `${a} ${b}`,
    }
  );

  return interleave(geos, combos, directional);
}

function buildTechniqueCandidates() {
  const processes = [
    'Alpine-Lagered',
    'Amber-Fermented',
    'Ancient-Kettle',
    'Aqua-Mashed',
    'Artisan-Aged',
    'Aurora-Kilned',
    'Barrel-Polished',
    'Basalt-Filtered',
    'Blizzard-Chilled',
    'Boreal-Rested',
    'Cascade-Hopped',
    'Celestial-Fermented',
    'Charcoal-Mellowed',
    'Cloud-Fermented',
    'Coastal-Aged',
    'Copper-Stone Fermented',
    'Cryo-Hopped',
    'Deep-Fermented',
    'Delta-Mashed',
    'Diamond-Lautered',
    'Driftwood-Smoked',
    'Ember-Kilned',
    'Fjord-Fermented',
    'Forest-Malted',
    'Frigid-Lagered',
    'Glacier-Cooled',
    'Granite-Lined',
    'Hazelwood-Smoked',
    'Helix-Fermented',
    'Highland-Aged',
    'Honey-Mashed',
    'Iron-Kegged',
    'Lake-Matured',
    'Lantern-Rested',
    'Moonlight-Fermented',
    'Nebula-Aged',
    'Night-Coaxed',
    'Oak-Spiral Aged',
    'Ocean-Cooled',
    'Orbital-Spun',
    'Prairie-Fermented',
    'Quartz-Filtered',
    'River-Stone Aged',
    'Root-Infused',
    'Rye-Kettle',
    'Sage-Conditioned',
    'Shadow-Matured',
    'Sky-Cooled',
    'Snow-Fermented',
    'Solar-Warmed',
    'Star-Kissed',
    'Steam-Driven',
    'Stone-Matured',
    'Storm-Fermented',
    'Sunrise-Kilned',
    'Timber-Foiled',
    'Twilight-Batched',
    'Velvet-Lautered',
    'Wildflower-Inoculated',
    'Wind-Spun',
    'Winter-Chilled',
  ];

  const methods = [
    'Barrel Conditioning',
    'Bottle Refermentation',
    'Cask Rolling',
    'Cedar Aging',
    'Continuous Sparging',
    'Cryo Steeping',
    'Deep Cooling',
    'Double Decoction',
    'Foeder Resting',
    'Gravity Clarification',
    'Heritage Malting',
    'Hybrid Fermentation',
    'Kettle Aromatizing',
    'Nighttime Resting',
    'Nocturnal Fermentation',
    'Open Flame Kilning',
    'Open Fermentation',
    'Orbit Mash',
    'Oxidative Conditioning',
    'Petrichor Smoking',
    'Progressive Lagering',
    'Reverse Whirlpooling',
    'River Rock Steeping',
    'Slow Carbonation',
    'Stone Hearth Kilning',
    'Twilight Clarifying',
    'Vault Conditioning',
    'Wild Capture Fermentation',
    'Wind Barrel Aging',
    'Wooden Mash Tuning',
  ];

  const combos = [];
  for (const process of processes) {
    combos.push(process);
    for (const method of methods) {
      combos.push(`${process} ${method}`);
    }
  }

  const hybrid = cartesian(processes, methods);
  return interleave(combos, hybrid);
}

function buildIbuRangeCandidates() {
  const ranges = [];
  for (let start = 5; ranges.length < 2000; start += 5) {
    const end = start + 5;
    ranges.push(`${start}-${end} IBU`);
  }
  ranges.push('Custom IBU Blend');
  return ranges;
}

function buildAbvRangeCandidates() {
  const ranges = [];
  for (let start = 2; ranges.length < 2000; start += 0.5) {
    const end = (start + 0.5).toFixed(1).replace(/\.0$/, '');
    const startLabel = start.toFixed(1).replace(/\.0$/, '');
    ranges.push(`${startLabel}-${end}% ABV`);
  }
  ranges.push('Barrel Strength');
  return ranges;
}

function buildOccasionCandidates() {
  const openings = [
    'Anniversary',
    'Aurora',
    'Barrelhouse',
    'Bavarian',
    'Beachfront',
    'Blizzard',
    'Brewmaster',
    'Campfire',
    'Celestial',
    'Ciderhouse',
    'Cityscape',
    'Coastal',
    'Constellation',
    'Cottage',
    'Countryside',
    'Craft Fair',
    'Desert',
    'Discovery',
    'Evening',
    'Festival',
    'Fir Grove',
    'Firelight',
    'First Snow',
    'Founders',
    'Front Porch',
    'Garden',
    'Gathering',
    'Glacier',
    'Golden Hour',
    'Harvest',
    'Highland',
    'Holiday',
    'Hops & Harmony',
    'Ice Wine',
    'Jubilee',
    'Lantern',
    'Lodge',
    'Lunar',
    'Midnight',
    'Midsummer',
    'Moonrise',
    'Morning Dew',
    'Mountain',
    'Night Market',
    'Oak Barrel',
    'Ocean Breeze',
    'Orchard',
    'Pioneer',
    'Pint & Poetry',
    'Riverfront',
    'Rustic',
    'Saffron',
    'Seasonal',
    'Solstice',
    'Song & Stein',
    'Spring Bloom',
    'Starfall',
    'Storm Lantern',
    'Summer Firepit',
    'Sunset',
    'Trailside',
    'Twilight',
    'Vintage',
    'Winter Ember',
    'Woodland',
  ];

  const events = [
    'Bash',
    'Celebration',
    'Ceremony',
    'Cookout',
    'Dance',
    'Feast',
    'Fest',
    'Fete',
    'Gala',
    'Gathering',
    'Jamboree',
    'Jubilee',
    'Launch',
    'Night',
    'Picnic',
    'Reunion',
    'Revelry',
    'Showcase',
    'Social',
    'Soirée',
    'Spectacular',
    'Symposium',
    'Tasting',
    'Toast',
    'Weekend',
  ];

  const qualifiers = [
    'Edition',
    'Experience',
    'Extravaganza',
    'Invitational',
    'Mixer',
    'Open House',
    'Release',
    'Retreat',
    'Series',
    'Session',
    'Social',
    'Tour',
    'Workshop',
  ];

  const combos = [];
  for (const opening of openings) {
    for (const event of events) {
      combos.push(`${opening} ${event}`);
      for (const qualifier of qualifiers) {
        combos.push(`${opening} ${event} ${qualifier}`);
      }
    }
  }

  const poetic = [
    'Barrels & Bonfires',
    'Bells of Winter',
    "Brewer's Homecoming",
    'Casks at Twilight',
    'Celestial Toast',
    'Harvest Moon Rise',
    'Hops Under the Stars',
    'Midnight Brewers Circle',
    'Mist & Malt Gathering',
    'River Lantern Walk',
    'Solstice Supper',
    'Sunrise Toast',
    'Winter Hearthside',
  ];

  return interleave(combos, poetic);
}

function applyGenerators(data) {
  data.categories = ensureLength(
    'categories',
    data.categories,
    buildCategoryCandidates
  );
  data.coolAdjectives = ensureLength(
    'coolAdjectives',
    data.coolAdjectives,
    buildAdjectiveCandidates
  );
  data.beerGlasses = ensureLength(
    'beerGlasses',
    data.beerGlasses,
    buildGlassCandidates
  );
  data.types = ensureLength('types', data.types, buildTypeCandidates);
  data.colors = ensureLength('colors', data.colors, buildColorCandidates);
  data.mythicalCreatures = ensureLength(
    'mythicalCreatures',
    data.mythicalCreatures,
    buildCreatureCandidates
  );
  data.tasteProfiles = ensureLength(
    'tasteProfiles',
    data.tasteProfiles,
    buildTasteProfileCandidates
  );
  data.mouthfeelDescriptors = ensureLength(
    'mouthfeelDescriptors',
    data.mouthfeelDescriptors,
    buildMouthfeelCandidates
  );
  data.tasteNouns = ensureLength(
    'tasteNouns',
    data.tasteNouns,
    buildTasteNounCandidates
  );
  data.adverbs = ensureLength('adverbs', data.adverbs, buildAdverbCandidates);
  data.regions = ensureLength('regions', data.regions, buildRegionCandidates);
  data.brewingTechniques = ensureLength(
    'brewingTechniques',
    data.brewingTechniques,
    buildTechniqueCandidates
  );
  data.ibuRanges = ensureLength(
    'ibuRanges',
    data.ibuRanges,
    buildIbuRangeCandidates
  );
  data.abvRanges = ensureLength(
    'abvRanges',
    data.abvRanges,
    buildAbvRangeCandidates
  );
  data.occasions = ensureLength(
    'occasions',
    data.occasions,
    buildOccasionCandidates
  );
  return data;
}

function main() {
  const data = loadData();
  const updated = applyGenerators(data);
  fs.writeFileSync(DATA_PATH, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');
  console.log(
    'beer_data.json updated with balanced arrays of length',
    TARGET_LENGTH
  );
}

if (require.main === module) {
  main();
}
