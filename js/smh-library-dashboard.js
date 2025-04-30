/**
 * SMH Library — Dashboard Visualisation Script
 * Displays analytics based on stored user data (favourites).
 */

import { smhLibraryStorageGet } from './modules/smh-library-storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const favourites = smhLibraryStorageGet('smh-library-favourites', []);

  // Total count
  const totalCountElement = document.getElementById('total-books-count');
  if (totalCountElement) {
    totalCountElement.textContent = favourites.length.toString();
  }

  // Genre distribution chart (Pie)
  const genreCounts = {};
  favourites.forEach(book => {
    const genre = book.genre || 'Other';
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
  });

  const genreCtx = document.getElementById('genreChart').getContext('2d');
  new Chart(genreCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(genreCounts),
      datasets: [{
        label: 'Genres',
        data: Object.values(genreCounts),
        backgroundColor: [
          '#6a0dad', '#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#e74c3c'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });

  // Activity chart (Dummy Data - Bar)
  const readingCtx = document.getElementById('readingChart').getContext('2d');
  new Chart(readingCtx, {
    type: 'bar',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Books Added to Favourites',
        data: [3, 6, 2, 4], // Replace with real data if tracking over time
        backgroundColor: '#6a0dad'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});
