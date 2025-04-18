import { smhLibraryStorageGet, smhLibraryStorageSet } from './modules/smh-library-storage.js';
import { smhLibraryShowToast } from './modules/smh-library-toast.js';

const commentsKey = 'smh-library-club-comments';
const userKey = 'smh-library-club-user';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('smh-library-comment-form');
  const loginForm = document.getElementById('smh-library-login-form');
  const profileSection = document.getElementById('smh-library-profile-section');
  const loginSection = document.getElementById('smh-library-login-section');
  const greeting = document.getElementById('smh-library-greeting');
  const logoutBtn = document.getElementById('smh-library-logout');

  const user = localStorage.getItem(userKey);

  // If user already logged in, display profile and enable comments
  if (user) {
    loginSection.style.display = 'none';
    profileSection.style.display = 'block';
    greeting.textContent = `Welcome back, ${user}!`;

    if (form) form.style.display = 'block';
  } else {
    profileSection.style.display = 'none';
    loginSection.style.display = 'block';

    if (form) form.style.display = 'none';
  }

  // Handle login form submission
  if (loginForm) {
    loginForm.onsubmit = (e) => {
      e.preventDefault();
      const name = loginForm.username.value.trim();
      if (!name) return;

      localStorage.setItem(userKey, name);
      smhLibraryShowToast(`Welcome, ${name}!`);
      location.reload(); // Refresh UI
    };
  }

  // Handle logout
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem(userKey);
      smhLibraryShowToast('You have been logged out.');
      location.reload();
    };
  }

  // Handle comment submission
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();

      const message = form.message.value.trim();
      if (!message) return;

      const user = localStorage.getItem(userKey);
      const newComment = {
        name: user,
        message,
        date: new Date().toISOString()
      };

      const comments = smhLibraryStorageGet(commentsKey, []);
      comments.unshift(newComment);
      smhLibraryStorageSet(commentsKey, comments);

      form.reset();
      smhLibraryShowToast('Your comment has been posted!');
      renderComments(comments);
    };

    // Load comments initially
    const storedComments = smhLibraryStorageGet(commentsKey, []);
    renderComments(storedComments);
  }
});

/**
 * Displays the comment history
 */
function renderComments(comments) {
  const list = document.getElementById('smh-library-comments-list');
  if (!list) return;

  list.innerHTML = '';

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
