const { 
    getVehicleById, 
    getInventoryByClassification: getInventoryFromModel, 
    saveUserToDatabase, 
    saveClassificationToDatabase, 
    saveInventoryToDatabase, 
    getClassificationsFromModel 
} = require('../models/inventoryModel');

const { buildVehicleHTML } = require('../utilities/index');
const bcrypt = require("bcryptjs"); // Import bcrypt

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

async function registerUser(req, res, next) {
    // Register a new user
    try {
        const { firstName, lastName, email, account_password } = req.body;

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(account_password, 10);

        // Save the user to the database
        await saveUserToDatabase(firstName, lastName, email, hashedPassword);

        // Redirect to the registration confirmation page
        res.redirect('/inventory/register'); // Redirect to the new confirmation page
    } catch (error) {
        next(error);
    }
}

async function addClassification(req, res, next) {
    // Add a new classification
    try {
        const { classificationName, color, description } = req.body;

        // Server-side validation
        if (!classificationName || /\s|[^a-zA-Z0-9]/.test(classificationName)) {
            req.flash('errorMessage', 'Classification name cannot contain spaces or special characters.');
            return res.render('inventory/add-classification', {
                errorMessage: req.flash('errorMessage'),
                classificationName: classificationName // Retain the value
            });
        }

        // Save the classification to the database
        await saveClassificationToDatabase(classificationName, color, description);

        req.flash('message', 'Classification added successfully!');
        res.redirect('/inventory/management'); // Redirect to management view
    } catch (error) {
        next(error);
    }
}

async function addInventory(req, res, next) {
    // Add a new inventory item
    try {
        const { make, model, year, price, mileage, classification_id, description, color } = req.body;

        // Server-side validation
        if (!make || !model || !year || !price || !mileage || isNaN(year) || isNaN(price) || isNaN(mileage)) {
            req.flash('errorMessage', 'All fields are required and must be valid.');
            return res.render('inventory/add-inventory', {
                flashMessage: req.flash('errorMessage'),
                make: make,
                model: model,
                year: year,
                price: price,
                mileage: mileage,
                classification_id: classification_id, // Retain the value
                classifications: await getClassificationsFromModel() // Fetch classifications for the view
            });
        }

        // Save the inventory item to the database
        await saveInventoryToDatabase(make, model, year, price, mileage, classification_id, description, color);

        req.flash('message', 'Inventory item added successfully!');
        res.redirect('/inventory/management'); // Redirect to management view
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

// New function to render the management view
async function renderManagementView(req, res, next) {
    try {
        const classifications = await getClassificationsFromModel();
        res.render('inventory/management', {
            title: 'Inventory Management',
            classifications: classifications // Pass classifications to the view
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getVehicleDetails,
    registerUser,
    addClassification,
    addInventory,
    getInventoryByClassification,
    getClassificationsFromModel, // Export the function
    renderManagementView // Export the new function
};
