// Imports for managing persistent local ratings
import { smhLibraryStorageGet, smhLibraryStorageSet } from './smh-library-storage.js';

// Local storage key for user-assigned star ratings
const key = 'smh-library-user-ratings';

/**
 * Initialises dynamic star-based rating components across all book elements.
 * 
 * Features:
 * - Remembers prior user ratings using localStorage.
 * - Visually updates the rating UI with stars (★ filled, ☆ empty).
 * - Supports full keyboard accessibility and ARIA labelling.
 * - Real-time update via click or keyboard key (Enter/Space).
 */
export function smhLibraryInitRatings() {
  const ratings = smhLibraryStorageGet(key, {});

  // Target every container representing the rating region
  document.querySelectorAll('.smh-library-rating').forEach(container => {
    const bookEl = container.closest('.book');
    const isbn = bookEl?.dataset.smhLibraryIsbn;
    const current = ratings[isbn] || 0;

    // Clear any existing content for re-render
    container.innerHTML = '';
    container.setAttribute('role', 'radiogroup');
    container.setAttribute('aria-label', 'Book rating');

    // Create a scale of 1 to 5 stars
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.textContent = i <= current ? '★' : '☆';
      star.className = 'smh-library-star';
      star.setAttribute('data-star', i);
      star.setAttribute('tabindex', 0);
      star.setAttribute('role', 'radio');
      star.setAttribute('aria-checked', i === current);

      // Interaction via mouse click
      star.addEventListener('click', () => {
        ratings[isbn] = i;
        smhLibraryStorageSet(key, ratings);
        smhLibraryInitRatings(); // Refresh visual stars after change
      });

      // Keyboard interaction (Enter or Space)
      star.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          star.click(); // Trigger rating update
        }
      });

      container.appendChild(star);
    }
  });
}
