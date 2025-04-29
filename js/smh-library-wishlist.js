// Import dependencies for storage handling and toast notifications
import { smhLibraryStorageGet, smhLibraryStorageSet } from './modules/smh-library-storage.js';
import { smhLibraryShowToast } from './modules/smh-library-toast.js';

// Constant for local storage key name
const key = 'smh-library-wishlist';

/**
 * Renders the user's saved wishlist to the page.
 * Provides interaction to remove books dynamically with immediate DOM updates and feedback.
 */
export function smhLibraryRenderWishlist() {
  const container = document.getElementById('smh-library-wishlist-container');
  const wishlist = smhLibraryStorageGet(key, []);

  if (!container) return;

  // Case: Empty wishlist – notify user
  if (wishlist.length === 0) {
    container.innerHTML = '<p>Your wishlist is currently empty.</p>';
    return;
  }

  // Clear existing render
  container.innerHTML = '';

  // Loop through all wishlist books and render each one
  wishlist.forEach(book => {
    const div = document.createElement('div');
    div.className = 'book fade-in';

    // Visual and data markup for book details
    div.innerHTML = `
      ${book.cover ? `<img src="${book.cover}" alt="Cover of ${book.title}" class="smh-library-book-cover">` : ''}
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Genre:</strong> ${book.genre}</p>
      <p><strong>Language:</strong> ${book.language}</p>
      <p><strong>Year:</strong> ${book.year}</p>
      <p><strong>ISBN:</strong> ${book.isbn}</p>
      <p><strong>Price:</strong> £${Number(book.price).toFixed(2)}</p>
      <button class="smh-library-btn smh-remove-fav" data-remove="${book.title}" aria-label="Remove ${book.title} from wishlist">
        Remove
      </button>
    `;

    // Set up removal functionality
    const removeBtn = div.querySelector('[data-remove]');
    if (removeBtn) {
      removeBtn.onclick = () => {
        const updated = wishlist.filter(b => b.title !== book.title);
        smhLibraryStorageSet(key, updated);
        smhLibraryRenderWishlist();
        smhLibraryShowToast(`Removed “${book.title}” from wishlist.`);
      };
    }

    container.appendChild(div);
  });
}

// Trigger wishlist render on initial load
document.addEventListener('DOMContentLoaded', smhLibraryRenderWishlist);

/**
 * Enables responsive navigation toggle for mobile users.
 */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('smh-library-toggle-menu');
  const links = document.getElementById('smh-library-nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('show');
    });
  }
});
