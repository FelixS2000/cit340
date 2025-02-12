// utilities/index.js

const jwt = require("jsonwebtoken");
const pool = require("../database/connection");
const { validationResult } = require('express-validator');

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
async function getNav() {
    try {
        const data = await pool.query(
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

// Error handling middleware
const handleErrors = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation middleware
const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Middleware to check token validity
function checkJWTToken(req, res, next) {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied." });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        res.locals.accountData = decoded;
        res.locals.loggedin = 1;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token is not valid." });
    }
}

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

function checkAdmin(req, res, next) {
    if (req.user && req.user.account_type === 'Admin') {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
}

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

module.exports = {
    getNav,
    buildVehicleHTML,
    checkLogin,
    checkJWTToken,
    checkAdmin,
    handleErrors,
    checkValidation
};
