import { beerData } from './beer_data.js';
import { random, articleFor, randomMultiple } from './utils.js';

let autoGenerateInterval = null;
let generatedNames = [];
let favoriteBeers = [];
let totalGenerated = 0;
let currentBeer = null;

const HISTORY_KEY = 'beerHistory';
const FAVORITES_KEY = 'beerFavorites';
const THEME_KEY = 'beerTheme';

function safeParseArray(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ── Toast ────────────────────────────────────────────
function showToast(message, type = 'info', duration = 2200) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.className = 'toast';
  if (type !== 'info') toast.classList.add(type);
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ── Bubbles ───────────────────────────────────────────
function spawnBubble(containerId, className, sizeMin, sizeMax, durationMin, durationMax, interval, lifetime) {
  const container = document.getElementById(containerId);
  if (!container) return;
  setInterval(() => {
    const b = document.createElement('div');
    b.className = className;
    const size = Math.random() * (sizeMax - sizeMin) + sizeMin;
    b.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;animation-duration:${Math.random() * (durationMax - durationMin) + durationMin}s`;
    container.appendChild(b);
    setTimeout(() => b.remove(), lifetime);
  }, interval);
}

function initBubbles() {
  spawnBubble('bubbles-bg', 'bg-bubble', 10, 32, 12, 22, 900, 24000);
  spawnBubble('card-bubbles', 'card-bubble', 5, 16, 6, 11, 700, 12000);
}

// ── Theme ─────────────────────────────────────────────
function applyTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// ── Controls population ───────────────────────────────
function populateSelects() {
  const fill = (id, items) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '<option value="random">Random</option>';
    items.forEach(v => { el.innerHTML += `<option value="${v}">${v}</option>`; });
  };
  fill('category-select', beerData.categories);
  fill('adjective-select', beerData.coolAdjectives);
  fill('style-select', beerData.types?.length ? beerData.types : beerData.categories);
}

// ── Generation ────────────────────────────────────────
function val(id) {
  const el = document.getElementById(id);
  return el?.value !== 'random' ? el.value : null;
}

// Readable prose shown on the card
const DESC_TEMPLATES = [
  (d) => `Brewed under a ${d.color2} moon, this ${d.mouthfeel} ${d.category} glows ${d.color1} in the ${d.glass} glass — as if the ${d.creature} itself breathed life into the brew. ${d.taste} enchantments drift from every sip, ${d.adverb} ${d.technique.toLowerCase()} in the ${d.region} highlands.`,
  (d) => `Legend says the ${d.creature} guards the last cask of this ${d.color1}-shimmering ${d.category}, ${d.technique.toLowerCase()} deep beneath ${d.region} soil. ${d.mouthfeel} and alive with ${d.taste} magic, it stirs something ancient at ${d.abv}.`,
  (d) => `A ${d.color1} mist rises from the ${d.glass} glass — this is the ${d.creature}'s ${d.category}, ${d.adverb} ${d.technique.toLowerCase()} with ${d.taste} sorcery. ${d.color2} embers swirl within, ${d.mouthfeel} on the tongue, fated for ${d.occasion.toLowerCase()}.`,
  (d) => `In the ${d.region} realm where the ${d.creature} roams, this ${d.adjective} ${d.category} is poured ${d.color1} and ${d.color2} like liquid starlight. ${d.mouthfeel}, tasting of ${d.taste} and old spells. ${d.abv} · ${d.ibu}.`,
  (d) => `The ${d.creature} left only one gift: this ${d.mouthfeel} ${d.category}, ${d.color2}-tinged and trembling with ${d.taste} power. ${d.adverb} ${d.technique.toLowerCase()} for ${d.occasion.toLowerCase()}, served in a ${d.glass} glass that glows faintly ${d.color1}.`,
  (d) => `${d.color1} as dawn over an enchanted ${d.region} forest, this ${d.technique.toLowerCase()} ${d.category} carries the ${d.creature}'s blessing — ${d.mouthfeel}, wreathed in ${d.taste} and ${d.color2} light. ${d.abv} · ${d.ibu}.`,
];

// DALL-E structured image prompts — copied when "Generate Image" is clicked

function generateBeer() {
  const adjective  = val('adjective-select') ?? random(beerData.coolAdjectives);
  const adjective2 = random(beerData.coolAdjectives);
  const creature   = random(beerData.mythicalCreatures);
  const category   = val('category-select')  ?? random(beerData.categories);
  const style      = val('style-select')     ?? random(beerData.types?.length ? beerData.types : beerData.categories);
  const [color1, color2] = randomMultiple(beerData.colors, 2, true);
  const glass      = random(beerData.beerGlasses);
  const region     = random(beerData.regions);
  const abv        = random(beerData.abvRanges);
  const ibu        = random(beerData.ibuRanges);
  const technique  = random(beerData.brewingTechniques);
  const occasion   = random(beerData.occasions);
  const taste      = random(beerData.tasteProfiles);
  const mouthfeel  = random(beerData.mouthfeelDescriptors);
  const adverb     = random(beerData.adverbs);

  const name    = `The ${adjective} ${adjective2} ${creature}`;
  const article = articleFor(adjective);

  const data = { adjective, article, category, color1, color2, glass, region, abv, ibu, technique, occasion, taste, mouthfeel, adverb, creature };
  const description = random(DESC_TEMPLATES)(data);
  const imagePrompt = `${description} Fantasy beer label artwork, the bottle or glass has a small elegant label reading "${name}" in ornate fantasy script. Sharp focus, 8k, no other text, no watermark, no artifacts.`;

  return { id: `beer-${Date.now()}`, name, description, imagePrompt, specs: { category, style, region, abv, ibu, technique, occasion } };
}

function displayBeer(beer) {
  const prompt = document.getElementById('brew-prompt');
  const nameEl = document.getElementById('brew-name');
  const descEl = document.getElementById('brew-desc');
  const specsEl = document.getElementById('brew-specs');
  if (!nameEl) return;

  if (prompt) prompt.hidden = true;

  nameEl.textContent = `"${beer.name}"`;
  nameEl.hidden = false;

  descEl.textContent = beer.description;
  descEl.hidden = false;

  const { category, abv, ibu, region, occasion } = beer.specs;
  specsEl.innerHTML = [category, abv, ibu, region, occasion]
    .map(s => `<span class="spec-chip">${s}</span>`)
    .join('');
  specsEl.hidden = false;
}

// ── Render lists ──────────────────────────────────────
function renderHistory() {
  const list = document.getElementById('history-list');
  if (!list) return;
  list.innerHTML = '';
  generatedNames.slice(0, 20).forEach(beer => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'history-item';
    btn.innerHTML = `<strong>${beer.name}</strong><small>${beer.specs.category} · ${beer.specs.abv} · ${beer.specs.ibu}</small>`;
    btn.addEventListener('click', () => { currentBeer = beer; displayBeer(beer); showToast('Loaded from history'); });
    list.appendChild(btn);
  });
}

function renderFavorites() {
  const list = document.getElementById('favorites-list');
  if (!list) return;
  if (favoriteBeers.length === 0) { list.innerHTML = '<p class="muted">No favorites yet.</p>'; return; }
  list.innerHTML = '';
  favoriteBeers.forEach(beer => {
    const div = document.createElement('div');
    div.className = 'favorite-item';
    div.innerHTML = `<strong>${beer.name}</strong><small>${beer.description}</small>`;
    list.appendChild(div);
  });
}

function renderStats() {
  const list = document.getElementById('stats-list');
  if (!list) return;
  if (generatedNames.length === 0) { list.innerHTML = '<p class="muted">Generate beers to see stats.</p>'; return; }

  const counts = {};
  generatedNames.forEach(b => { const c = b.specs?.category || 'Unknown'; counts[c] = (counts[c] || 0) + 1; });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const unique = new Set(generatedNames.map(b => b.name)).size;

  list.innerHTML = [
    ['Total brewed', totalGenerated],
    ['Unique names', unique],
    ...top.map(([cat, n]) => [cat, n]),
  ].map(([k, v]) => `<div class="stat-row"><span>${k}</span><strong>${v}</strong></div>`).join('');
}

function updateCount() {
  const el = document.getElementById('generation-count');
  if (el) el.textContent = `${totalGenerated} brews crafted`;
}

function persist() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(generatedNames));
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteBeers));
}

