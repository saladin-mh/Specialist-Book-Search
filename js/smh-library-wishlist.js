import { smhLibraryStorageGet, smhLibraryStorageSet } from './modules/smh-library-storage.js';
import { smhLibraryShowToast } from './modules/smh-library-toast.js';

const key = 'smh-library-wishlist';

/**
 * Renders the user's wishlist onto the page.
 * Handles removal of items with immediate visual feedback and animation.
 */
export function smhLibraryRenderWishlist() {
  const container = document.getElementById('smh-library-wishlist-container');
  const wishlist = smhLibraryStorageGet(key, []);

  if (!container) return;

  // If wishlist is empty, provide a message
  if (wishlist.length === 0) {
    container.innerHTML = '<p>Your wishlist is currently empty.</p>';
    return;
  }

  // Clear previous entries
  container.innerHTML = '';

  wishlist.forEach(book => {
    const div = document.createElement('div');
    div.className = 'book fade-in'; // for animation

    // Construct book details and removal control
    div.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Genre:</strong> ${book.genre}</p>
      <p><strong>Language:</strong> ${book.language}</p>
      <p><strong>Year:</strong> ${book.year}</p>
      <p><strong>ISBN:</strong> ${book.isbn}</p>
      <p><strong>Price:</strong> £${Number(book.price).toFixed(2)}</p>
      <button class="smh-library-btn" data-remove="${book.title}" aria-label="Remove ${book.title} from wishlist">
        Remove
      </button>
    `;

    // Add button behaviour for removal
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

// Load wishlist when DOM is ready
document.addEventListener('DOMContentLoaded', smhLibraryRenderWishlist);

// Mobile Navigation Toggle for accessibility
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('smh-library-toggle-menu');
  const links = document.getElementById('smh-library-nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('show');
    });
  }
});
