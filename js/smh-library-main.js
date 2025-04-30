// Core imports for SMH Library functionality
import { smhLibraryLoadBooks, smhLibraryRenderBook } from './modules/smh-library-books.js';
import { smhLibraryFilterBooks } from './modules/smh-library-filter.js';
import { smhLibraryInitRatings } from './modules/smh-library-ratings.js';
import { smhLibraryInitContactForm } from './modules/smh-library-contact.js';
import { smhLibraryShowToast } from './modules/smh-library-toast.js';

let smhLibraryBookList = []; // Holds all loaded books in memory

/**
 * Sets up the mobile navigation toggle with ARIA accessibility
 */
function setupNavigation() {
  const toggle = document.getElementById('smh-library-toggle-menu');
  const navLinks = document.getElementById('smh-library-nav-links');
  if (toggle && navLinks) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', () => {
      const isVisible = navLinks.classList.toggle('show');
      toggle.setAttribute('aria-expanded', isVisible);
    });
  }
}

/**
 * Applies the search logic with input validation, debouncing, filtering and DOM rendering
 */
function setupSearchForm() {
  const form = document.getElementById('smh-library-form');
  const container = document.getElementById('smh-library-results-container');
  let debounceTimer;

  if (!form || !container) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      // Validate year
      const yearInput = form.year.value;
      const year = parseInt(yearInput, 10);
      if (yearInput && isNaN(year)) {
        smhLibraryShowToast('Please enter a valid year.');
        return;
      }

      const filters = {
        genre: form.genre.value.trim().toLowerCase(),
        author: form.author.value.trim().toLowerCase(),
        language: form.language.value.trim().toLowerCase(),
        isbn: form.isbn.value.trim(),
        year: year || null
      };

      const results = smhLibraryFilterBooks(smhLibraryBookList, filters);
      console.log('Filter:', filters);
      console.log('Results:', results);

      // Show loading indicator
      container.innerHTML = '<div class="loading-spinner"></div>';

      // Render book cards after filtering
      setTimeout(() => {
        container.innerHTML = '';
        if (results.length === 0) {
          container.innerHTML = '<p>No matching books found.</p>';
          return;
        }

        const fragment = document.createDocumentFragment();
        results.forEach((book, index) => {
          const card = smhLibraryRenderBook(book, index === 0); // Highlight first match
          const img = card.querySelector('img');
          if (img) img.loading = 'lazy'; // Lazy load images
          card.classList.add('fade-in');
          fragment.appendChild(card);
        });

        container.appendChild(fragment);
        smhLibraryInitRatings(); // Init rating stars per book
        smhLibraryShowToast(`${results.length} book(s) found.`);
      }, 400);
    }, 300); // Debounce threshold
  });
}

/**
 * Main entry point after DOM has fully loaded
 */
document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  setupSearchForm();
  smhLibraryInitContactForm();

  // Load book data with error handling
  try {
    smhLibraryBookList = await smhLibraryLoadBooks();
    console.log('Loaded books:', smhLibraryBookList);
  } catch (error) {
    console.error('Failed to load books:', error);
    smhLibraryShowToast('Error loading books. Please try again later.');
  }

  smhLibraryInitRatings(); // Fallback rating init
});
