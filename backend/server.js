import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import { Server } from 'socket.io';
import Message from './models/Message.js';

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Vite default port
    methods: ['GET', 'POST'],
  },
});

const users = new Map();

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  socket.on('register_user', (userId) => {
    users.set(userId, socket.id);
  });

  socket.on('send_message', async (data) => {
    const { sender, receiver, text } = data;
    
    try {
      const message = new Message({ sender, receiver, text });
      await message.save();
      
      const receiverSocketId = users.get(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', message);
      }
    } catch (error) {
      console.error('Error saving message', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    for (let [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
