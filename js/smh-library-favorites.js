import { smhLibraryStorageGet } from './modules/smh-library-storage.js';
import { smhLibraryRenderBook } from './modules/smh-library-books.js';
import { smhLibraryInitRatings } from './modules/smh-library-ratings.js';

document.addEventListener('DOMContentLoaded', () => {
  const favorites = smhLibraryStorageGet('smh-library-favorites', []);
  const container = document.getElementById('smh-library-results-container');

  if (favorites.length === 0) {
    container.innerHTML = '<p>No favorite books found. 💔</p>';
    return;
  }

  favorites.forEach(book => {
    const bookCard = smhLibraryRenderBook(book);
    container.appendChild(bookCard);
  });

  smhLibraryInitRatings();
});
