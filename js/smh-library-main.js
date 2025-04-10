// SMH Library: Home Page Controller
import { smhLibraryLoadPartials } from './modules/smh-library-partials-loader.js';
import { smhLibraryLoadBooks, smhLibraryRenderBook } from './modules/smh-library-books.js';
import { smhLibraryFilterBooks } from './modules/smh-library-filter.js';
import { smhLibraryInitContactForm } from './modules/smh-library-contact.js';
import { smhLibraryInitRatings } from './modules/smh-library-ratings.js';
import { smhLibraryShowToast } from './modules/smh-library-toast.js';

let smhLibraryBookList = [];

// Init on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  await smhLibraryLoadPartials();

  // Load book data
  smhLibraryBookList = await smhLibraryLoadBooks();

  // Hook up filter form
  const form = document.getElementById('smh-library-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const filters = {
        genre: form.genre.value,
        author: form.author.value.trim().toLowerCase(),
        language: form.language.value.trim().toLowerCase(),
        isbn: form.isbn.value.trim(),
        year: parseInt(form.year.value) || null
      };

      const filtered = smhLibraryFilterBooks(smhLibraryBookList, filters);
      const container = document.getElementById('smh-library-results-container');
      container.innerHTML = '';

      if (filtered.length === 0) {
        container.innerHTML = '<p>No matching books found.</p>';
        return;
      }

      filtered.forEach((book, index) => {
        const element = smhLibraryRenderBook(book, index === 0);
        container.appendChild(element);
      });

      smhLibraryInitRatings();
      smhLibraryShowToast(`${filtered.length} result(s) found`);
    });
  }

  // Init forms and ratings
  smhLibraryInitContactForm();
  smhLibraryInitRatings();
});
