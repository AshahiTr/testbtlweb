import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import BookList from '../components/Book/BookList';
import BookForm from '../components/Book/BookForm';
import ReaderList from '../components/Reader/ReaderList';
import ReaderForm from '../components/Reader/ReaderForm';
import CategoryList from '../components/Category/CategoryList';
import CategoryForm from '../components/Category/CategoryForm';
import BorrowForm from '../components/Transaction/BorrowForm';
import ReturnForm from '../components/Transaction/ReturnForm';
import TransactionList from '../components/Transaction/TransactionList';
import InventoryStats from '../components/Stats/InventoryStats';
import UserStats from '../components/Stats/UserStats';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/books" replace />} />
          
          <Route path="books" element={<BookList />} />
          <Route path="books/add" element={<BookForm />} />
          <Route path="books/edit/:id" element={<BookForm />} />
          
          <Route path="readers" element={<ReaderList />} />
          <Route path="readers/add" element={<ReaderForm />} />
          <Route path="readers/edit/:id" element={<ReaderForm />} />
          
          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/add" element={<CategoryForm />} />
          <Route path="categories/edit/:id" element={<CategoryForm />} />
          
          <Route path="transactions" element={<TransactionList />} />
          <Route path="transactions/borrow" element={<BorrowForm />} />
          <Route path="transactions/return" element={<ReturnForm />} />
          
          <Route path="stats/inventory" element={<InventoryStats />} />
          <Route path="stats/users" element={<UserStats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
