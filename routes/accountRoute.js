const express = require('express');
const router = express.Router();
const utilities = require('../utilities/index'); // Ensure to import utilities
const jwt = require('jsonwebtoken'); // Import JWT
const db = require('../database/connection'); // Import database connection
const bcrypt = require("bcryptjs"); // Import bcrypt

// Secret key for JWT
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key'; // Use environment variable or fallback to a string

// Sample route for account
router.get('/', utilities.checkLogin, (req, res) => {
    res.json({ message: 'Account route is working!' });
});

// GET route to render the login page
router.get("/login", (req, res) => {
    res.render("account/login", { title: "Login" }); // Render the login page
});

// POST route to handle login form submission
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.flash("errorMessage", "Email and password are required.");
        return res.redirect("/account/login");
    }

    try {
        // Fetch user from the database (replace with actual DB query)
        const user = await db.findUserByEmailOrUsername(email);  // Ensure this is correct for your DB

        if (!user) {
            req.flash("errorMessage", "User not found.");
            return res.redirect("/account/login");
        }

        // Compare the password with the hashed password from DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            req.flash("errorMessage", "Incorrect password.");
            return res.redirect("/account/login");
        }

        // If credentials are correct, set session variables
        req.session.userLoggedIn = true;
        req.session.userName = user.firstName;
        req.session.userEmail = user.email;

        req.flash("message", "Login successful.");
        return res.redirect("/dashboard");  // Redirect to a dashboard or home page after successful login

    } catch (error) {
        console.error("Error during login:", error);
        req.flash("errorMessage", "An error occurred while logging in.");
        return res.redirect("/account/login");
    }
});


// Register page route
router.get("/register", (req, res) => {
    res.render("account/register", { title: "Register" });
});

// Registration route
router.post('/register', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4)', [firstname, lastname, email, hashedPassword]);
        req.flash('message', 'Registration successful! Please log in.');
        return res.redirect('/account/login');
    } catch (error) {
        console.error('❌ Error during registration:', error);
        req.flash('errorMessage', 'An error occurred during registration. Please try again.');
        return res.redirect('/account/register');
    }
});

// Account Management page route
router.get('/management', utilities.checkLogin, (req, res) => {
    res.render('account/management', { title: 'Account Management' });
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

// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('jwt'); // Clear the JWT cookie
    req.session.destroy(); // Destroy the session
    return res.redirect('/'); // Redirect to home view
});

// Middleware to protect routes with JWT authentication
router.use('/protected', (req, res, next) => {
    const token = req.cookies.jwt; // Get the token from cookies

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY); // Verify the token using the secret key
        req.user = decoded; // Attach decoded user information to request
        next(); // Proceed to the next middleware
    } catch (err) {
        return res.status(401).json({ message: "Token is not valid." });
    }
});

module.exports = router;
