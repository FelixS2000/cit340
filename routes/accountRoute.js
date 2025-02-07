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

// Login page route
router.get("/login", (req, res) => {
    res.render("account/login", { title: "Login" });
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        req.flash('errorMessage', 'Please provide both username and password');
        return res.redirect('/account/login');
    }

    try {
        const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length > 0) {
            const isMatch = await bcrypt.compare(password, user.rows[0].password);
            if (isMatch) {
                req.session.userLoggedIn = true;
                req.session.userName = user.rows[0].username;
                req.session.accountType = user.rows[0].account_type; // Set account type in session
                
                console.log('User logged in:', req.session.userName);
                console.log('Account Type:', req.session.accountType);
                
                req.session.accountType = user.rows[0].account_type; // Set account type in session
                return res.redirect('/account/management'); 

            }
        }
        req.flash('errorMessage', 'Invalid username or password');
        return res.redirect('/account/login');
    } catch (error) {
        req.flash('errorMessage', 'An error occurred during login. Please try again.');
        return res.redirect('/account/login');
    }
});

// Account management route
router.get('/management', (req, res) => {
    const accountType = req.session.accountType || 'Guest'; // Ensure account type is set
    const userLoggedIn = req.session.userLoggedIn || false; // Check if user is logged in
    const userName = req.session.userName || ''; // Get the user's name

    console.log('Account Type:', accountType); // Debugging log
    console.log('User Logged In:', userLoggedIn); // Debugging log
    console.log('User Name:', userName); // Debugging log

    res.render('account/management', { 
        title: 'Account Management', 
        accountType, 
        userLoggedIn, 
        userName 
    });
});

// Account update view route
router.get('/update', utilities.checkLogin, (req, res) => {
    const user = req.session.user; // Assuming user info is stored in session
    res.render('account/update', { title: 'Update Account', user });
});

// Handle account update
router.post('/update', utilities.checkLogin, async (req, res) => {
    const { firstname, lastname, email, account_id } = req.body;

    try {
        await db.query('UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4', [firstname, lastname, email, account_id]);
        req.flash('message', 'Account updated successfully!');
        return res.redirect('/account/management'); // Redirect to management view
    } catch (error) {
        req.flash('errorMessage', 'An error occurred while updating the account. Please try again.');
        return res.redirect('/account/update'); // Redirect back to update view
    }
});

// Handle password change
router.post('/change-password', utilities.checkLogin, async (req, res) => {
    const { newPassword, account_id } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE public.account SET account_password = $1 WHERE account_id = $2', [hashedPassword, account_id]);
        req.flash('message', 'Password changed successfully!');
        return res.redirect('/account/management'); // Redirect to management view
    } catch (error) {
        req.flash('errorMessage', 'An error occurred while changing the password. Please try again.');
        return res.redirect('/account/update'); // Redirect back to update view
    }
});

// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('jwt'); // Clear the JWT cookie
    req.session.destroy(); // Destroy the session
    return res.redirect('/'); // Redirect to home view
});

module.exports = router;
