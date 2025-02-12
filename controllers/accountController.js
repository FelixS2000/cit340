// controllers/accountController.js

const accountModel = require('../models/accountModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require("../database/connection");

const JWT_SECRET_KEY = 'a383b7b85973a305572a38bd83ca83d93814c347a44c363bc86988f29077614e4de9776c100b3ed52362ec0c59e7dc4ecb30c0003d712a5ccbd1bb35df8833de';

async function getNav() {
    try {
        const data = await db.query(
            "SELECT * FROM public.classification ORDER BY classification_name"
        );
        let list = "<ul>";
        data.rows.forEach((row) => {
            list += `<li><a href="/inv/type/${row.classification_id}">${row.classification_name}</a></li>`;
        });
        list += "</ul>";
        return list;
    } catch (error) {
        console.error("getNav error: " + error);
        return '<ul><li><a href="/">Home</a></li></ul>';
    }
}

async function accountLogin(req, res) {
    const { account_email, account_password } = req.body;

    try {
        const result = await db.query('SELECT * FROM public.account WHERE account_email = $1', [account_email]);

        if (result.rows.length === 0) {
            req.flash('errorMessage', 'Invalid email or password.');
            return res.redirect('/account/login');
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(account_password, user.account_password);
        if (!passwordMatch) {
            req.flash('errorMessage', 'Invalid email or password.');
            return res.redirect('/account/login');
        }

        const token = jwt.sign(
            {
                account_id: user.account_id,
                account_firstname: user.account_firstname,
                account_lastname: user.account_lastname,
                account_email: user.account_email,
                account_type: user.account_type,
            },
            JWT_SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.cookie('jwt', token, { httpOnly: true });
        res.redirect('/account/management');

    } catch (error) {
        console.error('❌ Login error:', error);
        req.flash('errorMessage', 'An error occurred during login.');
        res.redirect('/account/login');
    }
}

async function getAccountManagement(req, res) {
    try {
        const nav = await getNav();
        res.render("account/management", {
            title: "Account Management",
            nav,
            errors: null,
            user: req.user || null  // Add this line to pass user data
        });
    } catch (error) {
        console.error("Error in getAccountManagement:", error);
        res.status(500).send("Server Error");
    }
}

async function getAdminDashboard(req, res) {
    try {
        const nav = await getNav();
        res.render("account/admin", {
            title: "Admin Dashboard",
            nav,
            errors: null,
            user: req.user || null  // Add this line to pass user data
        });
    } catch (error) {
        console.error("Error in getAdminDashboard:", error);
        res.status(500).send("Server Error");
    }
}

module.exports = {
    accountLogin,
    getAccountManagement,
    getAdminDashboard,
};
