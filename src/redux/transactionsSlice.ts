import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as transactionsApi from '../api/transactionsApi';

export interface Transaction {
  id: string;
  readerId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'borrowed' | 'returned' | 'overdue';
}

export interface TransactionStats {
  weekly: { week: string; borrowed: number; returned: number }[];
  monthly: { month: string; borrowed: number; returned: number }[];
  byReader: { readerId: string; readerName: string; total: number }[];
}

interface TransactionsState {
  transactions: Transaction[];
  stats: TransactionStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  stats: null,
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk('transactions/fetchTransactions', async () => {
  const response = await transactionsApi.getTransactions();
  return response;
});

export const borrowBook = createAsyncThunk(
  'transactions/borrowBook',
  async (data: { readerId: string; bookId: string; dueDate: string }) => {
    const response = await transactionsApi.createBorrow(data);
    return response;
  }
);

export const returnBook = createAsyncThunk('transactions/returnBook', async (transactionId: string) => {
  const response = await transactionsApi.createReturn(transactionId);
  return response;
});

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async (transaction: Transaction) => {
    const response = await transactionsApi.updateTransaction(transaction);
    return response;
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id: string) => {
    await transactionsApi.deleteTransaction(id);
    return id;
  }
);

export const fetchStats = createAsyncThunk('transactions/fetchStats', async () => {
  const response = await transactionsApi.getStats();
  return response;
});

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      })
      .addCase(borrowBook.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
      .addCase(returnBook.fulfilled, (state, action) => {
        const index = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter((t) => t.id !== action.payload);
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default transactionsSlice.reducer;
