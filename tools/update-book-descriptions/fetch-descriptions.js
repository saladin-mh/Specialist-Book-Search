const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const INPUT_PATH = path.resolve(__dirname, '../../html/data/books.json');
const OUTPUT_PATH = path.resolve(__dirname, '../../html/data/books-with-descriptions.json');

// Load existing books from JSON
let books = require(INPUT_PATH);

// Use Open Library to fetch descriptions
async function fetchDescription(isbn) {
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const description = data[`ISBN:${isbn}`]?.details?.description;

    if (typeof description === 'string') return description;
    if (description && typeof description === 'object' && description.value) return description.value;

    return null;
  } catch (err) {
    console.error(`❌ Error fetching ISBN ${isbn}:`, err.message);
    return null;
  }
}

// Enrich all books with fetched descriptions
async function enrichBooks() {
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    if (!book.description && book.isbn) {
      console.log(`📘 Fetching: ${book.title} (ISBN: ${book.isbn})`);
      const desc = await fetchDescription(book.isbn);
      if (desc) {
        if (desc && !desc.toLowerCase().includes('generated')) {
          book.description = desc;
        }
        
      }
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(books, null, 2));
  console.log(`✅ Finished. Output saved to: ${OUTPUT_PATH}`);
}

enrichBooks();
