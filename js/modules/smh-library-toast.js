/**
 * Displays a non-intrusive toast message overlay on the user's interface.
 *
 * Key Features:
 * - Automatically disappears after a defined delay.
 * - Accessible to screen readers using ARIA live region.
 * - Includes fade-in CSS animation support.
 * - Prevents stacking by cancelling previous timeouts.
 *
 * @param {string} message - The text to be displayed in the toast.
 * @param {number} duration - Visibility time in milliseconds (default: 3000 ms).
 */
export function smhLibraryShowToast(message = '', duration = 3000) {
  const toast = document.getElementById('smh-library-toast');
  if (!toast) return;

  // Set ARIA live announcement role for accessibility tools
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');

  // Apply the message text and display state
  toast.textContent = message;
  toast.classList.add('show', 'fade-in');

  // Cancel any existing hide timer to prevent overlap
  clearTimeout(toast._hideTimer);

  // Set automatic fade-out timer
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}
