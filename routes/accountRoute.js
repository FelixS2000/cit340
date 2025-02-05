const express = require('express');
const router = express.Router();
const utilities = require('../utilities/index'); // Ensure to import utilities
const jwt = require('jsonwebtoken'); // Import JWT
const db = require('../database/connection'); // Import database connection

// Sample route for account
router.get('/', utilities.checkLogin, (req, res) => {
    res.json({ message: 'Account route is working!' });
});

router.get('/login', (req, res) => {
    // Render the login page
    res.render('account/login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check the credentials against the database
        const user = await db.query('SELECT * FROM public.account WHERE account_email = $1', [username]);
        
        if (user.rows.length > 0 && user.rows[0].account_password === password) {
            // Generate JWT token
            const token = jwt.sign({ id: user.rows[0].id, account_type: user.rows[0].account_type }, 'your_jwt_secret', { expiresIn: '1h' });
            res.cookie('jwt', token, { httpOnly: true });
            res.json({ message: 'Login successful!', token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// New route for registration
router.get('/register', (req, res) => {
    // Render the registration page
    res.render('account/register', { title: 'Register' });
});

router.post('/register', (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    // Logic to save the new user to the database goes here
    res.json({ message: 'Registration successful!' });
});

module.exports = router;
