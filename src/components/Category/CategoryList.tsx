import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchCategories, deleteCategory } from '../../redux/categoriesSlice';

const CategoryList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thể loại này?')) {
      await dispatch(deleteCategory(id));
    }
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
        <h2>Danh mục thể loại</h2>
        <Link to="/categories/add" className="btn btn-primary">
          Thêm thể loại mới
        </Link>
      </div>

      <div className="row">
        {categories.map((category) => (
          <div key={category.id} className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{category.name}</h5>
                <p className="card-text text-muted">{category.description}</p>
              </div>
              <div className="card-footer bg-transparent">
                <div className="btn-group btn-group-sm w-100">
                  <Link
                    to={`/categories/edit/${category.id}`}
                    className="btn btn-outline-primary"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="btn btn-outline-danger"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="alert alert-info text-center">
          Chưa có thể loại nào. Hãy thêm thể loại mới!
        </div>
      )}
    </div>
  );
};

export default CategoryList;
