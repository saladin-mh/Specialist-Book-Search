import { smhLibraryStorageGet, smhLibraryStorageSet } from './modules/smh-library-storage.js';
import { smhLibraryRenderBook } from './modules/smh-library-books.js';
import { smhLibraryInitRatings } from './modules/smh-library-ratings.js';

const favouritesKey = 'smh-library-favourites';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('smh-library-results-container');
  const favourites = smhLibraryStorageGet(favouritesKey, []);

  if (favourites.length === 0) {
    container.innerHTML = '<p>You have no favourite books yet.</p>';
    return;
  }

  // Render each favourite book
  favourites.forEach(book => {
    const card = smhLibraryRenderBook(book, false, { allowRemoveFavorite: true });
    container.appendChild(card);
  });

  // Init star ratings
  smhLibraryInitRatings();

  // Export favourites to .txt file
  document.getElementById('smh-library-export-favourites')?.addEventListener('click', () => {
    const content = favourites.map(b => `${b.title} by ${b.author}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'favourites.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Copy favourites to clipboard
  document.getElementById('smh-library-share-favourites')?.addEventListener('click', () => {
    const content = favourites.map(b => `${b.title} by ${b.author}`).join('\n');
    navigator.clipboard.writeText(content).then(() => {
      alert('Favourites copied to clipboard!');
    }).catch(err => {
      alert('Failed to copy favourites.');
      console.error(err);
    });
  });
});
