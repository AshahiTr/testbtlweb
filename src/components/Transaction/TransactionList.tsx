import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchTransactions,
  deleteTransaction,
  updateTransaction,
} from '../../redux/transactionsSlice';

const TransactionList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, loading } = useAppSelector((state) => state.transactions);
  const { readers } = useAppSelector((state) => state.users);
  const { books } = useAppSelector((state) => state.books);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDueDate, setEditDueDate] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const getReaderName = (readerId: string) => {
    const reader = readers.find((r) => r.id === readerId);
    return reader?.name || 'N/A';
  };

  const getBookTitle = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    return book?.title || 'N/A';
  };

  const handleDelete = async (id: string, status: string) => {
    if (status === 'borrowed' || status === 'overdue') {
      alert('Không thể xóa giao dịch khi sách chưa được trả!');
      return;
    }
    if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
      await dispatch(deleteTransaction(id));
    }
  };

  const handleEditClick = (transaction: any) => {
    if (transaction.status === 'returned') {
      alert('Không thể sửa giao dịch đã trả sách!');
      return;
    }
    setEditingId(transaction.id);
    setEditDueDate(transaction.dueDate.split('T')[0]);
  };

  const handleUpdateDueDate = async (transaction: any) => {
    if (!editDueDate) {
      alert('Vui lòng chọn ngày hạn trả');
      return;
    }

    const newDueDate = new Date(editDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newDueDate < today) {
      alert('Ngày hạn trả phải sau ngày hôm nay');
      return;
    }

    try {
      await dispatch(
        updateTransaction({
          ...transaction,
          dueDate: editDueDate,
        })
      );
      setEditingId(null);
      alert('Cập nhật thành công!');
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'borrowed':
        return <span className="badge bg-success">Đang mượn</span>;
      case 'returned':
        return <span className="badge bg-secondary">Đã trả</span>;
      case 'overdue':
        return <span className="badge bg-danger">Quá hạn</span>;
      default:
        return <span className="badge bg-warning">{status}</span>;
    }
  };

  const calculateOverdueDays = (dueDate: string, returnDate: string | null) => {
    const due = new Date(dueDate);
    const compareDate = returnDate ? new Date(returnDate) : new Date();
    const diffTime = compareDate.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime();
  });

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý mượn/trả sách</h2>
        <div className="btn-group">
          <Link to="/transactions/borrow" className="btn btn-success">
            Mượn sách
          </Link>
          <Link to="/transactions/return" className="btn btn-info text-white">
            Trả sách
          </Link>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="borrowed">Đang mượn</option>
            <option value="overdue">Quá hạn</option>
            <option value="returned">Đã trả</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Bạn đọc</th>
              <th>Sách</th>
              <th>Ngày mượn</th>
              <th>Ngày hạn trả</th>
              <th>Ngày trả</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => {
              const overdueDays = calculateOverdueDays(
                transaction.dueDate,
                transaction.returnDate
              );
              const isEditing = editingId === transaction.id;

              return (
                <tr key={transaction.id}>
                  <td>{getReaderName(transaction.readerId)}</td>
                  <td>{getBookTitle(transaction.bookId)}</td>
                  <td>{new Date(transaction.borrowDate).toLocaleDateString('vi-VN')}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                      />
                    ) : (
                      new Date(transaction.dueDate).toLocaleDateString('vi-VN')
                    )}
                  </td>
                  <td>
                    {transaction.returnDate
                      ? new Date(transaction.returnDate).toLocaleDateString('vi-VN')
                      : '-'}
                  </td>
                  <td>{getStatusBadge(transaction.status)}</td>
                  <td>
                    {overdueDays > 0 && (
                      <span className="text-danger small">
                        {transaction.returnDate
                          ? `Trả muộn ${overdueDays} ngày`
                          : `Quá hạn ${overdueDays} ngày`}
                      </span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="btn-group btn-group-sm">
                        <button
                          onClick={() => handleUpdateDueDate(transaction)}
                          className="btn btn-success"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn btn-secondary"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="btn-group btn-group-sm">
                        {transaction.status !== 'returned' && (
                          <button
                            onClick={() => handleEditClick(transaction)}
                            className="btn btn-outline-primary"
                          >
                            Sửa
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(transaction.id, transaction.status)}
                          className="btn btn-outline-danger"
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedTransactions.length === 0 && (
        <div className="alert alert-info text-center">
          Không có giao dịch nào phù hợp với bộ lọc.
        </div>
      )}

      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Tổng giao dịch</h5>
              <h2 className="text-primary">{transactions.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Đang mượn</h5>
              <h2 className="text-success">
                {transactions.filter((t) => t.status === 'borrowed').length}
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Quá hạn</h5>
              <h2 className="text-danger">
                {transactions.filter((t) => t.status === 'overdue').length}
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Đã trả</h5>
              <h2 className="text-secondary">
                {transactions.filter((t) => t.status === 'returned').length}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
