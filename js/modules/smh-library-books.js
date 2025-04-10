// SMH Library: Load books from external JSON file
export async function smhLibraryLoadBooks() {
  try {
    const response = await fetch('data/books.json');
    const books = await response.json();
    return books;
  } catch (error) {
    console.error('SMH Library: Failed to load books', error);
    return [];
  }
}

// SMH Library: Render a single book as a card element
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
    <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
    <p>${book.description}</p>
    <div class="smh-library-rating" data-smh-library-rating="${book.rating || 0}"></div>
    <button class="smh-library-btn" data-smh-library-add="${book.title}">Add to Wishlist</button>
  `;

  return div;
}
