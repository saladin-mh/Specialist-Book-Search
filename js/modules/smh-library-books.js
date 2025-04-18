import { smhLibraryStorageGet, smhLibraryStorageSet } from './smh-library-storage.js';

const wishlistKey = 'smh-library-wishlist';
const favoritesKey = 'smh-library-favorites';

export async function smhLibraryLoadBooks() {
  const res = await fetch('data/books.json');
  return await res.json();
}

export function smhLibraryRenderBook(book, highlight = false, options = {}) {
  const isFavorited = smhLibraryStorageGet(favoritesKey, []).some(fav => fav.title === book.title);
  const div = document.createElement('div');
  div.className = 'book';
  if (highlight) div.classList.add('highlight');

  // Add ISBN as unique identifier
  div.setAttribute('data-smh-library-isbn', book.isbn || '');

  div.innerHTML = `
    ${book.cover ? `<img src="${book.cover}" alt="${book.title} cover" class="smh-library-book-cover">` : ''}
    <h3>${book.title}</h3>
    <p><strong>Author:</strong> ${book.author}</p>
    <p><strong>Genre:</strong> ${book.genre}</p>
    <p><strong>Language:</strong> ${book.language}</p>
    <p><strong>Year:</strong> ${book.year}</p>
    <p><strong>ISBN:</strong> ${book.isbn}</p>
    <p><strong>Price:</strong> $${Number(book.price).toFixed(2)}</p>
    <p>${book.description}</p>
    <div class="smh-library-rating" data-smh-library-rating="${book.rating || 0}"></div>

    <div class="smh-library-actions">
      ${options.allowRemoveFavorite ? `
        <button class="smh-library-btn smh-remove-fav" data-smh-library-remove="${book.title}">🗑️ Remove</button>
      ` : `
        <button class="smh-library-btn" data-smh-library-add="${book.title}">Add to Wishlist</button>
        <button class="smh-library-btn smh-fav-btn" data-smh-library-fav="${book.title}"> ${isFavorited ? '⭐ Favorited' : '💖 Favorite'}</button>
      `}
    </div>
  `;

  // ✅ Add to Wishlist (if button exists)
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

  // ✅ Add to Favorites (if button exists)
  const favBtn = div.querySelector('[data-smh-library-fav]');
  if (favBtn) {
    favBtn.onclick = () => {
      const favorites = smhLibraryStorageGet(favoritesKey, []);
      if (!favorites.find(b => b.title === book.title)) {
        favorites.push(book);
        smhLibraryStorageSet(favoritesKey, favorites);
      }
    };
  }

  // ✅ Remove from Favorites (only shown on favorites.html)
  const removeBtn = div.querySelector('[data-smh-library-remove]');
  if (removeBtn) {
    removeBtn.onclick = () => {
      let favorites = smhLibraryStorageGet(favoritesKey, []);
      favorites = favorites.filter(b => b.title !== book.title);
      smhLibraryStorageSet(favoritesKey, favorites);
      div.remove(); // Remove from DOM
    };
  }

  return div;
}
