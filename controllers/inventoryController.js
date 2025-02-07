const { 
    getVehicleById, 
    getInventoryByClassification: getInventoryFromModel, 
    saveClassificationToDatabase, 
    saveInventoryToDatabase, 
    getClassificationsFromModel,
    getAllInventory 
} = require('../models/inventoryModel');

const { buildVehicleHTML } = require('../utilities/index');
const bcrypt = require("bcryptjs"); // Import bcrypt

// Function to fetch all inventory items
async function fetchAllInventory(req, res, next) {
    try {
        const inventory = await getAllInventory(); // Call the correct function to fetch all inventory
        if (!inventory || inventory.length === 0) {
            return res.status(404).render('errors/404', { 
                title: 'No Inventory Found', 
                message: 'No inventory items available.' 
            });
        }
        res.render('inventory/inventory-display', {
            title: 'Inventory List',
            inventory: inventory
        });
    } catch (error) {
        console.error('Error fetching all inventory:', error); // Log the error for debugging
        next(error);
    }
}

// Function to add a new classification
async function addClassification(req, res, next) {
    try {
        const { classificationName } = req.body;

        // Server-side validation
        if (!classificationName || /\s|[!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|]/.test(classificationName)) {
            req.flash('errorMessage', 'Classification name is required and cannot contain spaces or special characters.');
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

// Function to add a new inventory item
async function addInventory(req, res, next) {
    try {
        const { make, model, year, price, mileage, classification_id, description, image, thumbnail, color } = req.body;

        // Server-side validation
        if (!make || !model || !year || !price || !mileage || !classification_id || !description || !image || !thumbnail || !color) {
            req.flash('errorMessage', 'All fields are required.');
            return res.render('inventory/add-inventory', {
                flashMessage: req.flash('errorMessage'),
                make: make || '',
                model: model || '',
                year: year || '',
                price: price || '',
                mileage: mileage || '',
                classification_id: classification_id || '', // Ensure this is passed
                description: description || '',
                image: image || '',
                thumbnail: thumbnail || '',
                color: color || '',
                classifications: await getClassificationsFromModel() // Fetch classifications for the view
            });
        }

        // Save the inventory item to the database
        await saveInventoryToDatabase(make, model, year, price, mileage, classification_id, description, image, thumbnail, color);
        req.flash('message', 'Inventory item added successfully!');
        res.redirect('/inventory/management'); // Redirect to management view
    } catch (error) {
        console.error('Error adding inventory:', error);
        req.flash('errorMessage', 'An error occurred while adding the inventory item. Please try again.');
        return res.render('inventory/add-inventory', {
            flashMessage: req.flash('errorMessage'),
            make: make || '',
            model: model || '',
            year: year || '',
            price: price || '',
            mileage: mileage || '',
            classification_id: classification_id || '', // Ensure this is passed
            description: description || '',
            image: image || '',
            thumbnail: thumbnail || '',
            color: color || '',
            classifications: await getClassificationsFromModel() // Fetch classifications for the view
        });
    }
}

// Function to fetch vehicle details by ID
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

// Function to render management view
async function renderManagementView(req, res, next) {
    try {
        const classifications = await getClassificationsFromModel();
        res.render('inventory/management', {
            title: 'Inventory Management',
            classifications: classifications
        });
    } catch (error) {
        console.error('Error rendering management view:', error);
        next(error);
    }
}

// Function to fetch inventory by classification
async function getInventoryByClassification(req, res, next) {
    console.log('Fetching inventory for classification ID:', req.params.classificationId); // Log the classification ID

    try {
        const classificationId = req.params.classificationId;
        const inventory = await getInventoryFromModel(classificationId); // Fetch the inventory data

        console.log('Inventory data:', JSON.stringify(inventory, null, 2)); // Log the inventory data

        if (!inventory || inventory.length === 0) {
            return res.status(404).render('errors/404', { 
                title: 'No Inventory Found', 
                message: 'No inventory items found for this classification.' 
            });
        }

        res.render('inventory/classification', {
            title: 'Inventory by Classification',
            inventory: inventory,
            classificationId: classificationId
        });
    } catch (error) {
        console.error('Error fetching inventory by classification:', error);
        next(error);
    }
}



module.exports = {
    getVehicleDetails,
    fetchAllInventory,
    addClassification,
    addInventory,
    getInventoryByClassification,
    getClassificationsFromModel,
    renderManagementView
};
