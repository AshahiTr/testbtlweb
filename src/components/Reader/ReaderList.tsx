import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchReaders, deleteReader } from '../../redux/usersSlice';

const ReaderList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { readers, loading } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchReaders());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bạn đọc này?')) {
      await dispatch(deleteReader(id));
    }
  };

  const getQuotaStatus = (reader: typeof readers[0]) => {
    const percentage = (reader.currentBorrowed / reader.borrowQuota) * 100;
    if (percentage >= 100) return { color: 'danger', text: 'Đã đầy' };
    if (percentage >= 80) return { color: 'warning', text: 'Gần đầy' };
    return { color: 'success', text: 'Bình thường' };
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Danh sách bạn đọc</h2>
        <Link to="/readers/add" className="btn btn-primary">
          Thêm bạn đọc mới
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Quota mượn</th>
              <th>Đang mượn</th>
              <th>Trạng thái</th>
              <th>Ngày đăng ký</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {readers.map((reader) => {
              const status = getQuotaStatus(reader);
              return (
                <tr key={reader.id}>
                  <td>{reader.name}</td>
                  <td>{reader.email}</td>
                  <td>{reader.phone}</td>
                  <td>{reader.borrowQuota}</td>
                  <td>
                    <span className={`badge bg-${status.color}`}>
                      {reader.currentBorrowed}
                    </span>
                  </td>
                  <td>
                    <span className={`badge bg-${status.color}`}>
                      {status.text}
                    </span>
                  </td>
                  <td>{new Date(reader.registeredDate).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <Link
                        to={`/readers/edit/${reader.id}`}
                        className="btn btn-outline-primary"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(reader.id)}
                        className="btn btn-outline-danger"
                        disabled={reader.currentBorrowed > 0}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {readers.length === 0 && (
        <div className="alert alert-info text-center">
          Chưa có bạn đọc nào. Hãy thêm bạn đọc mới!
        </div>
      )}
    </div>
  );
};

export default ReaderList;
