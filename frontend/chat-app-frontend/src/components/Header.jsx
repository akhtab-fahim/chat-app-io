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
    <header className="bg-white shadow-xl border-b-2  border-green-200">
      <div className="max-w-8xl mx-auto px-2 py-4 flex justify-between items-center ">
        <Link to="/" className="text-green-600 pl-2 text-shadow-2xs font-bold text-3xl">
          Whisprr..
        </Link>
        
        
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-l font-bold text-green-600 border-2 border-green-200 rounded-md hover:text-green-800"
            >
              Logout
            </button>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="text-green-600 hover:text-green-800 text-sm">
                Login
              </Link>
              <Link to="/register" className="text-green-600 hover:text-green-800 text-sm">
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