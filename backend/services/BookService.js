const bookRepository = require('../repositories/BookRepository');

class BookService {
  /**
   * Search for books based on keywords.
   * @param {string} keywords 
   * @returns {Object} - SearchResult containing list of books.
   */
  searchBooks(keywords) {
    const books = bookRepository.findBooksByKeywords(keywords);
    return {
      books: books,
      count: books.length
    };
  }
}

module.exports = new BookService();
