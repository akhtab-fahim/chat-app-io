import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-indigo-600 font-bold text-xl">
          ChatApp
        </Link>
        
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-800"
            >
              Logout
            </button>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 text-sm">
                Login
              </Link>
              <Link to="/register" className="text-indigo-600 hover:text-indigo-800 text-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;