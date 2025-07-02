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
    <header className="bg-white shadow-xl border-b-2  border-indigo-200">
      <div className="max-w-8xl mx-auto px-2 py-4 flex justify-between items-center ">
        <Link to="/" className="text-indigo-600 pl-2 font-bold text-2xl">
          ChatApp
        </Link>
        
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-l font-bold text-indigo-600 border-2 border-indigo-600 rounded-md hover:text-indigo-800"
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