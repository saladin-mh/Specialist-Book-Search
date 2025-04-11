import { smhLibraryStorageGet, smhLibraryStorageSet } from './smh-library-storage.js';

const key = 'smh-library-user-ratings';

export function smhLibraryInitRatings() {
  const allRatings = smhLibraryStorageGet(key, {});

  document.querySelectorAll('.smh-library-rating').forEach(container => {
    const book = container.closest('.book');
    const isbn = book?.dataset.smhLibraryIsbn;
    if (!isbn) return;

    const current = allRatings[isbn] || 0;
    container.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.textContent = i <= current ? '★' : '☆';
      star.style.cursor = 'pointer';
      star.dataset.star = i;

      star.onclick = () => {
        allRatings[isbn] = i;
        smhLibraryStorageSet(key, allRatings);
        smhLibraryInitRatings();
      };

      container.appendChild(star);
    }
  });
}
