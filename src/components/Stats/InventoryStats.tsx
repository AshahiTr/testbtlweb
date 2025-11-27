import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';

const InventoryStats: React.FC = () => {
  const { books } = useAppSelector((state) => state.books);
  const { categories } = useAppSelector((state) => state.categories);
  const [sortBy, setSortBy] = useState<'title' | 'available' | 'borrowed'>('title');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'N/A';
  };

  const getBookStats = () => {
    return books.map((book) => ({
      ...book,
      borrowed: book.quantity - book.available,
      borrowRate: book.quantity > 0 ? ((book.quantity - book.available) / book.quantity) * 100 : 0,
    }));
  };

  const filteredBooks = getBookStats().filter((book) => {
    if (filterCategory === 'all') return true;
    return book.categoryId === filterCategory;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'available':
        return b.available - a.available;
      case 'borrowed':
        return b.borrowed - a.borrowed;
      default:
        return 0;
    }
  });

  const totalBooks = books.reduce((sum, book) => sum + book.quantity, 0);
  const totalAvailable = books.reduce((sum, book) => sum + book.available, 0);
  const totalBorrowed = totalBooks - totalAvailable;
  const overallBorrowRate = totalBooks > 0 ? (totalBorrowed / totalBooks) * 100 : 0;

  const lowStockBooks = books.filter((book) => book.available <= 2 && book.available > 0);
  const outOfStockBooks = books.filter((book) => book.available === 0);

  const categoryStats = categories.map((category) => {
    const categoryBooks = books.filter((b) => b.categoryId === category.id);
    const total = categoryBooks.reduce((sum, book) => sum + book.quantity, 0);
    const available = categoryBooks.reduce((sum, book) => sum + book.available, 0);
    const borrowed = total - available;
    return {
      ...category,
      totalBooks: categoryBooks.length,
      totalQuantity: total,
      available,
      borrowed,
    };
  });

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Thống kê kho sách</h2>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center bg-primary text-white">
            <div className="card-body">
              <h6 className="card-title">Tổng số sách</h6>
              <h2>{totalBooks}</h2>
              <small>{books.length} đầu sách</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-success text-white">
            <div className="card-body">
              <h6 className="card-title">Còn lại trong kho</h6>
              <h2>{totalAvailable}</h2>
              <small>{((totalAvailable / totalBooks) * 100).toFixed(1)}% tổng số</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-warning text-white">
            <div className="card-body">
              <h6 className="card-title">Đang được mượn</h6>
              <h2>{totalBorrowed}</h2>
              <small>{overallBorrowRate.toFixed(1)}% tổng số</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-danger text-white">
            <div className="card-body">
              <h6 className="card-title">Hết hàng</h6>
              <h2>{outOfStockBooks.length}</h2>
              <small>Cần nhập thêm</small>
            </div>
          </div>
        </div>
      </div>

      {lowStockBooks.length > 0 && (
        <div className="alert alert-warning">
          <h5>⚠️ Cảnh báo: {lowStockBooks.length} đầu sách sắp hết</h5>
          <ul className="mb-0">
            {lowStockBooks.map((book) => (
              <li key={book.id}>
                {book.title} - Còn {book.available} cuốn
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header">
          <h4>Thống kê theo thể loại</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Thể loại</th>
                  <th>Số đầu sách</th>
                  <th>Tổng số lượng</th>
                  <th>Còn lại</th>
                  <th>Đang mượn</th>
                  <th>Tỷ lệ mượn</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.map((stat) => (
                  <tr key={stat.id}>
                    <td><strong>{stat.name}</strong></td>
                    <td>{stat.totalBooks}</td>
                    <td>{stat.totalQuantity}</td>
                    <td>{stat.available}</td>
                    <td>{stat.borrowed}</td>
                    <td>
                      <div className="progress" style={{ height: '20px' }}>
                        <div
                          className="progress-bar"
                          style={{
                            width: `${
                              stat.totalQuantity > 0
                                ? (stat.borrowed / stat.totalQuantity) * 100
                                : 0
                            }%`,
                          }}
                        >
                          {stat.totalQuantity > 0
                            ? `${((stat.borrowed / stat.totalQuantity) * 100).toFixed(0)}%`
                            : '0%'}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4>Chi tiết tồn kho</h4>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Sắp xếp theo:</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="title">Tên sách (A-Z)</option>
                <option value="available">Số lượng còn lại</option>
                <option value="borrowed">Số lượng đang mượn</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Lọc theo thể loại:</label>
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">Tất cả thể loại</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
                  <th>Đang mượn</th>
                  <th>Tỷ lệ mượn</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {sortedBooks.map((book) => (
                  <tr key={book.id}>
                    <td>{book.code}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{getCategoryName(book.categoryId)}</td>
                    <td>{book.quantity}</td>
                    <td>
                      <span
                        className={`badge ${
                          book.available === 0
                            ? 'bg-danger'
                            : book.available <= 2
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                      >
                        {book.available}
                      </span>
                    </td>
                    <td>{book.borrowed}</td>
                    <td>
                      <div className="progress" style={{ height: '20px', minWidth: '80px' }}>
                        <div
                          className={`progress-bar ${
                            book.borrowRate >= 80 ? 'bg-danger' : 'bg-primary'
                          }`}
                          style={{ width: `${book.borrowRate}%` }}
                        >
                          {book.borrowRate.toFixed(0)}%
                        </div>
                      </div>
                    </td>
                    <td>
                      {book.available === 0 ? (
                        <span className="badge bg-danger">Hết hàng</span>
                      ) : book.available <= 2 ? (
                        <span className="badge bg-warning">Sắp hết</span>
                      ) : (
                        <span className="badge bg-success">Còn hàng</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryStats;
