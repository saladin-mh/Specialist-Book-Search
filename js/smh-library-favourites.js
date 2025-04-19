import { smhLibraryStorageGet } from './modules/smh-library-storage.js';
import { smhLibraryRenderBook } from './modules/smh-library-books.js';
import { smhLibraryInitRatings } from './modules/smh-library-ratings.js';

/**
 * Initialises the favourites page by loading saved favourites
 * from localStorage and rendering each book as a card element.
 * Includes full fade animation and ratings module injection.
 */
document.addEventListener('DOMContentLoaded', () => {
  const favorites = smhLibraryStorageGet('smh-library-favourites', []);
  const container = document.getElementById('smh-library-results-container');

  // Fallback if no favourites found
  if (favorites.length === 0) {
    container.innerHTML = '<p>No favourite books found. 💔</p>';
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

  // Initialise dynamic star ratings post-render
  smhLibraryInitRatings();
});
