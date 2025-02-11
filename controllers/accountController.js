const accountModel = require('../models/accountModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function accountLogin(req, res) {
    const { account_email, account_password } = req.body;
    console.log("Login attempt for:", account_email);

    try {
        const user = await accountModel.loginUser(account_email, account_password);
        
        if (!user) {
            req.flash("error", "Invalid credentials");
            return res.redirect("/account/login");
        }

        // Create JWT token
        const token = jwt.sign(
            {
                account_id: user.account_id,
                account_type: user.account_type,
                account_email: user.account_email
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '24h' }
        );

        // Set token in cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        req.flash("success", "Login successful");
        res.redirect("/inventory/management");
    } catch (error) {
        console.error("Login error:", error);
        req.flash("error", "An error occurred during login");
        res.redirect("/account/login");
    }
}

module.exports = {
    accountLogin
};
