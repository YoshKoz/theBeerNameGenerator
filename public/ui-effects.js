/**
 * UI Interactions and Visual Effects for Beer Name Generator
 * This file handles bubble animations and history panel toggling
 */

/**
 * Create floating bubbles inside the beer glass container
 */
function createBubbles() {
  const bubblesContainer = document.getElementById('bubbles');
  if (!bubblesContainer) return;

  setInterval(() => {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = Math.random() * 12 + 6; // slightly larger bubbles
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = Math.random() * 100 + '%';
    bubble.style.animationDuration = Math.random() * 6 + 8 + 's';
    bubble.style.animationDelay = Math.random() * 2 + 's';
    bubblesContainer.appendChild(bubble);

    // Remove bubble after animation completes
    setTimeout(() => bubble.remove(), 15000);
  }, 800); // Higher frequency for more bubbles
}

/**
 * Create background bubbles that float across the entire page
 */
function createBackgroundBubbles() {
  const bg = document.getElementById('bubbles-bg');
  if (!bg) return;

  setInterval(() => {
    const b = document.createElement('div');
    b.className = 'bg-bubble';
    const size = Math.random() * 20 + 10; // Larger background bubbles
    b.style.width = size + 'px';
    b.style.height = size + 'px';
    b.style.left = Math.random() * 100 + '%';
    // Start randomly at the bottom
    b.style.bottom = -20 - Math.random() * 40 + 'px';
    b.style.animationDuration = Math.random() * 10 + 12 + 's';
    b.style.animationDelay = Math.random() * 2 + 's';
    bg.appendChild(b);

    // Remove bubble after animation completes
    setTimeout(() => b.remove(), 20000);
  }, 600);
}

/**
 * Set up history panel toggle functionality
 */
function setupHistoryPanelToggle() {
  const historyToggleBtn = document.getElementById('history-toggle');
  const historyPanel = document.querySelector('.history');

  if (historyToggleBtn && historyPanel) {
    historyToggleBtn.addEventListener('click', function () {
      const isExpanded = historyPanel.classList.contains('show');
      historyPanel.classList.toggle('show');

      // Update ARIA attributes for accessibility
      historyToggleBtn.setAttribute('aria-expanded', !isExpanded);

      // Update icon with better accessibility
      const newIcon = !isExpanded
        ? '<i class="fas fa-chevron-down" aria-hidden="true"></i>'
        : '<i class="fas fa-history" aria-hidden="true"></i>';
      historyToggleBtn.innerHTML = newIcon;

      // Update aria-label for better screen reader support
      const newLabel = !isExpanded ? 'Close beer history' : 'View beer history';
      historyToggleBtn.setAttribute('aria-label', newLabel);
    });

    // Add keyboard support for history panel
    historyToggleBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        historyToggleBtn.click();
      }
    });
  }
}

/**
 * Initialize all UI interactions and visual effects
 */
function initializeUIEffects() {
  // Start bubble animations
  createBubbles();
  createBackgroundBubbles();

  // Set up history panel toggle
  setupHistoryPanelToggle();

  console.log('✅ UI effects initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUIEffects);
} else {
  initializeUIEffects();
}
