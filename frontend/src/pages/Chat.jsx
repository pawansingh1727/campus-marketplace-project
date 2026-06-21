import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import api from '../utils/api.js';
import { Send, User as UserIcon, Clock, MessageSquare } from 'lucide-react';
import moment from 'moment';

const Chat = () => {
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get('user');
  
  const { userInfo } = useSelector((state) => state.auth);
  
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (userInfo) {
      const newSocket = io(window.location.hostname === 'localhost' ? 'http://localhost:5001' : '/');
      setSocket(newSocket);
      newSocket.emit('register_user', userInfo._id);

      return () => newSocket.close();
    }
  }, [userInfo]);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (msg) => {
        if (currentChatUser && (msg.sender === currentChatUser._id || msg.receiver === currentChatUser._id)) {
          setMessages((prev) => [...prev, msg]);
        }
        fetchConversations();
      });
    }
  }, [socket, currentChatUser]);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/chat/conversations');
      setConversations(data);
      
      if (!currentChatUser && initialUserId) {
        const existing = data.find(c => c._id === initialUserId);
        if (existing) {
          setCurrentChatUser(existing);
        } else {
          setCurrentChatUser({ _id: initialUserId, name: 'Seller' });
          setConversations([{ _id: initialUserId, name: 'Seller' }, ...data]);
        }
      } else if (!currentChatUser && data.length > 0) {
        setCurrentChatUser(data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [initialUserId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChatUser) {
        try {
          const { data } = await api.get(`/chat/${currentChatUser._id}`);
          setMessages(data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchMessages();
  }, [currentChatUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChatUser) return;

    const msgData = {
      sender: userInfo._id,
      receiver: currentChatUser._id,
      text: newMessage,
    };

    socket.emit('send_message', msgData);

    setMessages((prev) => [...prev, { ...msgData, createdAt: new Date() }]);
    setNewMessage('');
    
    if (!conversations.find(c => c._id === currentChatUser._id)) {
       setConversations([currentChatUser, ...conversations]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)]">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex overflow-hidden h-full">
        
        <div className="w-1/3 md:w-1/4 border-r border-gray-100 bg-gray-50 flex flex-col h-full hidden sm:flex">
          <div className="p-5 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-extrabold text-gray-900">Messages</h2>
          </div>
          <div className="overflow-y-auto flex-grow">
            {conversations.map(user => (
              <div 
                key={user._id}
                onClick={() => setCurrentChatUser(user)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors flex items-center gap-3 ${currentChatUser?._id === user._id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-100'}`}
              >
                <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className={`font-bold ${currentChatUser?._id === user._id ? 'text-blue-900' : 'text-gray-800'}`}>{user.name}</h4>
                </div>
              </div>
            ))}
            {conversations.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">
                No active conversations. Contact a seller to start chatting!
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full bg-white relative">
          {currentChatUser ? (
            <>
              <div className="p-5 border-b border-gray-100 bg-white flex items-center gap-3 shadow-sm z-10">
                <div className="bg-blue-100 p-2 rounded-full text-blue-700 sm:hidden">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900">{currentChatUser.name}</h3>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.map((msg, i) => {
                  const isMine = msg.sender === userInfo._id;
                  return (
                    <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${isMine ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                        <p>{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                          <Clock className="h-3 w-3" /> {moment(msg.createdAt).format('LT')}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare className="h-16 w-16 mb-4 text-gray-200" />
              <p className="text-lg font-medium">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
