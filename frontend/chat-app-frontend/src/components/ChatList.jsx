import React from 'react';

function ChatList({ contacts = [], activeContact, onSelectContact }) {
  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="p-3 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search contacts..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      
      <div className="divide-y divide-gray-200">
        {contacts.map((contact) => (
          <div
            key={contact._id}
            onClick={() => onSelectContact(contact)}
            className={`p-3 flex items-center cursor-pointer hover:bg-gray-50 ${
              activeContact?._id === contact._id ? 'bg-indigo-50' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-bold mr-3">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-grow">
              <div className="font-medium">{contact.name}</div>
              <div className="text-sm text-gray-500 truncate">
                {contact.lastMessage || 'No messages yet'}
              </div>
            </div>
            {contact.unreadCount > 0 && (
              <div className="ml-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {contact.unreadCount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList;