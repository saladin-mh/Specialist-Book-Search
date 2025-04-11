import { smhLibraryLoadBooks, smhLibraryRenderBook } from './modules/smh-library-books.js';
import { smhLibraryFilterBooks } from './modules/smh-library-filter.js';
import { smhLibraryInitRatings } from './modules/smh-library-ratings.js';
import { smhLibraryInitContactForm } from './modules/smh-library-contact.js';
import { smhLibraryShowToast } from './modules/smh-library-toast.js';

let smhLibraryBookList = [];

document.addEventListener('DOMContentLoaded', async () => {
  // 🔄 Hamburger Menu Toggle Logic
  const toggle = document.getElementById('smh-library-toggle-menu');
  const navLinks = document.getElementById('smh-library-nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // 📘 Load books
  smhLibraryBookList = await smhLibraryLoadBooks();

  // 🔍 Filter form handler
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

      const results = smhLibraryFilterBooks(smhLibraryBookList, filters);
      const container = document.getElementById('smh-library-results-container');
      container.innerHTML = '';

      if (results.length === 0) {
        container.innerHTML = '<p>No matching books found.</p>';
        return;
      }

      results.forEach((book, i) => {
        const element = smhLibraryRenderBook(book, i === 0);
        container.appendChild(element);
      });

      smhLibraryInitRatings();
      smhLibraryShowToast(`${results.length} book(s) found.`);
    });
  }

  smhLibraryInitContactForm();
  smhLibraryInitRatings();
});
