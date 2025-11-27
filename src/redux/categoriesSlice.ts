import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as categoriesApi from '../api/categoriesApi';

export interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await categoriesApi.getCategories();
  return response;
});

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (category: Omit<Category, 'id'>) => {
    const response = await categoriesApi.createCategory(category);
    return response;
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (category: Category) => {
    const response = await categoriesApi.updateCategory(category);
    return response;
  }
);

export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (id: string) => {
  await categoriesApi.deleteCategory(id);
  return id;
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;
