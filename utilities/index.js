function buildVehicleHTML(vehicle) {
    return `
        <div class="vehicle-detail">
            <h1>${vehicle.make} ${vehicle.model}</h1>
            <img src="${vehicle.image}" alt="${vehicle.year} ${vehicle.make} ${vehicle.model}">
            <p>Year: ${vehicle.year}</p>
            <p>Price: $${vehicle.price.toLocaleString()}</p>
            <p>Mileage: ${vehicle.mileage.toLocaleString()} miles</p>
            <p>Description: ${vehicle.description}</p>
        </div>
    `;
}

// Middleware to check token validity and admin access
function checkJWTToken(req, res, next) {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied." });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        res.locals.accountData = decoded; // Make user data available to views
        res.locals.loggedin = 1;

        // Check if user is admin
        if (decoded.account_type === 'Admin') {
            next();
        } else {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }
    } catch (err) {
        return res.status(401).json({ message: "Token is not valid." });
    }
}

// Separate middleware for regular user authentication
function checkLogin(req, res, next) {
    const token = req.cookies.jwt;

    if (!token) {
        return res.redirect('/account/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        res.locals.accountData = decoded;
        res.locals.loggedin = 1;
        next();
    } catch (error) {
        res.clearCookie('jwt');
        return res.redirect('/account/login');
    }
}

// Use this middleware for routes that require admin access
function checkAdmin(req, res, next) {
    if (req.user && req.user.account_type === 'Admin') {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
}

module.exports = { 
    buildVehicleHTML, 
    checkLogin, 
    checkJWTToken, 
    checkAdmin,
    getNav 
};
