import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addBook, updateBook, fetchBooks } from '../../redux/booksSlice';
import { fetchCategories } from '../../redux/categoriesSlice';

const BookForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { books } = useAppSelector((state) => state.books);
  const { categories } = useAppSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    author: '',
    categoryId: '',
    quantity: 0,
    available: 0,
    isHidden: false,
  });

  useEffect(() => {
    dispatch(fetchCategories());
    if (id) {
      dispatch(fetchBooks());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && books.length > 0) {
      const book = books.find((b) => b.id === id);
      if (book) {
        setFormData({
          code: book.code,
          title: book.title,
          author: book.author,
          categoryId: book.categoryId,
          quantity: book.quantity,
          available: book.available,
          isHidden: book.isHidden,
        });
      }
    }
  }, [id, books]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await dispatch(updateBook({ id, ...formData }));
      } else {
        await dispatch(addBook({ ...formData, available: formData.quantity }));
      }
      navigate('/books');
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu sách');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>{id ? 'Sửa thông tin sách' : 'Thêm sách mới'}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Mã sách</label>
                  <input
                    type="text"
                    className="form-control"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tên sách</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tác giả</label>
                  <input
                    type="text"
                    className="form-control"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Thể loại</label>
                  <select
                    className="form-select"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn thể loại</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Số lượng</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary">
                    {id ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/books')}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
