import { smhLibraryShowToast } from './smh-library-toast.js';
import { smhLibraryStorageGet, smhLibraryStorageSet } from './smh-library-storage.js';

const STORAGE_KEY = 'smh-library-contact-messages';

// SMH Library: Contact Form Handler
export function smhLibraryInitContactForm() {
  const form = document.getElementById('smh-library-contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      smhLibraryShowToast('Please fill in all fields.', 3000);
      return;
    }

    const contact = { name, email, message, date: new Date().toISOString() };
    const saved = smhLibraryStorageGet(STORAGE_KEY, []);
    saved.push(contact);
    smhLibraryStorageSet(STORAGE_KEY, saved);

    form.reset();
    smhLibraryShowToast('Message sent. Thank you!', 2500);
  });
}
