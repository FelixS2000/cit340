// Fetch vehicle details by ID
const { getVehicleById, getInventoryByClassification: getInventoryFromModel, saveUserToDatabase } = require('../models/inventoryModel');
const { buildVehicleHTML } = require('../utilities/index');

// Fetch vehicle details by ID
async function getVehicleDetails(req, res, next) {
    try {
        const vehicleId = req.params.id;

        const vehicle = await getVehicleById(vehicleId);
        console.log('Fetched Vehicle Data:', vehicle); // Log the fetched vehicle data

        if (!vehicle) {
            return res.status(404).render('errors/404', { 
                title: 'Vehicle Not Found', 
                message: 'The requested vehicle does not exist.' 
            });
        }

        const vehicleHTML = buildVehicleHTML(vehicle);

        res.render('inventory/detail', {
            title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            vehicleHTML,
        });
    } catch (error) {
        next(error);
    }
}

// Register a new user
async function registerUser(req, res, next) {
    try {
        const { firstName, lastName, email, account_password } = req.body;

        // Save the user to the database
        await saveUserToDatabase(firstName, lastName, email, account_password);

        res.redirect('/'); // Redirect to home or another page after successful registration
    } catch (error) {
        next(error);
    }
}

// Fetch inventory list by classification ID
async function getInventoryByClassification(req, res, next) {
    const classificationId = req.params.classificationId;
    const inventory = await getInventoryFromModel(classificationId);
    try {
        if (!inventory.length) {
            return res.status(404).render('errors/404', { 
                title: 'No Inventory Found', 
                message: 'No vehicles found for this classification.' 
            });
        }

        res.render('inventory/classification', {
            title: 'Inventory',
            inventory,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getVehicleDetails,
    registerUser,
    getInventoryByClassification,
};
