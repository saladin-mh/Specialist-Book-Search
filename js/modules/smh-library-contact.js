import { smhLibraryStorageGet, smhLibraryStorageSet } from './smh-library-storage.js';
import { smhLibraryShowToast } from './smh-library-toast.js';

/**
 * Initializes the contact form with validation and localStorage support.
 * Captures name, email, and message inputs and stores the data in localStorage.
 * Ensures that invalid or empty inputs are not processed.
 */
export function smhLibraryInitContactForm() {
  const form = document.getElementById('smh-library-contact-form');
  if (!form) return;

  // Accessibility: status output for screen readers
  const ariaStatus = document.createElement('div');
  ariaStatus.setAttribute('aria-live', 'polite');
  ariaStatus.setAttribute('role', 'status');
  ariaStatus.style.position = 'absolute';
  ariaStatus.style.left = '-9999px';
  form.appendChild(ariaStatus);

  // Event-driven form handler
  form.onsubmit = (e) => {
    e.preventDefault();

    // Extract and sanitize form data
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      smhLibraryShowToast('Please complete all fields.');
      ariaStatus.textContent = 'Form submission failed. Required fields missing.';
      return;
    }

    // Email format validation (regex-based)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      smhLibraryShowToast('Invalid email format.');
      ariaStatus.textContent = 'Form submission failed. Invalid email format.';
      return;
    }

    // Construct message object
    const msg = {
      name,
      email,
      message,
      date: new Date().toISOString()
    };

    // Retrieve, update, and persist message list
    const savedMessages = smhLibraryStorageGet('smh-library-contact-messages', []);
    savedMessages.push(msg);
    smhLibraryStorageSet('smh-library-contact-messages', savedMessages);

    // Feedback
    form.reset();
    smhLibraryShowToast('Message sent successfully!');
    ariaStatus.textContent = 'Your message has been sent.';
  };
}
