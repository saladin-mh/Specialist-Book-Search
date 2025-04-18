import { smhLibraryStorageGet } from './modules/smh-library-storage.js';
import { smhLibraryShowToast } from './modules/smh-library-toast.js';

/**
 * Initializes the dashboard with genre stats and contact messages.
 */
document.addEventListener('DOMContentLoaded', () => {
  const wishlist = smhLibraryStorageGet('smh-library-wishlist', []);
  const messages = smhLibraryStorageGet('smh-library-contact-messages', []);

  renderGenreChart(wishlist);
  renderMessages(messages);
});

/**
 * Renders a bar chart showing number of wishlist books per genre.
 * @param {Array} wishlist - Array of wishlist books
 */
function renderGenreChart(wishlist) {
  const ctx = document.getElementById('smh-library-genre-chart');
  if (!ctx || !window.Chart) return;

  if (wishlist.length === 0) {
    smhLibraryShowToast('No data in wishlist.');
    return;
  }

  // Aggregate genre counts
  const genreStats = wishlist.reduce((acc, book) => {
    acc[book.genre] = (acc[book.genre] || 0) + 1;
    return acc;
  }, {});

  // Render chart with Chart.js
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(genreStats),
      datasets: [{
        label: 'Books per Genre',
        data: Object.values(genreStats),
        backgroundColor: '#89c9ff'
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
 * Renders contact messages in a scrollable list.
 * @param {Array} messages - Array of message objects
 */
function renderMessages(messages) {
  const list = document.getElementById('smh-library-message-list');
  if (!list) return;

  list.innerHTML = '';

  if (!messages.length) {
    list.innerHTML = '<p>No messages saved.</p>';
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
