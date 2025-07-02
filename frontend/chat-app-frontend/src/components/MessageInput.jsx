import React, { useState } from 'react';


function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message,null);
      setMessage('');
    }
  };

  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    setIsUploading(true);
    try {
      await onSendMessage('', file);
    } finally {
      setIsUploading(false);
    }
  }
};

  return (
    <form onSubmit={handleSubmit} className="flex items-center border-t border-gray-200 p-3">
      <label htmlFor="file-upload" className="cursor-pointer p-2 text-gray-500 hover:text-indigo-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </label>

      {/* File Input  */}

      <input 
        id="file-upload" 
        type="file" 
        className="hidden" 
        onChange={handleFileChange} 
        disabled={isUploading}
      />
      
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-grow mx-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
        disabled={isUploading}
      />
      
      <button 
        type="submit" 
        className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={!message.trim() || isUploading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  );
}

export default MessageInput;