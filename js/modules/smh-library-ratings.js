import { smhLibraryStorageGet, smhLibraryStorageSet } from './smh-library-storage.js';

const RATING_KEY = 'smh-library-user-ratings';

// SMH Library: Initialize all book ratings
export function smhLibraryInitRatings() {
  const allRatings = smhLibraryStorageGet(RATING_KEY, {});

  document.querySelectorAll('.smh-library-rating').forEach(container => {
    const bookElement = container.closest('.book');
    const isbn = bookElement?.dataset.smhLibraryIsbn;
    if (!isbn) return;

    const current = allRatings[isbn] || 0;
    container.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.textContent = i <= current ? '★' : '☆';
      star.classList.add('smh-library-star');
      star.style.cursor = 'pointer';
      star.setAttribute('data-star', i);

      star.addEventListener('click', () => {
        allRatings[isbn] = i;
        smhLibraryStorageSet(RATING_KEY, allRatings);
        smhLibraryInitRatings(); // re-render
      });

      container.appendChild(star);
    }
  });
}
