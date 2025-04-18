import { smhLibraryStorageGet } from './modules/smh-library-storage.js';
import { smhLibraryRenderBook } from './modules/smh-library-books.js';
import { smhLibraryInitRatings } from './modules/smh-library-ratings.js';

/**
 * Initializes the favorites page by loading saved favorites
 * from localStorage and rendering each book as a card element.
 * Includes full fade animation and ratings module injection.
 */
document.addEventListener('DOMContentLoaded', () => {
  const favorites = smhLibraryStorageGet('smh-library-favorites', []);
  const container = document.getElementById('smh-library-results-container');

  // Fallback if no favorites found
  if (favorites.length === 0) {
    container.innerHTML = '<p>No favorite books found. 💔</p>';
    return;
  }

  // Render each favorited book
  favorites.forEach(book => {
    const bookCard = smhLibraryRenderBook(book, false, {
      allowRemoveFavorite: true
    });

    bookCard.classList.add('fade-in'); // apply animation
    container.appendChild(bookCard);
  });

  // Initialize dynamic star ratings post-render
  smhLibraryInitRatings();
});
