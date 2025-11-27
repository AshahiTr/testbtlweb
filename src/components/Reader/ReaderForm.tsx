import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addReader, updateReader, fetchReaders } from '../../redux/usersSlice';

const ReaderForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { readers } = useAppSelector((state) => state.users);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    borrowQuota: 5,
    currentBorrowed: 0,
    registeredDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    borrowQuota: '',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchReaders());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && readers.length > 0) {
      const reader = readers.find((r) => r.id === id);
      if (reader) {
        setFormData({
          name: reader.name,
          email: reader.email,
          phone: reader.phone,
          borrowQuota: reader.borrowQuota,
          currentBorrowed: reader.currentBorrowed,
          registeredDate: reader.registeredDate.split('T')[0],
        });
      }
    }
  }, [id, readers]);

  const validateForm = (): boolean => {
    const newErrors = { name: '', email: '', phone: '', borrowQuota: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Họ tên không được để trống';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
      isValid = false;
    }

    if (formData.borrowQuota < 1) {
      newErrors.borrowQuota = 'Quota phải lớn hơn 0';
      isValid = false;
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
      if (id) {
        await dispatch(updateReader({ id, ...formData }));
      } else {
        await dispatch(addReader(formData));
      }
      navigate('/readers');
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu bạn đọc');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'borrowQuota' ? parseInt(value) || 0 : value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>{id ? 'Sửa thông tin bạn đọc' : 'Thêm bạn đọc mới'}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Họ tên *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Số điện thoại *</label>
                  <input
                    type="tel"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Quota mượn sách *</label>
                  <input
                    type="number"
                    className={`form-control ${errors.borrowQuota ? 'is-invalid' : ''}`}
                    name="borrowQuota"
                    value={formData.borrowQuota}
                    onChange={handleChange}
                    min="1"
                    max="20"
                  />
                  {errors.borrowQuota && (
                    <div className="invalid-feedback">{errors.borrowQuota}</div>
                  )}
                  <small className="form-text text-muted">
                    Số sách tối đa bạn đọc có thể mượn cùng lúc
                  </small>
                </div>

                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary">
                    {id ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/readers')}
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

export default ReaderForm;
