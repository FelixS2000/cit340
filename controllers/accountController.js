const accountModel = require('../models/accountModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require("../database/connection");

const JWT_SECRET_KEY='a383b7b85973a305572a38bd83ca83d93814c347a44c363bc86988f29077614e4de9776c100b3ed52362ec0c59e7dc4ecb30c0003d712a5ccbd1bb35df8833de';

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

        // ✅ Ensure JWT contains account_type
        const token = jwt.sign(
            {
                account_id: user.account_id,
                account_firstname: user.account_firstname,
                account_lastname: user.account_lastname,
                account_email: user.account_email,
                account_type: user.account_type, // ✅ Ensure this is included
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
    let nav = await utilities.getNav();
    res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
    });
}

async function getAdminDashboard(req, res) {
    let nav = await utilities.getNav();
    res.render("account/admin", {
        title: "Admin Dashboard",
        nav,
        errors: null,
    });
}

module.exports = {
    accountLogin,
    getAccountManagement,
    getAdminDashboard,
};
