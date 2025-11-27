import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addCategory, updateCategory, fetchCategories } from '../../redux/categoriesSlice';

const CategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchCategories());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && categories.length > 0) {
      const category = categories.find((c) => c.id === id);
      if (category) {
        setFormData({
          name: category.name,
          description: category.description,
        });
      }
    }
  }, [id, categories]);

  const validateForm = (): boolean => {
    const newErrors = { name: '', description: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Tên thể loại không được để trống';
      isValid = false;
    }

    if (formData.name.length < 2) {
      newErrors.name = 'Tên thể loại phải có ít nhất 2 ký tự';
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
        await dispatch(updateCategory({ id, ...formData }));
      } else {
        await dispatch(addCategory(formData));
      }
      navigate('/categories');
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu thể loại');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>{id ? 'Sửa thể loại' : 'Thêm thể loại mới'}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Tên thể loại *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ví dụ: Văn học, Khoa học, Lịch sử..."
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Mô tả về thể loại sách này..."
                  />
                </div>

                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary">
                    {id ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/categories')}
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

export default CategoryForm;
