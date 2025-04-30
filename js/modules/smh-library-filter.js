/**
 * Filters a given list of books based on user-defined criteria.
 * Criteria include genre, author (partial, case-insensitive), language, ISBN, and year.
 * Filtered results are then sorted by rating in descending order to highlight the most popular books first.
 *
 * @param {Array} books - Complete array of available book objects
 * @param {Object} filters - Filter values supplied by the user interface
 * @returns {Array} A filtered and sorted list of matching books
 */
export function smhLibraryFilterBooks(books, filters) {
  return books

    // Apply sequential filter checks
    .filter(book => {
      // Match exact genre
      if (filters.genre && book.genre !== filters.genre) return false;

      // Allow partial match for author name (case-insensitive)
      if (filters.author && !book.author.toLowerCase().includes(filters.author.toLowerCase())) return false;

      // Match exact language (case-insensitive)
      if (filters.language && book.language.toLowerCase() !== filters.language.toLowerCase()) return false;

      // Allow partial ISBN match
      if (filters.isbn && !book.isbn.includes(filters.isbn)) return false;

      // Ensure exact match for year of publication
      if (filters.year && String(book.year) !== String(filters.year)) return false;

      return true;
    })

    // Sort by rating: most popular books appear first
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));
}
