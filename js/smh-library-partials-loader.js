// SMH Library: Load reusable HTML partials into current page
export async function smhLibraryLoadPartials() {
  const includes = {
    '#smh-library-partial-header': 'partials/smh-library-nav.html',
    '#smh-library-partial-footer': 'partials/smh-library-footer.html',
    '#smh-library-partial-toast': 'partials/smh-library-toast.html'
  };

  for (const [selector, url] of Object.entries(includes)) {
    const target = document.querySelector(selector);
    if (target) {
      try {
        const response = await fetch(url);
        const html = await response.text();
        target.innerHTML = html;
      } catch (err) {
        console.error(`SMH Library: Failed to load partial ${url}`, err);
      }
    }
  }
}
