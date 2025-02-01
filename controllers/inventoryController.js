const { 
    getVehicleById, 
    getInventoryByClassification: getInventoryFromModel, 
    saveUserToDatabase, 
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
        if (!inventory) {
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
                classification_id: classification_id || '',
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
            classification_id: classification_id || '',
            description: description || '',
            image: image || '',
            thumbnail: thumbnail || '',
            color: color || '',
            classifications: await getClassificationsFromModel() // Fetch classifications for the view
        });
    }
}

// Other functions remain unchanged...

module.exports = {
    getVehicleDetails,
    fetchAllInventory,
    addClassification,
    addInventory,
    getInventoryByClassification,
    getClassificationsFromModel,
    renderManagementView
};
