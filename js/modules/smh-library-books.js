import { smhLibraryStorageGet, smhLibraryStorageSet } from './smh-library-storage.js';

const wishlistKey = 'smh-library-wishlist';
const favoritesKey = 'smh-library-favourites';

/**
 * Asynchronously loads the books data from JSON
 * @returns {Promise<Array>} Parsed JSON list of books
 */
export async function smhLibraryLoadBooks() {
  const res = await fetch('data/books.json');
  return await res.json();
}

/**
 * Renders a single book card into a DOM element
 * @param {Object} book - A book object
 * @param {boolean} highlight - Whether to visually highlight this book
 * @param {Object} options - Contextual flags (e.g., allowRemoveFavorite)
 * @returns {HTMLElement} DOM element representing the book
 */
export function smhLibraryRenderBook(book, highlight = false, options = {}) {
  const div = document.createElement('div');
  div.className = 'book fade-in'; // Includes animation
  if (highlight) div.classList.add('highlight');

  // Unique identifier to track by ISBN
  div.setAttribute('data-smh-library-isbn', book.isbn || '');

  // Check if book is already favorited for button label
  const isFavorited = smhLibraryStorageGet(favoritesKey, []).some(fav => fav.title === book.title);
  const favLabel = isFavorited ? '⭐ Favourited' : '💖 Favourite';

// Process the book description to produce multiple paragraphs if newlines are present
// Ensure the description is clean and presentable, or use a fallback
let summaryParagraphs = '';

if (book.description && typeof book.description === 'string' && book.description.length > 30) {
  summaryParagraphs = book.description
    .split('\n')
    .filter(p => p.trim() !== '')
    .map(p => `<p>${p.trim()}</p>`)
    .join('');
} else {
  summaryParagraphs = `<p><em>No summary available for this title.</em></p>`;
}



  div.innerHTML = `
    ${book.cover ? `<img src="${book.cover}" alt="${book.title} cover" class="smh-library-book-cover">` : ''}
    <h3>${book.title}</h3>
    <p><strong>Author:</strong> ${book.author}</p>
    <p><strong>Genre:</strong> ${book.genre}</p>
    <p><strong>Language:</strong> ${book.language}</p>
    <p><strong>Year:</strong> ${book.year}</p>
    <p><strong>ISBN:</strong> ${book.isbn}</p>
    <p><strong>Price:</strong> £${Number(book.price).toFixed(2)}</p>
    ${summaryParagraphs} 
    <div class="smh-library-rating" data-smh-library-rating="${book.rating || 0}"></div>

    <div class="smh-library-actions">
      ${options.allowRemoveFavorite ? `
        <button class="smh-library-btn smh-remove-fav" data-smh-library-remove="${book.title}">🗑️ Remove</button>
      ` : `
        <button class="smh-library-btn" data-smh-library-add="${book.title}">Add to Wishlist</button>
        <button class="smh-library-btn smh-fav-btn ${isFavorited ? 'favorited' : ''}" data-smh-library-fav="${book.title}">
          ${favLabel}
        </button>
      `}
    </div>
  `;

  // Wishlist button logic (if shown)
  const addBtn = div.querySelector('[data-smh-library-add]');
  if (addBtn) {
    addBtn.onclick = () => {
      const wishlist = smhLibraryStorageGet(wishlistKey, []);
      if (!wishlist.find(b => b.title === book.title)) {
        wishlist.push(book);
        smhLibraryStorageSet(wishlistKey, wishlist);
      }
    };
  }

  // Favourites button logic (if shown)
  const favBtn = div.querySelector('[data-smh-library-fav]');
  if (favBtn && !isFavorited) {
    favBtn.onclick = () => {
      const favorites = smhLibraryStorageGet(favoritesKey, []);
      if (!favorites.find(b => b.title === book.title)) {
        favorites.push(book);
        smhLibraryStorageSet(favoritesKey, favorites);
      }
    };
  }

  // Remove from favourites logic (if on favourites.html)
  const removeBtn = div.querySelector('[data-smh-library-remove]');
  if (removeBtn) {
    removeBtn.onclick = () => {
      let favorites = smhLibraryStorageGet(favoritesKey, []);
      favorites = favorites.filter(b => b.title !== book.title);
      smhLibraryStorageSet(favoritesKey, favorites);
      div.remove(); // Live removal from DOM
    };
  }

  return div;
}
