// frontend/src/components/Navbar.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // Fixed
import { Bell, LogOut, User, Menu, X } from 'lucide-react';
import api from '../api/api'; // Fixed
import { Toaster, toast } from 'sonner';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Fixed
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread/count');
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/dashboard'; // All use /dashboard
      case 'mentor':
        return '/dashboard';
      case 'student':
        return '/dashboard';
      default:
        return '/';
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to={user ? getDashboardRoute() : '/'} className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">IB</span>
                </div>
                <span className="text-xl font-semibold tracking-tight">Idea Bank</span>
              </Link>
            </div>

            {user && (
              <>
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                  <Link
                    to={getDashboardRoute()}
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                    data-testid="nav-dashboard-link"
                  >
                    Dashboard
                  </Link>
                  {user.role === 'student' && (
                    <Link
                      to="/student/submit"
                      className="text-gray-700 hover:text-gray-900 transition-colors"
                      data-testid="nav-submit-idea-link"
                    >
                      Submit Idea
                    </Link>
                  )}
                  <Link
                    to="/leaderboard"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                    data-testid="nav-leaderboard-link"
                  >
                    Leaderboard
                  </Link>

                  <Link
                    to="/notifications"
                    className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
                    data-testid="nav-notifications-link"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span
                        className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
                        data-testid="notification-badge"
                      >
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                    <div className="flex items-center space-x-2">
                      <User size={18} className="text-gray-600" />
                      <span className="text-sm text-gray-700" data-testid="nav-user-name">
                        {user.name}
                      </span>
                      <span
                        className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded"
                        data-testid="nav-user-role"
                      >
                        {user.role}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-700 hover:text-red-600 transition-colors"
                      data-testid="nav-logout-button"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 text-gray-700"
                    data-testid="mobile-menu-button"
                  >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-3">
              <Link
                to={getDashboardRoute()}
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
              {user.role === 'student' && (
                <Link
                  to="/student/submit"
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 hover:text-gray-900"
                >
                  Submit Idea
                </Link>
              )}
              <Link
                to="/leaderboard"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-gray-900"
              >
                Leaderboard
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-gray-900"
              >
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </Link>
              <div className="pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-700 mb-2">
                  {user.name} ({user.role})
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;