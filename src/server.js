const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const { getAudio } = require('./downloader');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

app.get('/');

app.post("/api/download", (req, res) => {
  try {
    getAudio(req.body.url, res);
    res.status(200).json({ message: 'Download started' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Socket.io connection
io.on('connection', (socket, client) => {
    console.log('New client connected');
    clientGlob = client
    console.log(client)
    console.log(clientGlob)
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});