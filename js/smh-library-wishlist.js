import { smhLibraryStorageGet, smhLibraryStorageSet } from './modules/smh-library-storage.js';
import { smhLibraryShowToast } from './modules/smh-library-toast.js';

const key = 'smh-library-wishlist';

export function smhLibraryRenderWishlist() {
  const container = document.getElementById('smh-library-wishlist-container');
  const wishlist = smhLibraryStorageGet(key, []);

  if (wishlist.length === 0) {
    container.innerHTML = '<p>Your wishlist is empty.</p>';
    return;
  }

  container.innerHTML = '';
  wishlist.forEach(book => {
    const div = document.createElement('div');
    div.className = 'book';
    div.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Genre:</strong> ${book.genre}</p>
      <p><strong>Language:</strong> ${book.language}</p>
      <p><strong>Year:</strong> ${book.year}</p>
      <p><strong>ISBN:</strong> ${book.isbn}</p>
      <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
      <button class="smh-library-btn" data-remove="${book.title}">Remove</button>
    `;
    div.querySelector('[data-remove]').onclick = () => {
      const updated = wishlist.filter(b => b.title !== book.title);
      smhLibraryStorageSet(key, updated);
      smhLibraryRenderWishlist();
      smhLibraryShowToast(`Removed "${book.title}"`);
    };
    container.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', smhLibraryRenderWishlist);
