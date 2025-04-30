/**
 * SMH Library — Contact Form Script
 * Handles user input, validation, and interactive feedback for the contact form
 * Fully client-side; suitable for simulation and academic projects
 */


// Existing code in smh-library-contact.js
export function smhLibraryInitContactForm() {
  // Implementation of the function
  console.log('Contact form initialized');
}
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('smh-library-contact-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve values from form fields
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      // Simple client-side validation
      if (!name || !email || !message) {
        alert('Please complete all fields before submitting.');
        return;
      }

      // Display a basic feedback message
      const feedback = document.createElement('div');
      feedback.setAttribute('role', 'status');
      feedback.setAttribute('aria-live', 'polite');
      feedback.className = 'fade-in';
      feedback.innerHTML = `
        <p>Thank you, <strong>${name}</strong>. Your message has been received.</p>
        <p>We’ll be in touch via <strong>${email}</strong> as soon as possible.</p>
      `;

      // Replace the form content with the feedback message
      form.replaceWith(feedback);
    });
  }
});
