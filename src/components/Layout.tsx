import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import ResetDataButton from './ResetDataButton';
import BackgroundEffects from './BackgroundEffects';

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative'
    }}>
      <BackgroundEffects />
      <nav className="navbar navbar-expand-lg navbar-dark" style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        borderBottom: '2px solid rgba(255, 255, 255, 0.18)',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="container-fluid px-4">
          <Link className="navbar-brand fw-bold" to="/" style={{ 
            fontSize: '1.6rem', 
            letterSpacing: '1px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            <span style={{ 
              display: 'inline-block',
              animation: 'bounce 2s infinite'
            }}>📚</span> Quản lý Thư viện
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname.includes('/books') ? 'active' : ''}`}
                  to="/books"
                  style={{ 
                    fontWeight: 600, 
                    padding: '0.6rem 1.2rem',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📖 Sách
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname.includes('/categories') ? 'active' : ''}`}
                  to="/categories"
                  style={{ 
                    fontWeight: 600, 
                    padding: '0.6rem 1.2rem',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🏷️ Thể loại
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname.includes('/readers') ? 'active' : ''}`}
                  to="/readers"
                  style={{ 
                    fontWeight: 600, 
                    padding: '0.6rem 1.2rem',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  👥 Bạn đọc
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname.includes('/transactions') ? 'active' : ''}`}
                  to="/transactions"
                  style={{ 
                    fontWeight: 600, 
                    padding: '0.6rem 1.2rem',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🔄 Mượn/Trả
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className={`nav-link dropdown-toggle ${location.pathname.includes('/stats') ? 'active' : ''}`}
                  href="#"
                  id="statsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  style={{ 
                    fontWeight: 600, 
                    padding: '0.6rem 1.2rem',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📊 Thống kê
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/stats/inventory">
                      📦 Kho sách
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/stats/users">
                      👤 Người dùng
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
            <ResetDataButton />
          </div>
        </div>
      </nav>
      <main className="container-fluid py-4" style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .navbar .nav-link:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        .navbar .nav-link.active {
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Layout;