// ── Core action ───────────────────────────────────────
function generateAndDisplay() {
  const beer = generateBeer();
  currentBeer = beer;
  generatedNames.unshift(beer);
  if (generatedNames.length > 100) generatedNames.length = 100;
  totalGenerated += 1;
  displayBeer(beer);
  updateCount();
  renderHistory();
  renderStats();
  persist();
}

// ── Auto generate ─────────────────────────────────────
function toggleAuto() {
  const btn = document.getElementById('auto-generate');
  if (autoGenerateInterval) {
    clearInterval(autoGenerateInterval);
    autoGenerateInterval = null;
    if (btn) { btn.innerHTML = '<i class="fas fa-sync-alt"></i> Auto'; btn.classList.remove('active'); btn.setAttribute('aria-pressed','false'); }
    showToast('Auto stopped', 'warning');
    return;
  }
  generateAndDisplay();
  autoGenerateInterval = setInterval(generateAndDisplay, 10000);
  if (btn) { btn.innerHTML = '<i class="fas fa-stop-circle"></i> Stop'; btn.classList.add('active'); btn.setAttribute('aria-pressed','true'); }
  showToast('Auto generation on', 'success');
}

// ── Events ────────────────────────────────────────────
function bindEvents() {
  document.getElementById('generate')?.addEventListener('click', generateAndDisplay);
  document.getElementById('auto-generate')?.addEventListener('click', toggleAuto);

  document.getElementById('clear-history')?.addEventListener('click', () => {
    generatedNames = []; totalGenerated = 0;
    localStorage.removeItem(HISTORY_KEY);
    updateCount(); renderHistory(); renderStats();
    showToast('History cleared', 'warning');
  });

  document.getElementById('save-favorite')?.addEventListener('click', () => {
    if (!currentBeer) { showToast('Generate a beer first', 'warning'); return; }
    if (favoriteBeers.some(f => f.id === currentBeer.id)) { showToast('Already saved', 'info'); return; }
    favoriteBeers.unshift(currentBeer);
    if (favoriteBeers.length > 25) favoriteBeers.length = 25;
    renderFavorites(); persist();
    showToast('Saved to favorites!', 'success');
  });

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  });

  document.getElementById('share-beer')?.addEventListener('click', async () => {
    if (!currentBeer) { showToast('Generate a beer first', 'warning'); return; }
    const text = `${currentBeer.name}\n${currentBeer.description}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Beer Name Generator', text }); showToast('Shared!', 'success'); }
      catch { showToast('Share canceled', 'info'); }
      return;
    }
    try { await navigator.clipboard.writeText(text); showToast('Copied to clipboard!', 'success'); }
    catch { showToast('Copy failed', 'error'); }
  });

  document.getElementById('generate-image')?.addEventListener('click', async () => {
    if (!currentBeer) { showToast('Generate a beer first', 'warning'); return; }
    const { imagePrompt } = currentBeer;
    try { await navigator.clipboard.writeText(imagePrompt); } catch { showToast('Copy failed', 'error'); return; }
    window.open('https://chatgpt.com/', '_blank');
    showToast('Prompt copied — paste it in ChatGPT!', 'success', 3500);
  });

  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && e.target === document.body) { e.preventDefault(); generateAndDisplay(); }
  });
}

// ── Init ──────────────────────────────────────────────
function init() {
  generatedNames = safeParseArray(localStorage.getItem(HISTORY_KEY));
  favoriteBeers  = safeParseArray(localStorage.getItem(FAVORITES_KEY));
  totalGenerated = generatedNames.length;
  currentBeer    = generatedNames[0] || null;
  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme ? savedTheme === 'dark' : true);

  populateSelects();
  bindEvents();
  updateCount();
  renderHistory();
  renderFavorites();
  renderStats();
  if (currentBeer) displayBeer(currentBeer);
  initBubbles();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
