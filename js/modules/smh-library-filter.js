export function smhLibraryFilterBooks(books, filters) {
  return books
    .filter(b => {
      if (filters.genre && b.genre !== filters.genre) return false;
      if (filters.author && !b.author.toLowerCase().includes(filters.author)) return false;
      if (filters.language && b.language.toLowerCase() !== filters.language) return false;
      if (filters.isbn && !b.isbn.includes(filters.isbn)) return false;
      if (filters.year && b.year !== filters.year) return false;
      return true;
    })
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));
}
