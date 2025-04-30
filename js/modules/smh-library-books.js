/**
 * SMH Library Module — Book Rendering and Data Loader
 * This module handles the asynchronous loading of book data
 * from the local JSON source and provides a render method
 * to generate structured book cards.
 */

import { smhLibraryStorageGet, smhLibraryStorageSet } from './smh-library-storage.js';

const wishlistKey = 'smh-library-wishlist';
const favouritesKey = 'smh-library-favourites';

/**
 * Loads book data from the local `books.json` file.
 * This function assumes that the file is available and served correctly.
 * @returns {Promise<Array>} Resolves with parsed book data array
 */
export async function smhLibraryLoadBooks() {
  try {
    const response = await fetch('data/books.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const books = await response.json();
    return books;
  } catch (error) {
    console.error('Failed to load books:', error);
    return [];
  }
}

/**
 * Renders a structured book card using the provided book object.
 * The card includes meta info, dynamic rating, cover image, and user action buttons.
 * @param {Object} book - Book data to display
 * @param {boolean} highlight - Whether to visually highlight the book (top match)
 * @param {Object} options - Context options (e.g. allowRemove)
 * @returns {HTMLElement} Rendered DOM element
 */
export function smhLibraryRenderBook(book, highlight = false, options = {}) {
  const div = document.createElement('div');
  div.className = `book fade-in${highlight ? ' highlight' : ''}`;
  div.setAttribute('data-smh-library-isbn', book.isbn || '');
  div.setAttribute('tabindex', '0'); // Accessibility: allow keyboard focus

  // Parse long descriptions into paragraphs
  const summaryParagraphs = book.description
    .split('\n')
    .filter(p => p.trim() !== '')
    .slice(0, 2) // only show the first 2 by default
    .map(p => `<p>${p}</p>`)
    .join('');

  const isFavourited = smhLibraryStorageGet(favouritesKey, []).some(f => f.title === book.title);
  const favLabel = isFavourited ? '⭐ Favourited' : '💖 Favourite';

  div.innerHTML = `
    ${book.cover ? `<img src="${book.cover}" loading="lazy" alt="Cover of ${book.title}" class="smh-library-book-cover">` : ''}
    <h3>${book.title}</h3>
    <p><strong>Author:</strong> ${book.author}</p>
    <p><strong>Genre:</strong> ${book.genre}</p>
    <p><strong>Language:</strong> ${book.language}</p>
    <p><strong>Year:</strong> ${book.year}</p>
    <p><strong>ISBN:</strong> ${book.isbn}</p>
    <p><strong>Price:</strong> £${Number(book.price).toFixed(2)}</p>
    <div class="book-summary">${summaryParagraphs}</div>

    <div class="smh-library-rating" data-smh-library-rating="${book.rating || 0}" aria-label="Rating stars"></div>

    <div class="smh-library-actions">
      ${options.allowRemoveFavourite ? `
        <button class="smh-library-btn smh-remove-fav" data-smh-library-remove="${book.title}">🗑️ Remove</button>
      ` : `
        <button class="smh-library-btn" data-smh-library-add="${book.title}">Add to Wishlist</button>
        <button class="smh-library-btn smh-fav-btn ${isFavourited ? 'favourited' : ''}" data-smh-library-fav="${book.title}">
          ${favLabel}
        </button>
      `}
      ${book.url ? `<button class="smh-library-btn smh-library-share" onclick="navigator.clipboard.writeText('${book.url}')">Share</button>` : ''}
    </div>
  `;

  // Add to Wishlist Logic
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

  // Add to Favourites Logic
  const favBtn = div.querySelector('[data-smh-library-fav]');
  if (favBtn && !isFavourited) {
    favBtn.onclick = () => {
      const favourites = smhLibraryStorageGet(favouritesKey, []);
      if (!favourites.find(b => b.title === book.title)) {
        favourites.push(book);
        smhLibraryStorageSet(favouritesKey, favourites);
      }
    };
  }

  // Remove from Favourites Logic
  const removeBtn = div.querySelector('[data-smh-library-remove]');
  if (removeBtn) {
    removeBtn.onclick = () => {
      let favourites = smhLibraryStorageGet(favouritesKey, []);
      favourites = favourites.filter(b => b.title !== book.title);
      smhLibraryStorageSet(favouritesKey, favourites);
      div.remove();
    };
  }

  return div;
}
