import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchBooks,
  deleteBook,
  toggleBookVisibility,
  setSearchTerm,
} from '../../redux/booksSlice';
import { fetchCategories } from '../../redux/categoriesSlice';

const BookList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { books, loading, searchTerm } = useAppSelector((state) => state.books);
  const { categories } = useAppSelector((state) => state.categories);
  const [showHidden, setShowHidden] = useState(false);

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
      await dispatch(deleteBook(id));
    }
  };

  const handleToggleVisibility = async (id: string) => {
    await dispatch(toggleBookVisibility(id));
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVisibility = showHidden || !book.isHidden;
    return matchesSearch && matchesVisibility;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'N/A';
  };

  if (loading) {
    return <div className="text-center"><div className="spinner-border" /></div>;
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 800,
          fontSize: '2rem',
          letterSpacing: '-0.5px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '0'
        }}>
          Danh sách sách
        </h2>


        <Link to="/books/add" className="btn btn-primary">
          Thêm sách mới
        </Link>
      </div>

      <div className="row mb-3">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />
        </div>
        <div className="col-md-4">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={showHidden}
              onChange={(e) => setShowHidden(e.target.checked)}
              id="showHidden"
            />
            <label className="form-check-label" htmlFor="showHidden">
              Hiển thị sách bị ẩn
            </label>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Mã sách</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Thể loại</th>
              <th>Tổng số</th>
              <th>Còn lại</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id} className={book.isHidden ? 'table-secondary' : ''}>
                <td>{book.code}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{getCategoryName(book.categoryId)}</td>
                <td>{book.quantity}</td>
                <td>
                  <span className={book.available === 0 ? 'text-danger fw-bold' : ''}>
                    {book.available}
                  </span>
                </td>
                <td>
                  <span className={`badge ${book.isHidden ? 'bg-secondary' : 'bg-success'}`}>
                    {book.isHidden ? 'Ẩn' : 'Hiển thị'}
                  </span>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <Link to={`/books/edit/${book.id}`} className="btn btn-outline-primary">
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleToggleVisibility(book.id)}
                      className="btn btn-outline-warning"
                    >
                      {book.isHidden ? 'Hiện' : 'Ẩn'}
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="btn btn-outline-danger"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBooks.length === 0 && (
        <div className="alert alert-info text-center">
          Không tìm thấy sách nào phù hợp.
        </div>
      )}
    </div>
  );
};

export default BookList;
