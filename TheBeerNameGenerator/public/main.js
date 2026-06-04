/**
 * Beer Name Generator — Core Application Logic
 *
 * @module main
 */

import { beerData } from './beer_data.js';
import { random, articleFor, randomMultiple } from './utils.js';
import { initBubbles } from './ui-effects.js';
import { safeParseArray } from './validation.js';

// ── State ─────────────────────────────────────────────
let autoGenerateInterval = null;
let generatedNames = [];
let favoriteBeers = [];
let totalGenerated = 0;
let currentBeer = null;

const HISTORY_KEY = 'beerHistory';
const FAVORITES_KEY = 'beerFavorites';
const THEME_KEY = 'beerTheme';
const API_KEY_KEY = 'openaiApiKey';
const MAX_HISTORY = 100;
const MAX_FAVORITES = 25;

let lastImageUrl = null;

// ── DOM helpers ───────────────────────────────────────
/** @type {(id: string) => HTMLElement | null} */
const $ = (id) => document.getElementById(id);

/** Safely set text content on an element */
function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

// ── Toast notification ────────────────────────────────
/**
 * Show a toast notification.
 * @param {string} message
 * @param {'info' | 'success' | 'warning' | 'error'} [type='info']
 * @param {number} [duration=2200]
 */
function showToast(message, type = 'info', duration = 2200) {
  const toast = $('toast');
  if (!toast) return;

  toast.className = 'toast';
  if (type !== 'info') toast.classList.add(type);
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), duration);
}

// ── API key ───────────────────────────────────────────
function getApiKey() {
  return localStorage.getItem(API_KEY_KEY);
}

function openApiKeyModal() {
  const modal = $('api-key-modal');
  const input = $('api-key-input');
  if (!modal) return;
  modal.hidden = false;
  if (input) {
    input.value = getApiKey() ?? '';
    input.focus();
  }
}

function closeApiKeyModal() {
  const modal = $('api-key-modal');
  if (modal) modal.hidden = true;
}

// ── Image modal ───────────────────────────────────────
function openImageModal(beerName) {
  const modal = $('image-modal');
  const title = $('image-modal-title');
  const actions = $('image-modal-actions');
  if (!modal) return;
  if (title) title.textContent = `"${beerName}"`;
  if (actions) actions.hidden = true;
  modal.hidden = false;
}

function closeImageModal() {
  const modal = $('image-modal');
  if (modal) modal.hidden = true;
  lastImageUrl = null;
}

// ── Image generation ──────────────────────────────────
async function generateImage() {
  if (!currentBeer) {
    showToast('Generate a beer first', 'warning');
    return;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    showToast('Set your OpenAI API key first', 'warning');
    openApiKeyModal();
    return;
  }

  const container = $('modal-image-container');
  if (container) {
    const loading = document.createElement('div');
    loading.className = 'modal__loading';
    const icon = document.createElement('i');
    icon.className = 'fas fa-spinner';
    icon.setAttribute('aria-hidden', 'true');
    const text = document.createElement('span');
    text.textContent = 'Generating image…';
    loading.append(icon, text);
    container.replaceChildren(loading);
  }

  openImageModal(currentBeer.name);

  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: currentBeer.imagePrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        output_format: 'url',
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message ?? `API error ${res.status}`);
    }

    const data = await res.json();
    const item = data.data?.[0];
    const url = item?.url
      ?? (item?.b64_json ? `data:image/png;base64,${item.b64_json}` : null);
    if (!url) throw new Error('No image in response');

    lastImageUrl = url;

    if (container) {
      const img = document.createElement('img');
      img.src = url;
      img.alt = currentBeer.name;
      img.className = 'modal__image';
      container.replaceChildren(img);
    }

    const actions = $('image-modal-actions');
    if (actions) actions.hidden = false;

  } catch (err) {
    if (container) {
      const errorEl = document.createElement('div');
      errorEl.className = 'modal__error';
      const icon = document.createElement('i');
      icon.className = 'fas fa-exclamation-triangle';
      icon.setAttribute('aria-hidden', 'true');
      const msg = document.createElement('span');
      msg.textContent = err.message;
      errorEl.append(icon, msg);
      container.replaceChildren(errorEl);
    }
    showToast('Image generation failed', 'error');
  }
}

