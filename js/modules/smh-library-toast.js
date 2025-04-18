/**
 * Displays a toast notification on the screen.
 *
 * - Automatically hides after a delay
 * - Works with ARIA live region for screen readers
 * - Includes fade animation support
 * - Prevents stacking or overlap by clearing existing timeouts
 *
 * @param {string} message - The message to show
 * @param {number} duration - How long to show the toast (ms)
 */
export function smhLibraryShowToast(message = '', duration = 3000) {
  const toast = document.getElementById('smh-library-toast');
  if (!toast) return;

  // Accessibility: Update ARIA content
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');

  toast.textContent = message;
  toast.classList.add('show', 'fade-in');

  // Clear previous hide timeout if still pending
  clearTimeout(toast._hideTimer);

  // Hide after specified duration
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}
