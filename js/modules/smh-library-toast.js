// SMH Library: Filter book list based on criteria
export function smhLibraryFilterBooks(bookList, filters) {
  return bookList
    .filter(book => {
      if (filters.genre && book.genre !== filters.genre) return false;
      if (filters.author && !book.author.toLowerCase().includes(filters.author)) return false;
      if (filters.language && book.language.toLowerCase() !== filters.language) return false;
      if (filters.isbn && !book.isbn.includes(filters.isbn)) return false;
      if (filters.year && book.year !== filters.year) return false;
      return true;
    })
    .sort((a, b) => (b.rating || 0) - (a.rating || 0)); // Sort by rating descending
}
