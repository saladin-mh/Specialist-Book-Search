import { smhLibraryStorageGet, smhLibraryStorageSet } from './modules/smh-library-storage.js';
import { smhLibraryShowToast } from './modules/smh-library-toast.js';

const key = 'smh-library-club-comments';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('smh-library-comment-form');
  const list = document.getElementById('smh-library-comments-list');

  form.onsubmit = (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const message = form.message.value.trim();
    if (!name || !message) return;

    const comment = { name, message, date: new Date().toISOString() };
    const comments = smhLibraryStorageGet(key, []);
    comments.unshift(comment);
    smhLibraryStorageSet(key, comments);
    form.reset();
    renderComments(comments);
    smhLibraryShowToast('Comment added!');
  };

  renderComments(smhLibraryStorageGet(key, []));
});

function renderComments(comments) {
  const list = document.getElementById('smh-library-comments-list');
  list.innerHTML = '';
  if (!comments.length) {
    list.innerHTML = '<p>No comments yet.</p>';
    return;
  }

  comments.forEach(c => {
    const div = document.createElement('div');
    div.className = 'smh-library-comment';
    div.innerHTML = `
      <p><strong>${c.name}</strong> <em>${new Date(c.date).toLocaleString()}</em></p>
      <p>${c.message}</p>
    `;
    list.appendChild(div);
  });
}
