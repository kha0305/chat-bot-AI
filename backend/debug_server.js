const express = require('express');
const app = express();
const PORT = 5000;

console.log('Starting debug server...');

app.get('/', (req, res) => {
    res.send('Debug server running');
});

const server = app.listen(PORT, () => {
    console.log(`Debug server listening on port ${PORT}`);
});

server.on('error', (e) => {
    console.error('Server error:', e);
});

// Keep alive
setInterval(() => {
    console.log('Heartbeat');
}, 5000);
