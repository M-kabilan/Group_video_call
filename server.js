const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Your React app URL
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  socket.on('callUser', ({ userToCall, signalData, from }) => {
    io.to(userToCall).emit('call', { signal: signalData, from });
  });

  socket.on('acceptCall', ({ signal, to }) => {
    io.to(to).emit('callAccepted', { signal });
  });

  socket.on('rejectCall', ({ to }) => {
    io.to(to).emit('callRejected');
  });

  socket.on('endCall', ({ to }) => {
    io.to(to).emit('callEnded');
  });

  socket.on('signal', ({ signal, to }) => {
    io.to(to).emit('signal', { signal });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});