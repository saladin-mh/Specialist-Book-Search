import { smhLibraryStorageGet, smhLibraryStorageSet } from './smh-library-storage.js';
import { smhLibraryShowToast } from './smh-library-toast.js';

export function smhLibraryInitContactForm() {
  const form = document.getElementById('smh-library-contact-form');
  if (!form) return;

  form.onsubmit = (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) return;

    const msg = { name, email, message, date: new Date().toISOString() };
    const saved = smhLibraryStorageGet('smh-library-contact-messages', []);
    saved.push(msg);
    smhLibraryStorageSet('smh-library-contact-messages', saved);
    form.reset();
    smhLibraryShowToast('Message sent!');
  };
}
