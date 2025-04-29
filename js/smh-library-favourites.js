// Module imports for data persistence, UI rendering, and accessibility
import { smhLibraryStorageGet, smhLibraryStorageSet } from './modules/smh-library-storage.js';
import { smhLibraryRenderBook } from './modules/smh-library-books.js';
import { smhLibraryInitRatings } from './modules/smh-library-ratings.js';
import { smhLibraryShowToast } from './modules/smh-library-toast.js';     

// Constant: Key identifier for favourites localStorage item
const favouritesKey = 'smh-library-favourites';

/**
 * Renders the user's saved favourites to the DOM.
 * Enables interaction for live removal of entries and visual feedback.
 */
function smhLibraryRenderFavourites() {
  const container = document.getElementById('smh-library-results-container');
  const favourites = smhLibraryStorageGet(favouritesKey, []);

  if (!container) return;

  // Empty state: Inform user of no saved favourites
  if (favourites.length === 0) {
    container.innerHTML = '<p>No favourite books found.</p>';
    return;
  }

  container.innerHTML = '';

  // Render each book using the shared rendering logic
  favourites.forEach(book => {
    const card = smhLibraryRenderBook(book, false, { allowRemoveFavorite: true });
    card.classList.add('fade-in');
    container.appendChild(card);
  });

  // Activate star rating display for each rendered book
  smhLibraryInitRatings();
}

/**
 * Ensures the favourites list loads as soon as the DOM is ready.
 * Also activates mobile-friendly navigation logic.
 */
document.addEventListener('DOMContentLoaded', () => {
  smhLibraryRenderFavourites();

  // Enable responsive navigation toggle
  const toggle = document.getElementById('smh-library-toggle-menu');
  const navLinks = document.getElementById('smh-library-nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
});
