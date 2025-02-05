const express = require('express');
const router = express.Router();
const utilities = require('../utilities/index'); // Ensure to import utilities
const jwt = require('jsonwebtoken'); // Import JWT
const db = require('../database/connection'); // Import database connection
const bcrypt = require("bcryptjs"); // Import bcrypt

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
        
        if (user.rows.length > 0) {
            const isMatch = await bcrypt.compare(password, user.rows[0].account_password);
            if (isMatch) {
                // Generate JWT token
                const token = jwt.sign({ id: user.rows[0].id, account_type: user.rows[0].account_type }, 'your_jwt_secret', { expiresIn: '1h' });
                res.cookie('jwt', token, { httpOnly: true });
                
                // Store account type in session
                req.session.accountType = user.rows[0].account_type;

                res.json({ message: 'Login successful!', token });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
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

router.post('/register', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await db.query('INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4)', [firstname, lastname, email, hashedPassword]);

        res.json({ message: 'Registration successful!' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// New route for account management
router.get('/management', (req, res) => {
    // Assuming accountType is stored in the session or JWT
    const accountType = req.session.accountType || 'Guest'; // Default to 'Guest' if not set
    res.render('account/management', { title: 'Account Management', accountType });
});

module.exports = router;
