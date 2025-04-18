import { smhLibraryStorageGet, smhLibraryStorageSet } from './smh-library-storage.js';

const wishlistKey = 'smh-library-wishlist';
const favoritesKey = 'smh-library-favorites';

export async function smhLibraryLoadBooks() {
  const res = await fetch('data/books.json');
  return await res.json();
}

export function smhLibraryRenderBook(book, highlight = false, options = {}) {
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
      <button class="smh-library-btn smh-fav-btn" data-smh-library-fav="${book.title}">💖 Favorite</button>
      `}
    </div>
    `;
  // Add to Wishlist
  div.querySelector('[data-smh-library-add]').onclick = () => {
    const wishlist = smhLibraryStorageGet(wishlistKey, []);
    if (!wishlist.find(b => b.title === book.title)) {
      wishlist.push(book);
      smhLibraryStorageSet(wishlistKey, wishlist);
    }
  };
  // Remove from Favorites
  

  // Add to Favorites
  div.querySelector('[data-smh-library-fav]').onclick = () => {
    const favorites = smhLibraryStorageGet(favoritesKey, []);
    if (!favorites.find(b => b.title === book.title)) {
      favorites.push(book);
      smhLibraryStorageSet(favoritesKey, favorites);
    }
  };

  return div;
}