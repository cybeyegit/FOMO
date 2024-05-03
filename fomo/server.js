const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 8080;  // Default port for Google App Engine
let timeRemaining = 30;
let keyPrice = 100;
let lastPurchaser = null;
let totalPoints = 0;


app.use(express.static('public'));


app.get('/', (req, res) => {
    res.send('Key Purchase Game Server');
});

// Serve environment variables to the client
app.get('/config', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_KEY  // It should be the public 'anon' key, not the secret key
  });
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.emit('timer', { timeRemaining, keyPrice });

    socket.on('buyKey', (data) => {
        if (data.userPoints >= keyPrice) {
            lastPurchaser = data.username;
            totalPoints += keyPrice;
            keyPrice += 50;
            io.emit('update', { keyPrice, lastPurchaser });
        } else {
            socket.emit('error', 'Not enough points');
        }
    });
});

setInterval(() => {
    if (timeRemaining > 0) {
        timeRemaining--;
        io.emit('timer', { timeRemaining, keyPrice });
        if (timeRemaining === 0) {
            io.emit('winner', lastPurchaser);
        }
    }
}, 1000);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
