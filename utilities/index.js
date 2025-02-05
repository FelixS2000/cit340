const Util = {}; // Define the Util object

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

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next();
    } else {
        req.flash("notice", "Please log in.");
        return res.redirect("/account/login");
    }
};

// Export as part of an object for extensibility
module.exports = { buildVehicleHTML, checkLogin: Util.checkLogin };
