import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { borrowBook } from '../../redux/transactionsSlice';
import { fetchBooks, updateBookQuantity } from '../../redux/booksSlice';
import { fetchReaders, updateReaderBorrowCount } from '../../redux/usersSlice';

const BorrowForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { books } = useAppSelector((state) => state.books);
  const { readers } = useAppSelector((state) => state.users);

  const [formData, setFormData] = useState({
    readerId: '',
    bookId: '',
    dueDate: '',
  });

  const [errors, setErrors] = useState({
    readerId: '',
    bookId: '',
    dueDate: '',
  });

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchReaders());
    
    // Set default due date to 14 days from now
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    setFormData((prev) => ({
      ...prev,
      dueDate: defaultDueDate.toISOString().split('T')[0],
    }));
  }, [dispatch]);

  const validateForm = (): boolean => {
    const newErrors = { readerId: '', bookId: '', dueDate: '' };
    let isValid = true;

    if (!formData.readerId) {
      newErrors.readerId = 'Vui lòng chọn bạn đọc';
      isValid = false;
    } else {
      const reader = readers.find((r) => r.id === formData.readerId);
      if (reader && reader.currentBorrowed >= reader.borrowQuota) {
        newErrors.readerId = 'Bạn đọc đã đạt quota mượn sách';
        isValid = false;
      }
    }

    if (!formData.bookId) {
      newErrors.bookId = 'Vui lòng chọn sách';
      isValid = false;
    } else {
      const book = books.find((b) => b.id === formData.bookId);
      if (book && book.available <= 0) {
        newErrors.bookId = 'Sách này hiện không còn trong kho';
        isValid = false;
      }
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Vui lòng chọn ngày hạn trả';
      isValid = false;
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        newErrors.dueDate = 'Ngày hạn trả phải sau ngày hôm nay';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(borrowBook(formData)).unwrap();
      dispatch(updateBookQuantity({ id: formData.bookId, delta: -1 }));
      dispatch(updateReaderBorrowCount({ id: formData.readerId, delta: 1 }));
      alert('Mượn sách thành công!');
      navigate('/transactions');
    } catch (error) {
      alert('Có lỗi xảy ra khi mượn sách');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const selectedReader = readers.find((r) => r.id === formData.readerId);
  const selectedBook = books.find((b) => b.id === formData.bookId);
  const availableBooks = books.filter((b) => b.available > 0 && !b.isHidden);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h3>Mượn sách</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Bạn đọc *</label>
                  <select
                    className={`form-select ${errors.readerId ? 'is-invalid' : ''}`}
                    name="readerId"
                    value={formData.readerId}
                    onChange={handleChange}
                  >
                    <option value="">Chọn bạn đọc</option>
                    {readers.map((reader) => (
                      <option key={reader.id} value={reader.id}>
                        {reader.name} - {reader.email} (Đang mượn: {reader.currentBorrowed}/
                        {reader.borrowQuota})
                      </option>
                    ))}
                  </select>
                  {errors.readerId && (
                    <div className="invalid-feedback">{errors.readerId}</div>
                  )}
                  {selectedReader && (
                    <div className="mt-2 p-2 bg-light rounded">
                      <small>
                        <strong>Thông tin:</strong> {selectedReader.name} - Quota:{' '}
                        {selectedReader.currentBorrowed}/{selectedReader.borrowQuota}
                      </small>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Sách *</label>
                  <select
                    className={`form-select ${errors.bookId ? 'is-invalid' : ''}`}
                    name="bookId"
                    value={formData.bookId}
                    onChange={handleChange}
                  >
                    <option value="">Chọn sách</option>
                    {availableBooks.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title} - {book.author} (Còn: {book.available})
                      </option>
                    ))}
                  </select>
                  {errors.bookId && <div className="invalid-feedback">{errors.bookId}</div>}
                  {selectedBook && (
                    <div className="mt-2 p-2 bg-light rounded">
                      <small>
                        <strong>Thông tin:</strong> {selectedBook.title} - Tác giả:{' '}
                        {selectedBook.author} - Còn lại: {selectedBook.available}/{selectedBook.quantity}
                      </small>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Ngày hạn trả *</label>
                  <input
                    type="date"
                    className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                  {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
                  <small className="form-text text-muted">
                    Thời gian mượn tiêu chuẩn là 14 ngày
                  </small>
                </div>

                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-success">
                    Xác nhận mượn
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/transactions')}
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

export default BorrowForm;
