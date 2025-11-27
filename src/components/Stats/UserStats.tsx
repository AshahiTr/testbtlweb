import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchStats } from '../../redux/transactionsSlice';

const UserStats: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector((state) => state.transactions);
  const { readers } = useAppSelector((state) => state.users);
  const { books } = useAppSelector((state) => state.books);
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly' | 'byReader'>('weekly');

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  const getReaderName = (readerId: string) => {
    const reader = readers.find((r) => r.id === readerId);
    return reader?.name || 'N/A';
  };

  const getBookTitle = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    return book?.title || 'N/A';
  };

  // Calculate weekly stats
  const getWeeklyStats = () => {
    const weeks: { [key: string]: { borrowed: number; returned: number } } = {};
    const now = new Date();
    
    for (let i = 0; i < 8; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      const weekKey = `Tuần ${weekStart.toLocaleDateString('vi-VN')}`;
      weeks[weekKey] = { borrowed: 0, returned: 0 };
    }

    transactions.forEach((t) => {
      const borrowDate = new Date(t.borrowDate);
      const weeksDiff = Math.floor((now.getTime() - borrowDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      
      if (weeksDiff < 8) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (weeksDiff * 7));
        const weekKey = `Tuần ${weekStart.toLocaleDateString('vi-VN')}`;
        if (weeks[weekKey]) {
          weeks[weekKey].borrowed++;
        }
      }

      if (t.returnDate) {
        const returnDate = new Date(t.returnDate);
        const weeksDiff = Math.floor((now.getTime() - returnDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
        
        if (weeksDiff < 8) {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - (weeksDiff * 7));
          const weekKey = `Tuần ${weekStart.toLocaleDateString('vi-VN')}`;
          if (weeks[weekKey]) {
            weeks[weekKey].returned++;
          }
        }
      }
    });

    return Object.entries(weeks).map(([week, data]) => ({
      period: week,
      ...data,
    }));
  };

  // Calculate monthly stats
  const getMonthlyStats = () => {
    const months: { [key: string]: { borrowed: number; returned: number } } = {};
    
    transactions.forEach((t) => {
      const borrowMonth = new Date(t.borrowDate).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'numeric',
      });
      
      if (!months[borrowMonth]) {
        months[borrowMonth] = { borrowed: 0, returned: 0 };
      }
      months[borrowMonth].borrowed++;

      if (t.returnDate) {
        const returnMonth = new Date(t.returnDate).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: 'numeric',
        });
        
        if (!months[returnMonth]) {
          months[returnMonth] = { borrowed: 0, returned: 0 };
        }
        months[returnMonth].returned++;
      }
    });

    return Object.entries(months)
      .map(([month, data]) => ({
        period: `Tháng ${month}`,
        ...data,
      }))
      .sort((a, b) => b.period.localeCompare(a.period))
      .slice(0, 12);
  };

  // Calculate stats by reader
  const getReaderStats = () => {
    const readerStats: { [key: string]: any } = {};

    transactions.forEach((t) => {
      if (!readerStats[t.readerId]) {
        readerStats[t.readerId] = {
          readerId: t.readerId,
          readerName: getReaderName(t.readerId),
          totalBorrowed: 0,
          totalReturned: 0,
          currentBorrowing: 0,
          overdue: 0,
        };
      }

      readerStats[t.readerId].totalBorrowed++;
      
      if (t.status === 'returned') {
        readerStats[t.readerId].totalReturned++;
      } else if (t.status === 'borrowed') {
        readerStats[t.readerId].currentBorrowing++;
      } else if (t.status === 'overdue') {
        readerStats[t.readerId].currentBorrowing++;
        readerStats[t.readerId].overdue++;
      }
    });

    return Object.values(readerStats).sort((a: any, b: any) => b.totalBorrowed - a.totalBorrowed);
  };

  // Top borrowed books
  const getTopBooks = () => {
    const bookCounts: { [key: string]: number } = {};
    
    transactions.forEach((t) => {
      bookCounts[t.bookId] = (bookCounts[t.bookId] || 0) + 1;
    });

    return Object.entries(bookCounts)
      .map(([bookId, count]) => ({
        bookId,
        title: getBookTitle(bookId),
        borrowCount: count,
      }))
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 10);
  };

  const weeklyStats = getWeeklyStats();
  const monthlyStats = getMonthlyStats();
  const readerStats = getReaderStats();
  const topBooks = getTopBooks();

  const activeReaders = readers.filter((r) => r.currentBorrowed > 0).length;
  const totalBorrowedEver = transactions.length;
  const averageBorrowsPerReader = readers.length > 0 ? totalBorrowedEver / readers.length : 0;

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Thống kê người dùng</h2>

      {/* Overview Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center bg-info text-white">
            <div className="card-body">
              <h6 className="card-title">Tổng bạn đọc</h6>
              <h2>{readers.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-success text-white">
            <div className="card-body">
              <h6 className="card-title">Đang mượn sách</h6>
              <h2>{activeReaders}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-primary text-white">
            <div className="card-body">
              <h6 className="card-title">Tổng lượt mượn</h6>
              <h2>{totalBorrowedEver}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-warning text-white">
            <div className="card-body">
              <h6 className="card-title">TB mượn/người</h6>
              <h2>{averageBorrowsPerReader.toFixed(1)}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <div className="btn-group">
            <button
              className={`btn ${viewMode === 'weekly' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setViewMode('weekly')}
            >
              Theo tuần
            </button>
            <button
              className={`btn ${viewMode === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setViewMode('monthly')}
            >
              Theo tháng
            </button>
            <button
              className={`btn ${viewMode === 'byReader' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setViewMode('byReader')}
            >
              Theo người dùng
            </button>
          </div>
        </div>
        <div className="card-body">
          {viewMode === 'weekly' && (
            <div className="table-responsive">
              <h5>Thống kê theo tuần</h5>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Tuần</th>
                    <th>Số lượt mượn</th>
                    <th>Số lượt trả</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyStats.map((stat, index) => (
                    <tr key={index}>
                      <td>{stat.period}</td>
                      <td><span className="badge bg-success">{stat.borrowed}</span></td>
                      <td><span className="badge bg-info">{stat.returned}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {viewMode === 'monthly' && (
            <div className="table-responsive">
              <h5>Thống kê theo tháng</h5>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Tháng</th>
                    <th>Số lượt mượn</th>
                    <th>Số lượt trả</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyStats.map((stat, index) => (
                    <tr key={index}>
                      <td>{stat.period}</td>
                      <td><span className="badge bg-success">{stat.borrowed}</span></td>
                      <td><span className="badge bg-info">{stat.returned}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {viewMode === 'byReader' && (
            <div className="table-responsive">
              <h5>Thống kê theo bạn đọc</h5>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Bạn đọc</th>
                    <th>Tổng lượt mượn</th>
                    <th>Đã trả</th>
                    <th>Đang mượn</th>
                    <th>Quá hạn</th>
                  </tr>
                </thead>
                <tbody>
                  {readerStats.map((stat: any) => (
                    <tr key={stat.readerId}>
                      <td><strong>{stat.readerName}</strong></td>
                      <td>{stat.totalBorrowed}</td>
                      <td><span className="badge bg-secondary">{stat.totalReturned}</span></td>
                      <td><span className="badge bg-success">{stat.currentBorrowing}</span></td>
                      <td>
                        {stat.overdue > 0 ? (
                          <span className="badge bg-danger">{stat.overdue}</span>
                        ) : (
                          <span className="badge bg-light text-dark">0</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Top Borrowed Books */}
      <div className="card">
        <div className="card-header">
          <h5>Top 10 sách được mượn nhiều nhất</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Hạng</th>
                  <th>Tên sách</th>
                  <th>Số lượt mượn</th>
                </tr>
              </thead>
              <tbody>
                {topBooks.map((book, index) => (
                  <tr key={book.bookId}>
                    <td>
                      <span className={`badge ${index < 3 ? 'bg-warning' : 'bg-secondary'}`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td>{book.title}</td>
                    <td>
                      <div className="progress" style={{ height: '25px', minWidth: '150px' }}>
                        <div
                          className="progress-bar bg-success"
                          style={{
                            width: `${(book.borrowCount / topBooks[0].borrowCount) * 100}%`,
                          }}
                        >
                          {book.borrowCount} lượt
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
    </div>
  );
};

export default UserStats;
