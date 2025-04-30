// SMH Library Module: Handles book data rendering and interaction logic
import { smhLibraryStorageGet, smhLibraryStorageSet } from './smh-library-storage.js';


// Persistent keys for localStorage data
const wishlistKey = 'smh-library-wishlist';
const favouritesKey = 'smh-library-favourites';

/**
 * Asynchronously loads the full list of books from the project's JSON dataset.
 * @returns {Promise<Array>} Array of book objects parsed from JSON.
 */
export async function smhLibraryLoadBooks() {
  const res = await fetch('./data/books.json');
  return await res.json();
}

/**
 * Generates an interactive book card element with appropriate content, styling, and behaviour.
 * @param {Object} book - Book object containing title, author, ISBN, etc.
 * @param {boolean} highlight - Optionally applies a visual highlight class.
 * @param {Object} options - Behavioural flags, e.g. { allowRemoveFavorite: true }
 * @returns {HTMLElement} DOM element representing a complete book entry.
 */
export function smhLibraryRenderBook(book, highlight = false, options = {}) {
  const div = document.createElement('div');
  div.className = 'book fade-in'; // Animation class for entry
  if (highlight) div.classList.add('highlight'); // Emphasise best match

  // Provide semantic identifier for tracking
  div.setAttribute('data-smh-library-isbn', book.isbn || '');

  // Determine if already favourited
  const isFavourited = smhLibraryStorageGet(favouritesKey, [])
    .some(fav => fav.title === book.title);
  const favLabel = isFavourited ? '⭐ Favourited' : '💖 Favourite';

  // Parse and display the book description as clean paragraphs
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

  // Assemble the inner content for the book card
  div.innerHTML = `
    ${book.cover ? `<img src="${book.cover}" alt="Cover for ${book.title}" class="smh-library-book-cover">` : ''}
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
        <button class="smh-library-btn smh-remove-fav" data-smh-library-remove="${book.title}">
          🗑️ Remove
        </button>
      ` : `
        <button class="smh-library-btn" data-smh-library-add="${book.title}">
          Add to Wishlist
        </button>
        <button class="smh-library-btn smh-fav-btn ${isFavourited ? 'favourited' : ''}" data-smh-library-fav="${book.title}">
          ${favLabel}
        </button>
      `}
    </div>
  `;

  // Hook: Wishlist interaction
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

  // Hook: Favourites interaction
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

  // Hook: Remove favourite interaction (on favourites.html)
  const removeBtn = div.querySelector('[data-smh-library-remove]');
  if (removeBtn) {
    removeBtn.onclick = () => {
      let favourites = smhLibraryStorageGet(favouritesKey, []);
      favourites = favourites.filter(b => b.title !== book.title);
      smhLibraryStorageSet(favouritesKey, favourites);
      div.remove(); // Remove element from DOM immediately
    };
  }

  return div;
}
