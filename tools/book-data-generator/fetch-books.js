const axios = require('axios');
const fs = require('fs');

const QUERY = 'fiction'; // Change to fantasy, history, etc.
const TOTAL_PAGES = 20;  // ~50 books per page × 20 = ~1000 books

async function fetchBooks(query, page) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&page=${page}`;
  const response = await axios.get(url);
  return response.data.docs;
}

function mapBook(doc) {
  return {
    title: doc.title || 'Unknown Title',
    author: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
    genre: 'Fiction',
    language: 'English',
    year: doc.first_publish_year || 2020,
    isbn: doc.isbn ? doc.isbn[0] : 'N/A',
    price: (Math.random() * 40 + 5).toFixed(2),
    rating: Math.floor(Math.random() * 5) + 1,
    description: 'Auto-generated via OpenLibrary',
    cover: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null
  };
}

(async function generateBooks() {
  let books = [];

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    console.log(`Fetching page ${page}...`);
    const docs = await fetchBooks(QUERY, page);
    books.push(...docs.map(mapBook));
  }

  fs.writeFileSync('../../data/books.json', JSON.stringify(books, null, 2));
  console.log(`✅ Saved ${books.length} books to books.json`);
})();
