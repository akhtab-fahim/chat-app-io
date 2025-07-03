import React from 'react';

function MessageOutput({ messages, currentUser }) {
  return (
    <div className="flex-grow p-4 overflow-y-auto">
      <div className="space-y-4">
        {messages.map((message, index) => {
          const isOwnMessage = message.senderId === currentUser?._id;
          const hasFile = message.file && message.file !== ""; // Check if file exists
          
          return (
            <div 
              key={index} 
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >


              <div 
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                  isOwnMessage 
                    ? 'bg-green-500 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {message.content && (
                  <div className="mb-1">{message.content}</div>
                )}

                {/* 📎 Show file if exists */}
                {hasFile && (
                  <div className="mt-1">
                    {message.file.match(/\.(jpeg|jpg|png)$/i) ? (
                      <img
                        src={message.file}
                        alt="Attachment"
                        className="max-w-xs max-h-48 rounded shadow"
                      />
                    ) : (
                      <a
                        href={message.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-sm"
                      >
                        📎 Download file
                      </a>
                    )}
                  </div>
                )}


                <div className={`text-xs mt-1 ${isOwnMessage ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {new Date(message?.createdAt || message?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MessageOutput;