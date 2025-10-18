
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Changed from AuthContext to useAuth
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth(); // Changed from useContext(AuthContext) to useAuth()
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [logoutHovered, setLogoutHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

   const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getLinkStyle = (path) => {
    const baseClass = 'nav-link';
    if (isActive(path)) {
      return `${baseClass} active`;
    }
    return baseClass;
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">💰</span>
            <h2 className="logo-text">Expense Tracker</h2>
          </div>
        </div>

        {/* User Profile */}
        <div className="user-profile">
          <div className="user-avatar">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=8B5CF6&color=fff&size=80`} 
              alt="User Avatar" 
            />
          </div>
          <h3 className="user-name">{user?.name || 'User'}</h3>
          <p className="user-email">{user?.email || 'user@example.com'}</p>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <Link 
            to="/dashboard" 
            className={getLinkStyle('/dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </Link>

          <Link 
            to="/income" 
            className={getLinkStyle('/income')}
          >
            <span className="nav-icon">💰</span>
            <span className="nav-text">Income</span>
          </Link>

          <Link 
            to="/expense" 
            className={getLinkStyle('/expenses')}
          >
            <span className="nav-icon">💸</span>
            <span className="nav-text">Expenses</span>
          </Link>

          <button onClick={handleLogout} className="nav-link logout-link">
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </nav>

        {/* Welcome Message */}
        <div className="sidebar-footer">
          <p className="welcome-text">Welcome back!</p>
          <p className="welcome-subtitle">Ready to track your expenses?</p>
        </div>
      </aside>

       {/* Toggle Button */}
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        title={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
      >
        {isSidebarOpen ? '◀' : '▶'}
      </button>

      {/* Main Content */}
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
