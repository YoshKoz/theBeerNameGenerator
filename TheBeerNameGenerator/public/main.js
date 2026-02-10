import { random, articleFor, randomMultiple } from './utils.js';

let beerData = null;
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

function showToast(message, type = 'info', duration = 2200) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.classList.remove('success', 'warning', 'error');
  if (type === 'success') toast.classList.add('success');
  if (type === 'warning') toast.classList.add('warning');
  if (type === 'error') toast.classList.add('error');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), duration);
}

function createBubbles() {
  const container = document.getElementById('bubbles');
  if (!container) return;

  setInterval(() => {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = Math.random() * 12 + 6;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${Math.random() * 5 + 6}s`;
    container.appendChild(bubble);
    setTimeout(() => bubble.remove(), 11000);
  }, 650);
}

function createBackgroundBubbles() {
  const bg = document.getElementById('bubbles-bg');
  if (!bg) return;

  setInterval(() => {
    const bubble = document.createElement('div');
    bubble.className = 'bg-bubble';
    const size = Math.random() * 22 + 10;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${Math.random() * 9 + 12}s`;
    bg.appendChild(bubble);
    setTimeout(() => bubble.remove(), 22000);
  }, 850);
}

async function loadBeerData() {
  const response = await fetch('beer_data.json');
  if (!response.ok) {
    throw new Error(`Failed to load beer_data.json (${response.status})`);
  }
  beerData = await response.json();
}

function applyTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  const button = document.getElementById('theme-toggle');
  if (button) {
    button.innerHTML = isDark
      ? '<i class="fas fa-sun" aria-hidden="true"></i> Light Mode'
      : '<i class="fas fa-moon" aria-hidden="true"></i> Dark Mode';
    button.setAttribute('aria-pressed', String(isDark));
  }
}

function populateCustomizationControls() {
  const categorySelect = document.getElementById('category-select');
  const adjectiveSelect = document.getElementById('adjective-select');
  const styleSelect = document.getElementById('style-select');
  if (!beerData) return;

  if (categorySelect) {
    categorySelect.innerHTML = '<option value="random">Random</option>';
    (beerData.categories || []).forEach((item) => {
      categorySelect.innerHTML += `<option value="${item}">${item}</option>`;
    });
  }

  if (adjectiveSelect) {
    adjectiveSelect.innerHTML = '<option value="random">Random</option>';
    (beerData.coolAdjectives || []).forEach((item) => {
      adjectiveSelect.innerHTML += `<option value="${item}">${item}</option>`;
    });
  }

  if (styleSelect) {
    styleSelect.innerHTML = '<option value="random">Random</option>';
    const styles = beerData.types?.length ? beerData.types : beerData.categories;
    (styles || []).forEach((item) => {
      styleSelect.innerHTML += `<option value="${item}">${item}</option>`;
    });
  }
}

function generateBeer() {
  const categorySelect = document.getElementById('category-select');
  const adjectiveSelect = document.getElementById('adjective-select');
  const styleSelect = document.getElementById('style-select');

  const adjective =
    adjectiveSelect?.value && adjectiveSelect.value !== 'random'
      ? adjectiveSelect.value
      : random(beerData.coolAdjectives);

  const adjective2 = random(beerData.coolAdjectives);
  const creature = random(beerData.mythicalCreatures);
  const category =
    categorySelect?.value && categorySelect.value !== 'random'
      ? categorySelect.value
      : random(beerData.categories);
  const style =
    styleSelect?.value && styleSelect.value !== 'random'
      ? styleSelect.value
      : random(beerData.types?.length ? beerData.types : beerData.categories);
  const [color1, color2] = randomMultiple(beerData.colors, 2, true);
  const glass = random(beerData.beerGlasses);
  const region = random(beerData.regions);
  const abv = random(beerData.abvRanges);
  const ibu = random(beerData.ibuRanges);
  const technique = random(beerData.brewingTechniques);
  const occasion = random(beerData.occasions);

  const name = `The ${adjective} ${adjective2} ${creature}`;
  const article = articleFor(adjective);
  const description = `${article} ${adjective} ${color1}/${color2} ${style} with ${technique.toLowerCase()} notes, served in ${glass}.`;

  return {
    id: `beer-${Date.now()}`,
    name,
    description,
    specs: { category, style, region, abv, ibu, technique, occasion },
  };
}

function displayBeer(beer) {
  const output = document.getElementById('random-name');
  if (!output) return;
  output.textContent = `"${beer.name}" - ${beer.description}`;
}

function renderHistory() {
  const historyList = document.getElementById('history-list');
  if (!historyList) return;
  historyList.innerHTML = '';

  generatedNames.slice(0, 20).forEach((beer) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'history-item';
    item.innerHTML = `<strong>${beer.name}</strong><small>${beer.specs.category} | ${beer.specs.abv} | ${beer.specs.ibu}</small>`;
    item.addEventListener('click', () => {
      currentBeer = beer;
      displayBeer(beer);
      showToast('Loaded from history');
    });
    historyList.appendChild(item);
  });
}

function renderFavorites() {
  const list = document.getElementById('favorites-list');
  if (!list) return;
  list.innerHTML = '';

  if (favoriteBeers.length === 0) {
    list.innerHTML = '<p class="muted">No favorites yet.</p>';
    return;
  }

  favoriteBeers.forEach((beer) => {
    const item = document.createElement('div');
    item.className = 'favorite-item';
    item.innerHTML = `<strong>${beer.name}</strong><small>${beer.description}</small>`;
    list.appendChild(item);
  });
}

