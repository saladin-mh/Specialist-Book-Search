import { smhLibraryStorageGet, smhLibraryStorageSet } from './smh-library-storage.js';

const key = 'smh-library-user-ratings';

export function smhLibraryInitRatings() {
  const ratings = smhLibraryStorageGet(key, {});

  document.querySelectorAll('.smh-library-rating').forEach(container => {
    const bookEl = container.closest('.book');
    const isbn = bookEl?.dataset.smhLibraryIsbn;
    const current = ratings[isbn] || 0;

    container.innerHTML = '';
    container.setAttribute('role', 'radiogroup');
    container.setAttribute('aria-label', 'Book rating');

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.textContent = i <= current ? '★' : '☆';
      star.className = 'smh-library-star';
      star.setAttribute('data-star', i);
      star.setAttribute('tabindex', 0);
      star.setAttribute('role', 'radio');
      star.setAttribute('aria-checked', i === current);

      // Add click and keyboard control
      star.addEventListener('click', () => {
        ratings[isbn] = i;
        smhLibraryStorageSet(key, ratings);
        smhLibraryInitRatings(); // re-render all
      });

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
