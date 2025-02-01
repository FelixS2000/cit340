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

async function addInventory(req, res, next) {
    // Add a new inventory item
    try {
        console.log('Request Body:', req.body); // Log the request body for debugging

        const { make, model, year, price, mileage, classification_id, image, thumbnail, color } = req.body;

        // Server-side validation
        if (!make || !model || !year || !price || !mileage || !image || !thumbnail || !color || isNaN(year) || isNaN(price) || isNaN(mileage)) {
            req.flash('errorMessage', 'All fields are required and must be valid.');
            return res.render('inventory/add-inventory', {
                flashMessage: req.flash('errorMessage'),
                make: make || '', // Ensure make is defined
                model: model || '', // Ensure model is defined
                year: year || '', // Ensure year is defined
                price: price || '', // Ensure price is defined
                mileage: mileage || '', // Ensure mileage is defined
                image: image || '', // Ensure image is defined
                thumbnail: thumbnail || '', // Ensure thumbnail is defined
                color: color || '', // Ensure color is defined
                classification_id: classification_id || '', // Ensure classification_id is defined
                classifications: await getClassificationsFromModel() // Fetch classifications for the view
            });
        }

        // Validate year, price, and mileage ranges
        if (year < 1886 || year > new Date().getFullYear()) {
            req.flash('errorMessage', 'Year must be a valid year.');
            return res.render('inventory/add-inventory', {
                flashMessage: req.flash('errorMessage'),
                make: make || '',
                model: model || '',
                year: year || '',
                price: price || '',
                mileage: mileage || '',
                image: image || '',
                thumbnail: thumbnail || '',
                color: color || '',
                classification_id: classification_id || '',
                classifications: await getClassificationsFromModel()
            });
        }

        if (price < 0) {
            req.flash('errorMessage', 'Price must be a positive number.');
            return res.render('inventory/add-inventory', {
                flashMessage: req.flash('errorMessage'),
                make: make || '',
                model: model || '',
                year: year || '',
                price: price || '',
                mileage: mileage || '',
                image: image || '',
                thumbnail: thumbnail || '',
                color: color || '',
                classification_id: classification_id || '',
                classifications: await getClassificationsFromModel()
            });
        }

        if (mileage < 0) {
            req.flash('errorMessage', 'Mileage must be a positive number.');
            return res.render('inventory/add-inventory', {
                flashMessage: req.flash('errorMessage'),
                make: make || '',
                model: model || '',
                year: year || '',
                price: price || '',
                mileage: mileage || '',
                image: image || '',
                thumbnail: thumbnail || '',
                color: color || '',
                classification_id: classification_id || '',
                classifications: await getClassificationsFromModel()
            });
        }

        // Save the inventory item to the database
        await saveInventoryToDatabase(make, model, year, price, mileage, classification_id, image, thumbnail, color);
        console.log(`Inserted Inventory Item: ${make}, ${model}, ${year}, ${price}, ${mileage}, ${classification_id}, ${image}, ${thumbnail}, ${color}`);

        req.flash('message', 'Inventory item added successfully!');
        res.redirect(`/inventory/classification/${classification_id}`); // Redirect to the new classification view
    } catch (error) {
        console.error('Error adding inventory:', error); // Log the error for debugging
        req.flash('errorMessage', 'An error occurred while adding the inventory item. Please try again.');
        return res.render('inventory/add-inventory', {
            flashMessage: req.flash('errorMessage'),
            make: make || '', // Ensure make is defined
            model: model || '', // Ensure model is defined
            year: year || '', // Ensure year is defined
            price: price || '', // Ensure price is defined
            mileage: mileage || '', // Ensure mileage is defined
            image: image || '', // Ensure image is defined
            thumbnail: thumbnail || '', // Ensure thumbnail is defined
            color: color || '', // Ensure color is defined
            classification_id: classification_id || '', // Ensure classification_id is defined
            classifications: await getClassificationsFromModel() // Fetch classifications for the view
        });
    }
}

// Function to add a new classification
async function addClassification(req, res, next) {
    try {
        const { classificationName } = req.body;

        // Server-side validation
        if (!classificationName) {
            req.flash('errorMessage', 'Classification name is required.');
            return res.render('inventory/add-classification', {
                flashMessage: req.flash('errorMessage'),
                classificationName: classificationName || ''
            });
        }

        // Save the classification to the database
        await saveClassificationToDatabase(classificationName);

        req.flash('message', 'Classification added successfully!');
        res.redirect('/inventory/management'); // Redirect to management view
    } catch (error) {
        console.error('Error adding classification:', error);
        req.flash('errorMessage', 'An error occurred while adding the classification. Please try again.');
        return res.render('inventory/add-classification', {
            flashMessage: req.flash('errorMessage'),
            classificationName: classificationName || ''
        });
    }
}

// Fetch inventory list by classification ID
async function getInventoryByClassification(req, res, next) {
    const classificationId = req.params.classificationId;
    try {
        const inventory = await getInventoryFromModel(classificationId);
        console.log('Fetched Inventory Data:', inventory); // Log the fetched inventory data
        if (!inventory || inventory.length === 0) {
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
        console.error('Error fetching inventory by classification:', error); // Log the error for debugging
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
    addInventory,
    addClassification, // Ensure this function is exported
    getInventoryByClassification,
    getClassificationsFromModel, // Export the function
    renderManagementView // Export the new function
};