function renderStats() {
  const list = document.getElementById('stats-list');
  if (!list) return;

  if (generatedNames.length === 0) {
    list.innerHTML = '<p class="muted">Generate beers to see stats.</p>';
    return;
  }

  const counts = {};
  generatedNames.forEach((beer) => {
    const cat = beer.specs?.category || 'Unknown';
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  list.innerHTML = `
    <p><strong>Total generated:</strong> ${totalGenerated}</p>
    <p><strong>Unique names:</strong> ${new Set(generatedNames.map((b) => b.name)).size}</p>
    <p><strong>Top categories:</strong> ${top.map(([cat, n]) => `${cat} (${n})`).join(', ')}</p>
  `;
}

function updateCounters() {
  const countEl = document.getElementById('generation-count');
  if (countEl) {
    countEl.textContent = `${totalGenerated} beers crafted`;
  }
}

function persistState() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(generatedNames));
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteBeers));
}

function generateAndDisplay() {
  const beer = generateBeer();
  currentBeer = beer;
  generatedNames.unshift(beer);
  if (generatedNames.length > 100) generatedNames.length = 100;
  totalGenerated += 1;

  displayBeer(beer);
  updateCounters();
  renderHistory();
  renderStats();
  persistState();
}

function toggleHistoryPanel() {
  const panel = document.getElementById('history-panel');
  const toggle = document.getElementById('history-toggle');
  if (!panel || !toggle) return;

  const isOpen = panel.classList.toggle('show');
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.innerHTML = isOpen
    ? '<i class="fas fa-chevron-down" aria-hidden="true"></i>'
    : '<i class="fas fa-history" aria-hidden="true"></i>';
}

function toggleAutoGenerate() {
  const button = document.getElementById('auto-generate');
  if (autoGenerateInterval) {
    clearInterval(autoGenerateInterval);
    autoGenerateInterval = null;
    if (button) {
      button.classList.remove('active');
      button.innerHTML = '<i class="fas fa-sync-alt" aria-hidden="true"></i> Auto Generate';
      button.setAttribute('aria-pressed', 'false');
    }
    showToast('Auto generation stopped', 'warning');
    return;
  }

  generateAndDisplay();
  autoGenerateInterval = setInterval(generateAndDisplay, 10000);
  if (button) {
    button.classList.add('active');
    button.innerHTML = '<i class="fas fa-stop-circle" aria-hidden="true"></i> Stop Auto';
    button.setAttribute('aria-pressed', 'true');
  }
  showToast('Auto generation enabled', 'success');
}

function bindEvents() {
  document.getElementById('generate')?.addEventListener('click', () => {
    generateAndDisplay();
  });

  document.getElementById('auto-generate')?.addEventListener('click', () => {
    toggleAutoGenerate();
  });

  document.getElementById('history-toggle')?.addEventListener('click', () => {
    toggleHistoryPanel();
  });

  document.getElementById('clear-history')?.addEventListener('click', () => {
    generatedNames = [];
    totalGenerated = 0;
    localStorage.removeItem(HISTORY_KEY);
    updateCounters();
    renderHistory();
    renderStats();
    showToast('History cleared', 'warning');
  });

  document.getElementById('save-favorite')?.addEventListener('click', () => {
    if (!currentBeer) {
      showToast('Generate a beer first', 'warning');
      return;
    }
    if (favoriteBeers.some((item) => item.id === currentBeer.id)) {
      showToast('Already saved', 'info');
      return;
    }

    favoriteBeers.unshift(currentBeer);
    if (favoriteBeers.length > 25) favoriteBeers.length = 25;
    renderFavorites();
    persistState();
    showToast('Saved to favorites', 'success');
  });

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  });

  document.getElementById('share-beer')?.addEventListener('click', async () => {
    if (!currentBeer) {
      showToast('Generate a beer first', 'warning');
      return;
    }

    const text = `${currentBeer.name}\n${currentBeer.description}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Beer Name Generator', text });
        showToast('Shared', 'success');
      } catch {
        showToast('Share canceled', 'info');
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard', 'success');
    } catch {
      showToast('Copy failed', 'error');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && event.target === document.body) {
      event.preventDefault();
      generateAndDisplay();
    }

    if (event.key === 'Escape') {
      const panel = document.getElementById('history-panel');
      const toggle = document.getElementById('history-toggle');
      if (panel?.classList.contains('show')) {
        panel.classList.remove('show');
        toggle?.setAttribute('aria-expanded', 'false');
        if (toggle) {
          toggle.innerHTML = '<i class="fas fa-history" aria-hidden="true"></i>';
        }
      }
    }
  });
}

function restoreState() {
  generatedNames = safeParseArray(localStorage.getItem(HISTORY_KEY));
  favoriteBeers = safeParseArray(localStorage.getItem(FAVORITES_KEY));
  totalGenerated = generatedNames.length;
  currentBeer = generatedNames[0] || null;

  const preferredTheme = localStorage.getItem(THEME_KEY);
  applyTheme(preferredTheme === 'dark');
}

async function initializeBeerGenerator() {
  try {
    await loadBeerData();
  } catch (error) {
    showToast(error.message, 'error', 5000);
    console.error(error);
    return;
  }

  restoreState();
  populateCustomizationControls();
  bindEvents();
  updateCounters();
  renderHistory();
  renderFavorites();
  renderStats();

  if (currentBeer) {
    displayBeer(currentBeer);
  }

  createBubbles();
  createBackgroundBubbles();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBeerGenerator);
} else {
  initializeBeerGenerator();
}
