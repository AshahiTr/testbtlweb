import { Category } from '../redux/categoriesSlice';
import { mockCategories, delay } from './mockData';

const CATEGORIES_KEY = 'library_categories';

const initCategories = () => {
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(mockCategories));
  }
};

const getStoredCategories = (): Category[] => {
  initCategories();
  const data = localStorage.getItem(CATEGORIES_KEY);
  return data ? JSON.parse(data) : [];
};

const saveCategories = (categories: Category[]) => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const getCategories = async (): Promise<Category[]> => {
  await delay(300);
  return getStoredCategories();
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  await delay(300);
  const categories = getStoredCategories();
  const newCategory: Category = {
    ...category,
    id: Date.now().toString(),
  };
  categories.push(newCategory);
  saveCategories(categories);
  return newCategory;
};

export const updateCategory = async (category: Category): Promise<Category> => {
  await delay(300);
  const categories = getStoredCategories();
  const index = categories.findIndex(c => c.id === category.id);
  if (index !== -1) {
    categories[index] = category;
    saveCategories(categories);
  }
  return category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await delay(300);
  const categories = getStoredCategories();
  const filtered = categories.filter(c => c.id !== id);
  saveCategories(filtered);
};
