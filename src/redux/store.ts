import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './booksSlice';
import usersReducer from './usersSlice';
import categoriesReducer from './categoriesSlice';
import transactionsReducer from './transactionsSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    users: usersReducer,
    categories: categoriesReducer,
    transactions: transactionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
