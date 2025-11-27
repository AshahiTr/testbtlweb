import React from 'react';
import { useAppDispatch } from '../redux/hooks';
import { fetchBooks } from '../redux/booksSlice';
import { fetchCategories } from '../redux/categoriesSlice';
import { fetchReaders } from '../redux/usersSlice';
import { fetchTransactions } from '../redux/transactionsSlice';

const ResetDataButton: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn reset tất cả dữ liệu về mặc định?')) {
      localStorage.removeItem('library_books');
      localStorage.removeItem('library_categories');
      localStorage.removeItem('library_readers');
      localStorage.removeItem('library_transactions');
      
      dispatch(fetchBooks());
      dispatch(fetchCategories());
      dispatch(fetchReaders());
      dispatch(fetchTransactions());
      
      alert('Đã reset dữ liệu thành công!');
      window.location.reload();
    }
  };

  return (
    <button 
      onClick={handleReset} 
      className="btn btn-warning"
      style={{
        fontWeight: 600,
        borderRadius: '12px',
        padding: '0.5rem 1.5rem'
      }}
    >
      🔄 Reset Data
    </button>
  );
};

export default ResetDataButton;