// ── Theme ─────────────────────────────────────────────
function applyTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  const btn = $('theme-toggle');
  if (btn) {
    btn.innerHTML = isDark
      ? '<i class="fas fa-sun" aria-hidden="true"></i>'
      : '<i class="fas fa-moon" aria-hidden="true"></i>';
  }
}

// ── Dropdown population ───────────────────────────────
function populateSelects() {
  const fill = (id, items) => {
    const el = $(id);
    if (!el) return;

    const fragment = document.createDocumentFragment();
    const defaultOption = document.createElement('option');
    defaultOption.value = 'random';
    defaultOption.textContent = 'Random';
    fragment.append(defaultOption);

    for (const item of items) {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      fragment.append(option);
    }

    el.replaceChildren(fragment);
  };

  fill('category-select', beerData.categories);
  fill('adjective-select', beerData.coolAdjectives);
  fill('style-select', beerData.types?.length ? beerData.types : beerData.categories);
}

// ── Generation ────────────────────────────────────────
function val(id) {
  const el = $(id);
  return el?.value !== 'random' ? el.value : null;
}

const DESC_TEMPLATES = [
  (d) =>
    `Brewed by the ${d.creature} deep in ${d.region}, this ${d.mouthfeel} ${d.category} pours ${d.color1} with a ${d.color2} head. Notes of ${d.taste} up front, finishing with ${d.taste2}. ${d.adverb} ${d.technique.toLowerCase()}. ${d.abv} · ${d.ibu}.`,
  (d) =>
    `A ${d.adjective} ${d.category} born from ${d.region} tradition and ${d.creature} craft. ${d.color1} in the ${d.glass}, ${d.mouthfeel} on the palate, with ${d.taste} and a hint of ${d.taste2}. Perfect for ${d.occasion.toLowerCase()}. ${d.abv}.`,
  (d) =>
    `The ${d.creature} ${d.adverb} ${d.technique.toLowerCase()} this ${d.category} using secrets from ${d.region}. It pours ${d.color1}-${d.color2}, drinks ${d.mouthfeel}, and delivers ${d.taste} with a ${d.taste2} finish. ${d.abv} · ${d.ibu}.`,
  (d) =>
    `${d.adjective} and unapologetic. This ${d.mouthfeel} ${d.category} from the ${d.creature}'s ${d.region} cellar leads with ${d.taste} and closes on ${d.taste2}. Served in a ${d.glass}. ${d.abv}.`,
  (d) =>
    `Legend says the ${d.creature} only brews this for ${d.occasion.toLowerCase()}. A ${d.color1} ${d.category}, ${d.mouthfeel} and rich, with ${d.taste} layered over ${d.taste2}. ${d.adverb} ${d.technique.toLowerCase()}. ${d.abv} · ${d.ibu}.`,
  (d) =>
    `From the ${d.region} highlands, where the ${d.creature} tends ancient casks. This ${d.adjective} ${d.category} is ${d.color1} in the glass, ${d.mouthfeel} in body, with ${d.taste} and a clean ${d.taste2} finish. ${d.abv}.`,
  (d) =>
    `The ${d.creature} won't share the recipe, but the result speaks: a ${d.mouthfeel} ${d.category}, ${d.color1}-${d.color2}, with ${d.taste} on the nose and ${d.taste2} on the back. ${d.adverb} ${d.technique.toLowerCase()}. ${d.abv} · ${d.ibu}.`,
  (d) =>
    `${d.technique} ${d.category} from ${d.region}, crafted by the ${d.creature}. Pours ${d.color1} with ${d.color2} edges. ${d.mouthfeel} body, ${d.taste} forward, soft ${d.taste2} end. Built for ${d.occasion.toLowerCase()}. ${d.abv}.`,
];

