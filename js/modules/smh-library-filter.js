/**
 * SMH Library — Book Filtering Logic Module
 * This module is responsible for client-side filtering of books based on user-defined criteria.
 * All fields are optional and the search is case-insensitive where applicable.
 */

/**
 * Filters the provided book list based on form criteria.
 *
 * @param {Array} books - Complete list of book objects.
 * @param {Object} filters - Filter object: { genre, author, language, isbn, year }.
 * @returns {Array} Filtered array of books that match all filled-in criteria.
 */
export function smhLibraryFilterBooks(books, filters) {
  return books.filter(book => {
    const matchesGenre = !filters.genre || book.genre.toLowerCase().includes(filters.genre.toLowerCase());
    const matchesAuthor = !filters.author || book.author.toLowerCase().includes(filters.author.toLowerCase());
    const matchesLanguage = !filters.language || book.language.toLowerCase().includes(filters.language.toLowerCase());
    const matchesISBN = !filters.isbn || book.isbn.includes(filters.isbn);
    const matchesYear = !filters.year || parseInt(book.year) === filters.year;

    // All conditions must be satisfied to include this book
    return matchesGenre && matchesAuthor && matchesLanguage && matchesISBN && matchesYear;
  });
}
