import { Book } from '../redux/booksSlice';
import { mockBooks, delay } from './mockData';

const BOOKS_KEY = 'library_books';

const initBooks = () => {
  if (!localStorage.getItem(BOOKS_KEY)) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(mockBooks));
  }
};

const getStoredBooks = (): Book[] => {
  initBooks();
  const data = localStorage.getItem(BOOKS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveBooks = (books: Book[]) => {
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
};

export const getBooks = async (): Promise<Book[]> => {
  await delay(300);
  return getStoredBooks();
};

export const createBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
  await delay(300);
  const books = getStoredBooks();
  const newBook: Book = {
    ...book,
    id: Date.now().toString(),
  };
  books.push(newBook);
  saveBooks(books);
  return newBook;
};

export const updateBook = async (book: Book): Promise<Book> => {
  await delay(300);
  const books = getStoredBooks();
  const index = books.findIndex(b => b.id === book.id);
  if (index !== -1) {
    books[index] = book;
    saveBooks(books);
  }
  return book;
};

export const deleteBook = async (id: string): Promise<void> => {
  await delay(300);
  const books = getStoredBooks();
  const filtered = books.filter(b => b.id !== id);
  saveBooks(filtered);
};

export const toggleVisibility = async (id: string): Promise<Book> => {
  await delay(300);
  const books = getStoredBooks();
  const book = books.find(b => b.id === id);
  if (book) {
    book.isHidden = !book.isHidden;
    saveBooks(books);
    return book;
  }
  throw new Error('Book not found');
};
