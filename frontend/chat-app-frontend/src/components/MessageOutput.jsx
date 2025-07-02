import React from 'react';

function MessageOutput({ messages, currentUser }) {
  return (
    <div className="flex-grow p-4 overflow-y-auto">
      <div className="space-y-4">
        {messages.map((message, index) => {
          const isOwnMessage = message.senderId === currentUser?._id;
          
          return (
            <div 
              key={index} 
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                  isOwnMessage 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {message.content}
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