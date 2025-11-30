const app = require('./index');
const PORT = 5000;

console.log('Attempting to start server...');

try {
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    server.on('error', (e) => {
        console.error('Server error:', e);
    });
} catch (e) {
    console.error('Exception starting server:', e);
}
