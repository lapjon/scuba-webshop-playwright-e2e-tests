const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Adjust the path if needed

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies

// Routes
app.use('/api', userRoutes); // All user-related routes

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Root route for welcome page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'welcome.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});