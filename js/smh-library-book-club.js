import { smhLibraryStorageGet, smhLibraryStorageSet } from './modules/smh-library-storage.js';
import { smhLibraryShowToast } from './modules/smh-library-toast.js';

const storageKey = 'smh-library-club-comments';

/**
 * Initializes the book club comment system.
 * Sets up form submission logic and loads previous comments from storage.
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('smh-library-comment-form');
  const list = document.getElementById('smh-library-comments-list');

  if (!form || !list) return;

  // Handle new comment submission
  form.onsubmit = (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const message = form.message.value.trim();

    if (!name || !message) {
      smhLibraryShowToast('Please fill in both name and comment.');
      return;
    }

    const comment = {
      name,
      message,
      date: new Date().toISOString()
    };

    const comments = smhLibraryStorageGet(storageKey, []);
    comments.unshift(comment); // Newest first
    smhLibraryStorageSet(storageKey, comments);
    form.reset();

    smhLibraryShowToast('Comment added!');
    renderComments(comments);
  };

  // Initial load
  const storedComments = smhLibraryStorageGet(storageKey, []);
  renderComments(storedComments);
});

/**
 * Renders the list of comments to the DOM.
 * @param {Array} comments - Array of comment objects to display.
 */
function renderComments(comments) {
  const list = document.getElementById('smh-library-comments-list');
  if (!list) return;

  list.innerHTML = ''; // Clear existing

  if (!comments.length) {
    list.innerHTML = '<p>No comments yet.</p>';
    return;
  }

  comments.forEach(c => {
    const div = document.createElement('div');
    div.className = 'smh-library-comment';
    div.setAttribute('tabindex', '0');
    div.setAttribute('role', 'article');
    div.setAttribute('aria-label', `Comment by ${c.name} on ${new Date(c.date).toLocaleDateString()}`);

    div.innerHTML = `
      <p><strong>${c.name}</strong> <em>${new Date(c.date).toLocaleString()}</em></p>
      <p>${c.message}</p>
    `;

    list.appendChild(div);
  });
}
