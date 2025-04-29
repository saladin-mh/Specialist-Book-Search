import { smhLibraryLoadBooks, smhLibraryRenderBook } from '../data/books.json';
import { smhLibraryFilterBooks } from './modules/smh-library-filter.js';
import { smhLibraryInitRatings } from './modules/smh-library-ratings.js';
import { smhLibraryInitContactForm } from './modules/smh-library-contact.js';
import { smhLibraryShowToast } from './modules/smh-library-toast.js';

let smhLibraryBookList = [];

/**
 * Initialises all interactive modules for the homepage.
 * - Loads book data
 * - Handles navigation toggle
 * - Filters books by user preferences
 * - Supports animations and dynamic ratings
 */
document.addEventListener('DOMContentLoaded', async () => {

  // Toggle mobile navigation menu
  const toggle = document.getElementById('smh-library-toggle-menu');
  const navLinks = document.getElementById('smh-library-nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // Load book dataset
  smhLibraryBookList = await smhLibraryLoadBooks();

  // Hook into search filter form
  const form = document.getElementById('smh-library-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Construct filter criteria from user input
      const filters = {
        genre: form.genre.value,
        author: form.author.value.trim().toLowerCase(),
        language: form.language.value.trim().toLowerCase(),
        isbn: form.isbn.value.trim(),
        year: parseInt(form.year.value) || null
      };

      // Perform book filtering based on criteria
      const results = smhLibraryFilterBooks(smhLibraryBookList, filters);
      console.log('Filter:', filters);
      console.log('Results:', results);

      // Update results display container
      const container = document.getElementById('smh-library-results-container');
      container.innerHTML = '';

      if (results.length === 0) {
        container.innerHTML = '<p>No matching books found.</p>';
        return;
      }

      // Render filtered books — highlight best match (first)
      results.forEach((book, index) => {
        const element = smhLibraryRenderBook(book, index === 0); // Highlight top book
        element.classList.add('fade-in'); // Entry animation
        container.appendChild(element);
      });

      // Initialise rating system dynamically
      smhLibraryInitRatings();

      // Toast notification feedback
      smhLibraryShowToast(`${results.length} book(s) found.`);
    });
  }

  // Initialise global modules
  smhLibraryInitContactForm();  // For contact section
  smhLibraryInitRatings();      // For default ratings
});
