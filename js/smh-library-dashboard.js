import { smhLibraryStorageGet } from './modules/smh-library-storage.js';
import { smhLibraryShowToast } from './modules/smh-library-toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const wishlist = smhLibraryStorageGet('smh-library-wishlist', []);
  const messages = smhLibraryStorageGet('smh-library-contact-messages', []);

  renderGenreChart(wishlist);
  renderMessages(messages);
});

function renderGenreChart(wishlist) {
  const genreStats = wishlist.reduce((acc, book) => {
    acc[book.genre] = (acc[book.genre] || 0) + 1;
    return acc;
  }, {});

  const ctx = document.getElementById('smh-library-genre-chart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(genreStats),
      datasets: [{
        label: 'Books per Genre',
        data: Object.values(genreStats),
        backgroundColor: '#89c9ff'
      }]
    }
  });

  if (wishlist.length === 0) {
    smhLibraryShowToast('No data in wishlist.');
  }
}

function renderMessages(messages) {
  const list = document.getElementById('smh-library-message-list');
  if (!list) return;

  if (messages.length === 0) {
    list.innerHTML = '<p>No messages saved.</p>';
    return;
  }

  list.innerHTML = '';
  messages.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'book';
    div.innerHTML = `
      <p><strong>${msg.name}</strong> (${msg.email})</p>
      <p>${msg.message}</p>
    `;
    list.appendChild(div);
  });
}
