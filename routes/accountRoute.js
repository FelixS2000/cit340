const express = require('express');
const router = express.Router();

// Sample route for account
router.get('/', (req, res) => {
    res.json({ message: 'Account route is working!' });
});

router.get('/login', (req, res) => {
    // Render the login page
    res.render('account/login');
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

module.exports = router;

router.get('/', (req, res) => {
    res.json({ message: 'Account route is working!' });
});

// Login route


// Login route
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

module.exports = router;
