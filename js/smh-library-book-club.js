/**
 * SMH Library — Book Club Registration Module
 * Handles basic registration logic with localStorage for mock user experience.
 * Not secure for production — used only for demonstration and client-side learning.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('smh-library-login-form');

  // Simulate user login form
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = form.username.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value; // Note: Never store plaintext passwords in real apps

      if (!username || !email || !password) {
        alert('Please fill in all fields.');
        return;
      }

      // Store mock user data (unsafe — demo only)
      const user = { username, email };
      localStorage.setItem('smh-library-user', JSON.stringify(user));

      // Simple feedback
      form.innerHTML = `
        <p class="fade-in"><strong>Welcome, ${username}!</strong> Your profile has been created.</p>
        <p class="fade-in">You are now a member of the SMH Book Club. 📚</p>
      `;
    });
  }

  // Auto-fill or acknowledge existing user
  const existingUser = JSON.parse(localStorage.getItem('smh-library-user'));
  if (existingUser && form) {
    form.innerHTML = `
      <p class="fade-in"><strong>Welcome back, ${existingUser.username}!</strong></p>
      <p class="fade-in">You're already a member of the Book Club.</p>
    `;
  }
});
