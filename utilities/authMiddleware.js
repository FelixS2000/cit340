const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    const token = req.cookies.jwt; // Get token from cookie

    if (!token) {
        req.flash('errorMessage', 'You must log in first.');
        res.clearCookie('jwt');
        return res.redirect('/account/login'); // Redirect to login if no token
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            req.flash('errorMessage', 'Session expired. Please log in again.');
            res.clearCookie('jwt'); // Remove invalid token
            return res.redirect('/account/login'); 
        }

        req.user = decoded; // Attach user info to request
        next(); // Proceed to the next middleware
    });
}

function checkAdmin(req, res, next) {
    if (!req.user || !['Employee', 'Admin'].includes(req.user.account_type)) {
        req.flash('errorMessage', 'Unauthorized access.');
        return res.redirect('/account/login'); // Redirect if not authorized
    }
    next(); // Proceed if authorized
}

function checkEmployeeOrAdmin(req, res, next) {
    if (!req.user || !['Employee', 'Admin'].includes(req.user.account_type)) {
        req.flash('errorMessage', 'Unauthorized access.');
        return res.redirect('/account/login'); // Redirect if not authorized
    }
    next(); // Proceed if authorized
}

module.exports = { checkAuth, checkAdmin, checkEmployeeOrAdmin };
