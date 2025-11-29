const store = require('../store');

class BookRepository {
  /**
   * Find books that match the given keywords in title, author, or category.
   * @param {string} keywords - The search keywords.
   * @returns {Array} - List of matching books.
   */
  findBooksByKeywords(keywords) {
    if (!keywords) return [];
    
    const lowerKeywords = keywords.toLowerCase();
    return store.books.filter(b => 
      b.title.toLowerCase().includes(lowerKeywords) || 
      b.author.toLowerCase().includes(lowerKeywords) ||
      b.category.toLowerCase().includes(lowerKeywords)
    );
  }

  getAllBooks() {
    return store.books;
  }
}

module.exports = new BookRepository();
