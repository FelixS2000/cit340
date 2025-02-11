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

// Export as part of an object for extensibility
function checkLogin(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // User is authenticated, proceed to the next middleware
    } else {
        return res.status(401).json({ message: 'Unauthorized' }); // User is not authenticated
    }
}

// Placeholder for getNav function
function getNav() {
    // This function should return navigation data
    return [];
}

const jwt = require("jsonwebtoken"); // Import JWT

// Middleware to check token validity
function checkJWTToken(req, res, next) {
    const token = req.cookies.jwt; // Get token from cookie

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied." });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify the token
        req.user = decoded; // Attach decoded user information to request
        next(); // Proceed to the next middleware
    } catch (err) {
        return res.status(401).json({ message: "Token is not valid." });
    }
}

module.exports = { buildVehicleHTML, checkLogin, checkJWTToken, getNav }; // Export the new middleware
