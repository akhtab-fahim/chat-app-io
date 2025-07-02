import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className=" h-32 bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-7xl font-mono mx-auto px-4 py-2 flex justify-between items-center">
        <div className="text-gray-500 text-l font-bold ">
          © {currentYear} ChatApp
        </div>
        <div className="flex space-x-4 animate-pulse">
          <a href="https://github.com/akhtab-fahim"><img  src="./public/github.png" alt="Github" className="h-6 animate-wiggle" /></a>
          <a href="https://www.instagram.com/akhtab_fahim"/><img src="./public/insta.png" alt="Instagram" className="h-6" /><a/>
          <a href="https://x.com/AkhtabMd85479"><img src="./public/twitter.png" alt="Twitter" className="h-6 pr-12" /></a>
          <a href="https://github.com/akhtab-fahim" className="text-gray-500 hover:text-indigo-600 text-sm">About</a>
          <a href="https://github.com/akhtab-fahim/chat-app-io" className="text-gray-500 hover:text-indigo-600 text-sm">Source Code</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;