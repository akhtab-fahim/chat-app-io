import React, { useState, useEffect } from 'react';
import ChatList from '../components/ChatList';
import MessageOutput from '../components/MessageOutput';
import MessageInput from '../components/MessageInput';
import { socket } from '../utills/socket';


function Chat() {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
 
  
useEffect(() => {
  if (contacts.length > 0 && !activeContact) {
    setActiveContact(contacts[0]);
  }
}, [contacts]);


useEffect(()=>{
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (userData && token) {
      const parsedUser = JSON.parse(userData);

        if (parsedUser?._id) {
            setCurrentUser(parsedUser);
            socket.auth = { token };
            socket.connect();
        } else {
          console.error("Invalid user object:", parsedUser);
        }
    }
},[])

useEffect(() => {
  const fetchContacts = async () => {
    const res = await fetch('http://localhost:2000/auth/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    const data = await res.json();
    
    //setContacts(data.users);
    if (data?.users?.length) {
    setContacts(data.users.map(u => ({
        ...u,
        unreadCount: 0,
        lastMessage: "",
      })));

  } else {
    console.warn("No contacts returned:", data);
  }
  };

  fetchContacts();
}, []);

useEffect(() => {
  socket.on("online_users", (onlineUserIds) => {
    setContacts(prev =>
      prev.map(c => ({
        ...c,
        online: onlineUserIds.includes(c._id)
      }))
    );
  });

  return () => socket.off("online_users");
}, []);


useEffect(() => {
  // Only run if user logged in
  if (!currentUser) return;

//   socket.connect();

//   console.log("Socket connected:", socket.id);

  socket.on("private_message", (message) => {
  if (!message?.senderId) {
      console.warn("Received message with missing senderId:", message);
      return;
  }
    console.log("New private message:", message);

    // If message is for the current contact

    if (message.senderId === activeContact._id) {
      setMessages(prev => [...prev, message]);
    } else {
      // Optionally increase unread count for other contacts
      setContacts(prev =>
        prev.map(c =>
          c._id === message.senderId? { ...c, unreadCount: c.unreadCount + 1 } : c));
    }

  });

  return () => {
    //socket.disconnect();
    socket.off("private_message");
  };
}, [currentUser, activeContact]);

  
  const handleSelectContact = (contact) => {
    setActiveContact(contact);
    
    // Mark messages as read
    setContacts(contacts.map(c => c._id === contact._id ? { ...c, unreadCount: 0 } : c));
  };
  
 const handleSendMessage = (content) => {

  if (!currentUser?._id || !activeContact?._id) {
    console.error("Missing currentUser or activeContact");
    return;
  }

  const newMessage = {
    content,
    senderId: currentUser._id,
    receiverId: activeContact._id,
    createdAt: new Date().toISOString(),
  };

  // Emit to server
  socket.emit("send_message", newMessage);

  // Optimistically update UI
  setMessages(prev => [...prev, newMessage]);

  setContacts(prev =>
    prev.map(c =>
      c._id === activeContact._id ? { ...c, lastMessage: content } : c));
};

  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 font-medium text-lg">
          Chats
        </div>
        <ChatList 
          contacts={contacts} 
          activeContact={activeContact} 
          onSelectContact={handleSelectContact} 
        />
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center bg-white">
          <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-bold mr-3">
            {activeContact?.name?.[0]?.toUpperCase() || ''}
          </div>
          <div>
            <div className="font-medium">{activeContact?.name}</div>
            {/* <div className="text-sm text-gray-500">
              {activeContact?.online ? 'Online' : 'Offline'}
            </div> */}
          </div>
        </div>
        
        {/* Messages */}
        <MessageOutput messages={messages} currentUser={currentUser} />
        
        {/* Input */}
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default Chat;