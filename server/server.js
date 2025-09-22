const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = require('./app');
const attachInterviewSocket = require('./sockets/interviewSocket');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://intellivibe.redirectme.net'],
    methods: ['GET', 'POST']
  }
});

attachInterviewSocket(io);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`IntelliVibe server listening on port ${PORT}`);
});