// ── Image prompt: style palettes ────────────────────────
const PROMPT_STYLES = [
  {
    opening: "A baroque still-life oil painting rendered with Caravaggio's chiaroscuro mastery depicts",
    lighting: 'a single warm candle flame off-frame casting deep velvet shadows and raking light across the glass',
    rendered: 'oil on dark canvas, rich glazing layers, dark varnished background, painterly brushwork',
  },
  {
    opening: 'A dark fantasy book-cover illustration in the detailed painterly style of Larry Elmore shows',
    lighting: 'a cool unearthly glow emanating from the beer itself, with dramatic amber rim lighting against deep shadow',
    rendered: 'detailed gouache on board, high-fantasy aesthetic, strong value contrast',
  },
  {
    opening: 'A vintage beer-label lithograph in the tradition of 19th-century commercial engraving depicts',
    lighting: 'flat even decorative lighting with no harsh shadows, typical of antique print illustration',
    rendered: 'fine cross-hatched ink engraving, aged cream parchment tones, two- to three-color print aesthetic',
  },
  {
    opening: 'An Art Nouveau celebration poster in the ornate style of Alphonse Mucha features',
    lighting: 'soft diffused golden-hour light with gilded highlights and a warm ambient glow',
    rendered: 'flowing organic lines, botanical border ornamentation, gold-leaf accents, flat decorative color',
  },
  {
    opening: 'A commercial product photograph taken with an 85mm macro lens captures',
    lighting: 'controlled three-point studio lighting: a warm key light, cool fill, and a subtle rim backlight separating the glass from the background',
    rendered: 'sharp focus at f/2.8, shallow depth of field, dark gradient studio backdrop, professional beverage photography',
  },
  {
    opening: 'An ethereal watercolor and ink painting in the dreamlike style of Yoshitaka Amano illustrates',
    lighting: 'luminous translucent light filtering through loose washes of watercolor, soft and otherworldly',
    rendered: 'fluid watercolor washes with precise ink linework, delicate textures, an otherworldly pastel-and-gold palette',
  },
  {
    opening: 'A medieval tavern-sign woodcut print with bold graphic lines depicts',
    lighting: 'high-contrast flat graphic lighting with strong silhouettes and no subtle gradients',
    rendered: 'woodblock print texture, rough-hewn edges, limited two-color earth-tone palette, hand-carved look',
  },
  {
    opening: 'A stained-glass window panel set with jewel-toned glass and thick lead came depicts',
    lighting: 'brilliant sunlight streaming through from behind, making the colored glass glow with intense transmitted light',
    rendered: 'mosaic-like composition with thick black lead lines, deep saturated jewel colors, luminous backlit quality',
  },
];


function generateBeer() {
  const adjective =
    val('adjective-select') ?? random(beerData.coolAdjectives);
  const adjective2 = random(beerData.coolAdjectives);
  const creature = random(beerData.mythicalCreatures);
  const category =
    val('category-select') ?? random(beerData.categories);
  const style =
    val('style-select') ??
    random(beerData.types?.length ? beerData.types : beerData.categories);
  const [color1, color2] = randomMultiple(beerData.colors, 2, true);
  const glass = random(beerData.beerGlasses);
  const region = random(beerData.regions);
  const abv = random(beerData.abvRanges);
  const ibu = random(beerData.ibuRanges);
  const technique = random(beerData.brewingTechniques);
  const occasion = random(beerData.occasions);
  const taste = random(beerData.tasteProfiles);
  const taste2 = random(beerData.tasteProfiles);
  const mouthfeel = random(beerData.mouthfeelDescriptors);
  const adverb = random(beerData.adverbs);

  const name = `The ${adjective} ${adjective2} ${creature}`;
  const article = articleFor(adjective);

  const d = {
    name,
    adjective,
    article,
    category,
    color1,
    color2,
    glass,
    region,
    abv,
    ibu,
    technique,
    occasion,
    taste,
    taste2,
    mouthfeel,
    adverb,
    creature,
  };
  const description = random(DESC_TEMPLATES)(d);

  const ps = random(PROMPT_STYLES);

  const imagePrompt = [
    `${ps.opening} a ${d.adjective} ${d.color1}-coloured ${d.category} called "${d.name}".`,
    `Present it ${d.adverb.toLowerCase()} in a ${d.creature}-inspired ${d.glass}.`,
    `Emphasize ${d.taste.toLowerCase()}, a ${d.mouthfeel} body, and ${d.color2} hues.`,
    `No text, no watermarks, no labels.`,
  ].join(' ');

  return {
    id: `beer-${Date.now()}`,
    name,
    description,
    imagePrompt,
    specs: { category, style, region, abv, ibu, technique, occasion },
  };
}

