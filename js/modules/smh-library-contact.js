// Import localStorage helpers and toast notification system
import { smhLibraryStorageGet, smhLibraryStorageSet } from './smh-library-storage.js';
import { smhLibraryShowToast } from './smh-library-toast.js';

/**
 * Initialises the contact form functionality.
 * Handles form submission with validation, accessibility support,
 * and localStorage-based archiving of contact messages.
 */
export function smhLibraryInitContactForm() {
  const form = document.getElementById('smh-library-contact-form');
  if (!form) return;

  // Accessibility enhancement: hidden live region for screen reader updates
  const ariaStatus = document.createElement('div');
  ariaStatus.setAttribute('aria-live', 'polite');
  ariaStatus.setAttribute('role', 'status');
  ariaStatus.style.position = 'absolute';
  ariaStatus.style.left = '-9999px';
  form.appendChild(ariaStatus);

  // Event listener to process and validate contact submission
  form.onsubmit = (e) => {
    e.preventDefault();

    // Extract and sanitise user inputs
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // Required fields check
    if (!name || !email || !message) {
      smhLibraryShowToast('Please complete all fields.');
      ariaStatus.textContent = 'Form submission failed. Required fields missing.';
      return;
    }

    // Email validation using standard regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      smhLibraryShowToast('Please enter a valid email address.');
      ariaStatus.textContent = 'Form submission failed. Invalid email address format.';
      return;
    }

    // Construct contact message object
    const msg = {
      name,
      email,
      message,
      date: new Date().toISOString()
    };

    // Retrieve, append, and persist contact messages in localStorage
    const savedMessages = smhLibraryStorageGet('smh-library-contact-messages', []);
    savedMessages.push(msg);
    smhLibraryStorageSet('smh-library-contact-messages', savedMessages);

    // Clear form and provide user feedback
    form.reset();
    smhLibraryShowToast('Message sent successfully!');
    ariaStatus.textContent = 'Your message has been successfully submitted.';
  };
}
