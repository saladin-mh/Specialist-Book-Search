/**
 * SMH Library: Load reusable HTML partials into the current document.
 * 
 * This utility injects key components such as navigation, footer, and toast messages
 * into designated placeholder elements, maintaining layout consistency across all pages.
 *
 * Advantages:
 * - Reduces code repetition and promotes DRY principle.
 * - Ensures consistent updates across navigation and layout components.
 * - Uses asynchronous fetch with error resilience and developer feedback.
 */
export async function smhLibraryLoadPartials() {
  const includes = {
    '#smh-library-partial-header': 'partials/smh-library-nav.html',
    '#smh-library-partial-footer': 'partials/smh-library-footer.html',
    '#smh-library-partial-toast': 'partials/smh-library-toast.html'
  };

  for (const [selector, url] of Object.entries(includes)) {
    const target = document.querySelector(selector);

    // Proceed only if the target container is found
    if (target) {
      try {
        const response = await fetch(url);

        // Report failure to load partial to the developer
        if (!response.ok) {
          console.warn(`SMH Library: Could not load partial from ${url} – HTTP ${response.status}`);
          continue;
        }

        // Inject fetched HTML into the target container
        const html = await response.text();
        target.innerHTML = html;

      } catch (err) {
        // Handle network or permission-related fetch errors gracefully
        console.error(`SMH Library: Failed to load partial: ${url}`, err);
      }
    }
  }
}
