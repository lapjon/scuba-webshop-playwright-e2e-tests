const express = require('express');
const router = express.Router();

// Temporary in-memory user storage
const users = []; // Define globally to share across routes

// Example Sign Up Route
router.post('/signup', (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    console.log('Signup request for email:', email);
    console.log('Current users:', users);

    // Check for existing user (case-insensitive)
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        console.log(`Duplicate email detected: ${email}`);
        return res.status(409).json({ message: 'Email already in use.' });
    }

    // Create a new user
    const newUser = { id: users.length + 1, email, password };
    users.push(newUser);

    console.log(`User registered successfully: ${email}`);
    return res.status(201).json({
        message: 'User registered successfully!',
        user: { id: newUser.id, email: newUser.email },
    });
});

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.status(200).json({ message: 'Login successful!', user: { id: user.id, email: user.email } });
});

module.exports = router;