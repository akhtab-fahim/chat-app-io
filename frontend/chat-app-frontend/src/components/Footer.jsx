import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className=" h-32 bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="text-gray-500 text-sm">
          © {currentYear} ChatApp
        </div>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">About</a>
          <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Privacy</a>
          <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Terms</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;