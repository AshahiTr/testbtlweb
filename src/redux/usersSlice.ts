import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as usersApi from '../api/usersApi';

export interface Reader {
  id: string;
  name: string;
  email: string;
  phone: string;
  borrowQuota: number;
  currentBorrowed: number;
  registeredDate: string;
}

interface UsersState {
  readers: Reader[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  readers: [],
  loading: false,
  error: null,
};

export const fetchReaders = createAsyncThunk('users/fetchReaders', async () => {
  const response = await usersApi.getReaders();
  return response;
});

export const addReader = createAsyncThunk('users/addReader', async (reader: Omit<Reader, 'id'>) => {
  const response = await usersApi.createReader(reader);
  return response;
});

export const updateReader = createAsyncThunk('users/updateReader', async (reader: Reader) => {
  const response = await usersApi.updateReader(reader);
  return response;
});

export const deleteReader = createAsyncThunk('users/deleteReader', async (id: string) => {
  await usersApi.deleteReader(id);
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    updateReaderBorrowCount: (state, action) => {
      const reader = state.readers.find((r) => r.id === action.payload.id);
      if (reader) {
        reader.currentBorrowed += action.payload.delta;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReaders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReaders.fulfilled, (state, action) => {
        state.loading = false;
        state.readers = action.payload;
      })
      .addCase(fetchReaders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch readers';
      })
      .addCase(addReader.fulfilled, (state, action) => {
        state.readers.push(action.payload);
      })
      .addCase(updateReader.fulfilled, (state, action) => {
        const index = state.readers.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.readers[index] = action.payload;
        }
      })
      .addCase(deleteReader.fulfilled, (state, action) => {
        state.readers = state.readers.filter((r) => r.id !== action.payload);
      });
  },
});

export const { updateReaderBorrowCount } = usersSlice.actions;
export default usersSlice.reducer;
