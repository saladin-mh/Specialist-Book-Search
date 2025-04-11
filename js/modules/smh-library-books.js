import { smhLibraryStorageGet, smhLibraryStorageSet } from './smh-library-storage.js';

const wishlistKey = 'smh-library-wishlist';

export async function smhLibraryLoadBooks() {
  const res = await fetch('data/books.json');
  return await res.json();
}

export function smhLibraryRenderBook(book, highlight = false) {
  const div = document.createElement('div');
  div.className = 'book';
  if (highlight) div.classList.add('highlight');

  div.setAttribute('data-smh-library-isbn', book.isbn || '');

  div.innerHTML = `
    <h3>${book.title}</h3>
    <p><strong>Author:</strong> ${book.author}</p>
    <p><strong>Genre:</strong> ${book.genre}</p>
    <p><strong>Language:</strong> ${book.language}</p>
    <p><strong>Year:</strong> ${book.year}</p>
    <p><strong>ISBN:</strong> ${book.isbn}</p>
    <p><strong>Price:</strong> $${Number(book.price).toFixed(2)}</p>
    <p>${book.description}</p>
    <div class="smh-library-rating"></div>
    <button class="smh-library-btn" data-add="${book.title}">Add to Wishlist</button>
  `;

  div.querySelector('[data-add]').onclick = () => {
    const wishlist = smhLibraryStorageGet(wishlistKey, []);
    if (!wishlist.find(b => b.title === book.title)) {
      wishlist.push(book);
      smhLibraryStorageSet(wishlistKey, wishlist);
    }
  };

  return div;
}
