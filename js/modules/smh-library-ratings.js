import { smhLibraryStorageGet, smhLibraryStorageSet } from './smh-library-storage.js';

const key = 'smh-library-user-ratings';

/**
 * Initialises the star rating component on all rendered books.
 * - Pulls previous ratings from localStorage
 * - Binds both mouse and keyboard events
 * - Ensures accessibility (ARIA)
 */
export function smhLibraryInitRatings() {
  const ratings = smhLibraryStorageGet(key, {});

  document.querySelectorAll('.smh-library-rating').forEach(container => {
    const bookEl = container.closest('.book');
    const isbn = bookEl?.dataset.smhLibraryIsbn;
    const current = ratings[isbn] || 0;

    container.innerHTML = '';
    container.setAttribute('role', 'radiogroup');
    container.setAttribute('aria-label', 'Book rating');

    // Dynamically create 5-star rating scale
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.textContent = i <= current ? '★' : '☆';
      star.className = 'smh-library-star';
      star.setAttribute('data-star', i);
      star.setAttribute('tabindex', 0);
      star.setAttribute('role', 'radio');
      star.setAttribute('aria-checked', i === current);

      // Click event to update rating
      star.addEventListener('click', () => {
        ratings[isbn] = i;
        smhLibraryStorageSet(key, ratings);
        smhLibraryInitRatings(); // Re-render for UI update
      });

      // Keyboard support: Enter or Space sets rating
      star.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          star.click();
        }
      });

      container.appendChild(star);
    }
  });
}
