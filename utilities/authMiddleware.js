const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    const token = req.cookies.jwt;

    if (!token) {
        req.flash('error', 'Please log in first');
        return res.redirect('/account/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        req.flash('error', 'Session expired. Please log in again');
        res.clearCookie('jwt');
        return res.redirect('/account/login');
    }
}

function checkAdmin(req, res, next) {
    if (!req.user || !['Employee', 'Admin'].includes(req.user.account_type)) {
        req.flash('error', 'Unauthorized access');
        return res.redirect('/account/login');
    }
    next();
}

function checkEmployeeOrAdmin(req, res, next) {
    if (!req.user || !['Employee', 'Admin'].includes(req.user.account_type)) {
        req.flash('error', 'Unauthorized access');
        return res.redirect('/account/login');
    }
    next();
}const classificationsMiddleware = async (req, res, next) => {
  try {
    const classificationsResult = await db.query('SELECT * FROM classification');
    const classifications = classificationsResult.rows;
    res.locals.classifications = classifications;
    res.locals.displayFeedbackMessage = true; // Set displayFeedbackMessage to true
    next();
  } catch (error) {
    console.error('Error fetching classifications:', error);
    next(error);
  }
};
  
  
module.exports = { checkAuth, checkAdmin, checkEmployeeOrAdmin, classificationsMiddleware };
