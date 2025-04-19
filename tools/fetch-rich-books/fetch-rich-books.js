const axios = require('axios');
const fs = require('fs');
const path = require('path');

const QUERY = 'fiction';
const TOTAL_PAGES = 20;
const RESULTS_PER_PAGE = 50;

const OUTPUT_FILE = path.join(__dirname, 'books-rich.json');

async function fetchSearchResults(query, page) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=${RESULTS_PER_PAGE}`;
  try {
    const response = await axios.get(url);
    return response.data.docs;
  } catch (error) {
    console.error(`❌ Error fetching search results (page ${page}):`, error.message);
    return [];
  }
}

async function fetchWorkDetails(workKey) {
  const url = `https://openlibrary.org${workKey}.json`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching work ${workKey}:`, error.message);
    return null;
  }
}

function extractDescription(workData) {
  if (!workData || !workData.description) return 'No summary available.';
  return typeof workData.description === 'string' ? workData.description : workData.description.value;
}

function extractSubjects(workData) {
  if (!workData || !Array.isArray(workData.subjects)) return [];
  return workData.subjects.slice(0, 3);
}

function mapBook(doc, workData) {
  return {
    title: doc.title || 'Unknown Title',
    author: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
    genre: extractSubjects(workData),
    language: doc.language ? doc.language.join(', ') : 'English',
    year: doc.first_publish_year || 'Unknown',
    isbn: doc.isbn ? doc.isbn[0] : 'N/A',
    price: (Math.random() * 40 + 5).toFixed(2),
    rating: Math.floor(Math.random() * 5) + 1,
    description: extractDescription(workData),
    cover: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null
  };
}

(async function generateBooks() {
  let books = [];

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    console.log(`📖 Fetching search results (page ${page})...`);
    const docs = await fetchSearchResults(QUERY, page);

    for (const doc of docs) {
      if (!doc.key) continue;
      const workData = await fetchWorkDetails(doc.key);
      const book = mapBook(doc, workData);
      books.push(book);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(books, null, 2));
  console.log(`✅ Saved ${books.length} books to ${OUTPUT_FILE}`);
})();
