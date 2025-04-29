// Import necessary modules for functionality
import { smhLibraryLoadBooks, smhLibraryRenderBook } from './modules/smh-library-books.js';
import { smhLibraryFilterBooks } from './modules/smh-library-filter.js';
import { smhLibraryInitRatings } from './modules/smh-library-ratings.js';
import { smhLibraryInitContactForm } from './modules/smh-library-contact.js';
import { smhLibraryShowToast } from './modules/smh-library-toast.js';

// Local variable to hold loaded book data
let smhLibraryBookList = [];

/**
 * Initialises the homepage by:
 * - Setting up the mobile navigation toggle
 * - Loading all books into memory
 * - Handling user search form submission
 * - Displaying search results with animation and ratings
 * - Initialising contact form handling
 */
document.addEventListener('DOMContentLoaded', async () => {

  // Responsive Navigation: toggles menu visibility on mobile
  const toggle = document.getElementById('smh-library-toggle-menu');
  const navLinks = document.getElementById('smh-library-nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // Load books from the external JSON source
  smhLibraryBookList = await smhLibraryLoadBooks();

  // Hook into the search filter form
  const form = document.getElementById('smh-library-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent default form submission behaviour

      // Construct filtering criteria based on user input
      const filters = {
        genre: form.genre.value,
        author: form.author.value.trim().toLowerCase(),
        language: form.language.value.trim().toLowerCase(),
        isbn: form.isbn.value.trim(),
        year: parseInt(form.year.value, 10) || null
      };

      // Apply filter logic to the loaded book list
      const results = smhLibraryFilterBooks(smhLibraryBookList, filters);
      console.log('Filter Criteria:', filters);
      console.log('Results Returned:', results);

      // Update the DOM container with filtered book results
      const container = document.getElementById('smh-library-results-container');
      container.innerHTML = '';

      if (results.length === 0) {
        container.innerHTML = '<p>No matching books found.</p>';
        return;
      }

      // Render each matching book
      results.forEach((book, index) => {
        const element = smhLibraryRenderBook(book, index === 0); // Highlight the best match (first book)
        element.classList.add('fade-in'); // Apply entry animation
        container.appendChild(element);
      });

      // Re-initialise dynamic ratings after DOM update
      smhLibraryInitRatings();

      // Show a toast notification to confirm search results
      smhLibraryShowToast(`${results.length} book(s) found.`);
    });
  }

  // Always initialise global modules
  smhLibraryInitContactForm();  // Handle contact form
  smhLibraryInitRatings();      // Prepare rating components
});
