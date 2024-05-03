// Assuming the server has been set up to serve at the same URL
const socket = io(); // Connect to the server hosted on the same URL

// Listen for timer updates from the server
socket.on('timer', function(data) {
    document.getElementById('timer').innerText = data.timeRemaining + 's';
    document.getElementById('keyPrice').innerText = data.keyPrice + ' Points';
});

// Listen for updates to the key price after someone buys a key
socket.on('update', function(data) {
    document.getElementById('keyPrice').innerText = data.keyPrice + ' Points';
});

// Listen for the winner announcement from the server
socket.on('winner', function(winner) {
    document.getElementById('message').innerText = winner + ' wins the game!';
});

// Function to handle key purchase
function buyKey() {
    // Emit a buyKey event to the server with necessary user data
    // You should replace 'user' and 500 with actual data passed to the script
    socket.emit('buyKey', { username: 'user', userPoints: 500 });
}