// ── Display ───────────────────────────────────────────
function displayBeer(beer) {
  const prompt = $('brew-prompt');
  const nameEl = $('brew-name');
  const descEl = $('brew-desc');
  const specsEl = $('brew-specs');
  if (!nameEl || !descEl || !specsEl) return;

  if (prompt) prompt.hidden = true;

  nameEl.textContent = `"${beer.name}"`;
  nameEl.hidden = false;

  descEl.textContent = beer.description;
  descEl.hidden = false;

  const { category, abv, ibu, region, occasion } = beer.specs;
  const specValues = [category, abv, ibu, region, occasion];
  specsEl.replaceChildren(
    ...specValues.map((s) => {
      const chip = document.createElement('span');
      chip.className = 'spec-chip';
      chip.textContent = s;
      return chip;
    })
  );
  specsEl.hidden = false;
}

// ── History ───────────────────────────────────────────
function renderHistory() {
  const list = $('history-list');
  if (!list) return;

  list.replaceChildren();

  const fragment = document.createDocumentFragment();
  for (const beer of generatedNames.slice(0, 20)) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'history-item';
    const strong = document.createElement('strong');
    strong.textContent = beer.name;
    const small = document.createElement('small');
    small.textContent = `${beer.specs.category} · ${beer.specs.abv} · ${beer.specs.ibu}`;
    btn.append(strong, small);
    btn.addEventListener('click', () => {
      currentBeer = beer;
      displayBeer(beer);
      showToast('Loaded from history');
    });
    fragment.append(btn);
  }
  list.append(fragment);
}

// ── Favorites ─────────────────────────────────────────
function renderFavorites() {
  const list = $('favorites-list');
  if (!list) return;

  if (favoriteBeers.length === 0) {
    list.innerHTML = '<p class="muted">No favorites yet.</p>';
    return;
  }

  list.replaceChildren();

  const fragment = document.createDocumentFragment();
  for (const beer of favoriteBeers) {
    const div = document.createElement('div');
    div.className = 'favorite-item';
    const strong = document.createElement('strong');
    strong.textContent = beer.name;
    const small = document.createElement('small');
    small.textContent = beer.description;
    div.append(strong, small);
    fragment.append(div);
  }
  list.append(fragment);
}

// ── Stats ─────────────────────────────────────────────
function renderStats() {
  const list = $('stats-list');
  if (!list) return;

  if (generatedNames.length === 0) {
    list.innerHTML = '<p class="muted">Generate beers to see stats.</p>';
    return;
  }

  const grouped = Object.groupBy(
    generatedNames,
    (b) => b.specs?.category ?? 'Unknown'
  );

  const top = Object.entries(grouped)
    .map(([cat, beers]) => [cat, beers.length])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const unique = new Set(generatedNames.map((b) => b.name)).size;

  const rows = [
    ['Total brewed', totalGenerated],
    ['Unique names', unique],
    ...top,
  ];

  list.replaceChildren(
    ...rows.map(([key, count]) => {
      const row = document.createElement('div');
      row.className = 'stat-row';
      const span = document.createElement('span');
      span.textContent = key;
      const strong = document.createElement('strong');
      strong.textContent = count;
      row.append(span, strong);
      return row;
    })
  );
}

function updateCount() {
  setText('generation-count', `${totalGenerated} brews crafted`);
}

// ── Persistence ───────────────────────────────────────
function persist() {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(generatedNames));
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteBeers));
  } catch {
    showToast('Storage full — older entries may not be saved', 'warning');
  }
}

// ── Core action ───────────────────────────────────────
function generateAndDisplay() {
  const beer = generateBeer();
  currentBeer = beer;
  generatedNames.unshift(beer);
  if (generatedNames.length > MAX_HISTORY) {
    generatedNames.length = MAX_HISTORY;
  }
  totalGenerated += 1;
  displayBeer(beer);
  updateCount();
  renderHistory();
  renderStats();
  persist();
}

// ── Auto-generate ─────────────────────────────────────
function toggleAuto() {
  const btn = $('auto-generate');
  if (autoGenerateInterval) {
    clearInterval(autoGenerateInterval);
    autoGenerateInterval = null;
    if (btn) {
      btn.innerHTML =
        '<i class="fas fa-sync-alt" aria-hidden="true"></i> Auto';
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    }
    showToast('Auto stopped', 'warning');
    return;
  }

  generateAndDisplay();
  autoGenerateInterval = setInterval(generateAndDisplay, 10_000);
  if (btn) {
    btn.innerHTML =
      '<i class="fas fa-stop-circle" aria-hidden="true"></i> Stop';
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
  }
  showToast('Auto generation on', 'success');
}

