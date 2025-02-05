const express = require('express');
const router = express.Router();
const utilities = require('../utilities/index'); // Ensure to import utilities

// Sample route for account
router.get('/', utilities.checkLogin, (req, res) => {
    res.json({ message: 'Account route is working!' });
});

router.get('/login', (req, res) => {
    // Render the login page
    res.render('account/login', { title: 'Login' });
});

router.post('/login', (req, res) => {
    // Placeholder for login logic
    const { username, password } = req.body;
    // Here you would typically check the credentials against a database
    if (username === 'test' && password === 'password') {
        res.json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// New route for registration
router.get('/register', (req, res) => {
    // Render the registration page
    res.render('account/register', { title: 'Register' });
});

router.post('/register', (req, res) => {
    // Handle registration logic here
    const { firstname, lastname, email, password } = req.body;
    // Logic to save the new user to the database goes here
    // For now, just send a success message
    res.json({ message: 'Registration successful!' });
});

module.exports = router;
