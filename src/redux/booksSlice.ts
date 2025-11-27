import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as booksApi from '../api/booksApi';

export interface Book {
  id: string;
  code: string;
  title: string;
  author: string;
  categoryId: string;
  quantity: number;
  available: number;
  isHidden: boolean;
}

interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
  searchTerm: '',
};

export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
  const response = await booksApi.getBooks();
  return response;
});

export const addBook = createAsyncThunk('books/addBook', async (book: Omit<Book, 'id'>) => {
  const response = await booksApi.createBook(book);
  return response;
});

export const updateBook = createAsyncThunk('books/updateBook', async (book: Book) => {
  const response = await booksApi.updateBook(book);
  return response;
});

export const deleteBook = createAsyncThunk('books/deleteBook', async (id: string) => {
  await booksApi.deleteBook(id);
  return id;
});

export const toggleBookVisibility = createAsyncThunk(
  'books/toggleVisibility',
  async (id: string) => {
    const response = await booksApi.toggleVisibility(id);
    return response;
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    updateBookQuantity: (state, action: PayloadAction<{ id: string; delta: number }>) => {
      const book = state.books.find((b) => b.id === action.payload.id);
      if (book) {
        book.available += action.payload.delta;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch books';
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.books.push(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter((b) => b.id !== action.payload);
      })
      .addCase(toggleBookVisibility.fulfilled, (state, action) => {
        const index = state.books.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      });
  },
});

export const { setSearchTerm, updateBookQuantity } = booksSlice.actions;
export default booksSlice.reducer;