// ── Event bindings ────────────────────────────────────
function bindEvents() {
  $('generate')?.addEventListener('click', generateAndDisplay);
  $('auto-generate')?.addEventListener('click', toggleAuto);

  $('clear-history')?.addEventListener('click', () => {
    generatedNames = [];
    totalGenerated = 0;
    localStorage.removeItem(HISTORY_KEY);
    updateCount();
    renderHistory();
    renderStats();
    showToast('History cleared', 'warning');
  });

  $('save-favorite')?.addEventListener('click', () => {
    if (!currentBeer) {
      showToast('Generate a beer first', 'warning');
      return;
    }
    if (favoriteBeers.some((f) => f.id === currentBeer.id)) {
      showToast('Already saved', 'info');
      return;
    }
    favoriteBeers.unshift(currentBeer);
    if (favoriteBeers.length > MAX_FAVORITES) {
      favoriteBeers.length = MAX_FAVORITES;
    }
    renderFavorites();
    persist();
    showToast('Saved to favorites!', 'success');
  });

  $('theme-toggle')?.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  });

  $('share-beer')?.addEventListener('click', async () => {
    if (!currentBeer) {
      showToast('Generate a beer first', 'warning');
      return;
    }
    const text = `${currentBeer.name}\n${currentBeer.description}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Beer Name Generator', text });
        showToast('Shared!', 'success');
      } catch {
        showToast('Share canceled', 'info');
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!', 'success');
    } catch {
      showToast('Copy failed', 'error');
    }
  });

  $('generate-image')?.addEventListener('click', generateImage);

  $('api-key-btn')?.addEventListener('click', openApiKeyModal);
  $('api-key-cancel')?.addEventListener('click', closeApiKeyModal);
  $('api-key-backdrop')?.addEventListener('click', closeApiKeyModal);

  $('api-key-save')?.addEventListener('click', () => {
    const input = $('api-key-input');
    const key = input?.value.trim() ?? '';
    if (!key.startsWith('sk-')) {
      showToast('Enter a valid OpenAI key (starts with sk-)', 'warning');
      return;
    }
    localStorage.setItem(API_KEY_KEY, key);
    closeApiKeyModal();
    showToast('API key saved', 'success');
  });

  $('api-key-input')?.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') $('api-key-save')?.click();
  });

  $('image-modal-close')?.addEventListener('click', closeImageModal);
  $('image-modal-close-2')?.addEventListener('click', closeImageModal);
  $('image-backdrop')?.addEventListener('click', closeImageModal);

  $('image-download')?.addEventListener('click', async () => {
    if (!lastImageUrl) return;
    try {
      const blob = await fetch(lastImageUrl).then((r) => r.blob());
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${currentBeer.name.replace(/[^a-z0-9]/gi, '-')}.png`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(lastImageUrl, '_blank');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      const imageModal = $('image-modal');
      const apiModal = $('api-key-modal');
      if (imageModal && !imageModal.hidden) { closeImageModal(); return; }
      if (apiModal && !apiModal.hidden) { closeApiKeyModal(); return; }
    }
    if (
      e.code === 'Space' &&
      !e.target.closest('button, select, input, textarea') &&
      !autoGenerateInterval
    ) {
      e.preventDefault();
      generateAndDisplay();
    }
  });
}

// ── Init ──────────────────────────────────────────────
function init() {
  generatedNames = safeParseArray(localStorage.getItem(HISTORY_KEY));
  favoriteBeers = safeParseArray(localStorage.getItem(FAVORITES_KEY));
  totalGenerated = generatedNames.length;
  currentBeer = generatedNames[0] ?? null;

  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme != null ? savedTheme === 'dark' : true);

  populateSelects();
  bindEvents();
  updateCount();
  renderHistory();
  renderFavorites();
  renderStats();

  if (currentBeer) displayBeer(currentBeer);

  initBubbles();
}

// ── Boot ──────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
