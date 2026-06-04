/**
 * UI Effects module — handles bubble animations and visual flair.
 * Extracted from main.js for separation of concerns.
 *
 * @module ui-effects
 */

/**
 * Spawns animated bubble elements into a container at a regular interval.
 * Each bubble is auto-removed after its lifetime expires.
 *
 * @param {string} containerId - DOM id of the bubble container
 * @param {string} className - CSS class for the bubble element
 * @param {number} sizeMin - Minimum bubble size in px
 * @param {number} sizeMax - Maximum bubble size in px
 * @param {number} durationMin - Minimum animation duration in seconds
 * @param {number} durationMax - Maximum animation duration in seconds
 * @param {number} interval - Milliseconds between bubble spawns
 * @param {number} lifetime - Milliseconds before each bubble is removed
 */
function spawnBubble(
  containerId,
  className,
  sizeMin,
  sizeMax,
  durationMin,
  durationMax,
  interval,
  lifetime
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  setInterval(() => {
    const bubble = document.createElement('div');
    bubble.className = className;
    const size =
      Math.random() * (sizeMax - sizeMin) + sizeMin;
    const duration =
      Math.random() * (durationMax - durationMin) + durationMin;
    bubble.style.cssText =
      `width:${size}px;height:${size}px;` +
      `left:${Math.random() * 100}%;` +
      `animation-duration:${duration}s`;

    container.appendChild(bubble);
    setTimeout(() => bubble.remove(), lifetime);
  }, interval);
}

/**
 * Check if the user has requested reduced motion.
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/**
 * Initialize all bubble effects (background and card).
 * Respects the user's motion preferences.
 */
function initBubbles() {
  if (prefersReducedMotion()) return;

  spawnBubble(
    'bubbles-bg',
    'bg-bubble',
    10,
    32,
    12,
    22,
    900,
    24000
  );
  spawnBubble(
    'card-bubbles',
    'card-bubble',
    5,
    16,
    6,
    11,
    700,
    12000
  );
}

export { initBubbles, spawnBubble, prefersReducedMotion };
