// Import necessary modules
import { smhLibraryStorageGet } from './modules/smh-library-storage.js';
import { smhLibraryShowToast } from './modules/smh-library-toast.js';

/**
 * Main Initialisation:
 * Loads dashboard visualisations and message archives upon page load.
 */
document.addEventListener('DOMContentLoaded', () => {
  const wishlist = smhLibraryStorageGet('smh-library-wishlist', []);
  const messages = smhLibraryStorageGet('smh-library-contact-messages', []);

  renderGenreChart(wishlist);
  renderMessages(messages);
});

/**
 * Renders a bar chart summarising the number of books per genre in the wishlist.
 * Utilises Chart.js for dynamic and accessible visualisation.
 * 
 * @param {Array} wishlist - The array containing wishlist book entries.
 */
function renderGenreChart(wishlist) {
  const ctx = document.getElementById('smh-library-genre-chart');
  if (!ctx || !window.Chart) return;

  if (wishlist.length === 0) {
    smhLibraryShowToast('No data found in wishlist.');
    return;
  }

  // Generate a frequency count of books per genre
  const genreStats = wishlist.reduce((accumulator, book) => {
    accumulator[book.genre] = (accumulator[book.genre] || 0) + 1;
    return accumulator;
  }, {});

  // Create the bar chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(genreStats),
      datasets: [{
        label: 'Number of Books per Genre',
        data: Object.values(genreStats),
        backgroundColor: '#7e57c2' // Updated to fit purple-themed palette
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });
}

/**
 * Dynamically renders a list of archived contact messages.
 * Ensures each message is accessible via keyboard navigation.
 * 
 * @param {Array} messages - Array of submitted user messages.
 */
function renderMessages(messages) {
  const list = document.getElementById('smh-library-message-list');
  if (!list) return;

  list.innerHTML = '';

  if (!messages.length) {
    list.innerHTML = '<p>No messages available.</p>';
    return;
  }

  messages.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'book';
    div.setAttribute('role', 'article');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', `Message from ${msg.name}, email ${msg.email}`);

    div.innerHTML = `
      <p><strong>${msg.name}</strong> (${msg.email})</p>
      <p>${msg.message}</p>
    `;

    list.appendChild(div);
  });
}
