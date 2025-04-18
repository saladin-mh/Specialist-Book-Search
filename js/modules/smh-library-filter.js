/**
 * Filters a list of books based on user-selected criteria.
 * Supports genre, author (partial), language, ISBN, and year.
 * Results are automatically sorted by highest rating (descending).
 * 
 * @param {Array} books - List of all book objects
 * @param {Object} filters - Object with filter criteria
 * @returns {Array} Filtered and sorted list of books
 */
export function smhLibraryFilterBooks(books, filters) {
  return books
    .filter(b => {
      // Genre (exact match)
      if (filters.genre && b.genre !== filters.genre) return false;

      // Author (partial match, case-insensitive)
      if (filters.author && !b.author.toLowerCase().includes(filters.author.toLowerCase())) return false;

      // Language (exact, case-insensitive)
      if (filters.language && b.language.toLowerCase() !== filters.language.toLowerCase()) return false;

      // ISBN (partial match)
      if (filters.isbn && !b.isbn.includes(filters.isbn)) return false;

      // Year (exact match, support number vs string)
      if (filters.year && String(b.year) !== String(filters.year)) return false;

      return true;
    })

    // Sort results by descending rating
    // Default to 0 rating if undefined
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));
}
