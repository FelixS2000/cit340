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
        const inventory = await getAllInventory();
        if (!inventory || inventory.length === 0) {
            return res.status(404).render('errors/404', { 
                title: 'No Inventory Found', 
                message: 'No inventory items available.' 
            });
        }
        res.render('inventory/inventory-display', {
            title: 'Inventory List',
            inventory
        });
    } catch (error) {
        console.error('❌ Error fetching all inventory:', error);
        next(error);
    }
}

// Function to add a new classification
async function addClassification(req, res, next) {
    try {
        const { classificationName } = req.body;

        if (!classificationName || /\s|[!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|]/.test(classificationName)) {
            req.flash('errorMessage', 'Classification name is required and cannot contain spaces or special characters.');
            return res.render('inventory/add-classification', {
                flashMessage: req.flash('errorMessage'),
                classificationName: classificationName || ''
            });
        }

        await saveClassificationToDatabase(classificationName);
        req.flash('message', 'Classification added successfully!');
        res.redirect('/inventory/management');
    } catch (error) {
        console.error('❌ Error adding classification:', error);
        req.flash('errorMessage', 'An error occurred while adding the classification.');
        return res.render('inventory/add-classification', {
            flashMessage: req.flash('errorMessage'),
            classificationName: req.body.classificationName || ''
        });
    }
}

// Function to add a new inventory item
async function addInventory(req, res, next) {
    try {
        const { make, model, year, price, mileage, classification_id, description, image, thumbnail, color } = req.body;

        if (!make || !model || !year || !price || !mileage || !classification_id || !description || !image || !thumbnail || !color) {
            req.flash('errorMessage', 'All fields are required.');
            return res.render('inventory/add-inventory', {
                flashMessage: req.flash('errorMessage'),
                ...req.body,
                classifications: await getClassificationsFromModel()
            });
        }

        await saveInventoryToDatabase(make, model, year, price, mileage, classification_id, description, image, thumbnail, color);
        req.flash('message', 'Inventory item added successfully!');
        res.redirect('/inventory/management');
    } catch (error) {
        console.error('❌ Error adding inventory:', error);
        req.flash('errorMessage', 'An error occurred while adding the inventory item.');
        return res.render('inventory/add-inventory', {
            flashMessage: req.flash('errorMessage'),
            ...req.body,
            classifications: await getClassificationsFromModel()
        });
    }
}

// Function to fetch vehicle details by ID
async function getVehicleDetails(req, res, next) {
    try {
        const vehicleId = req.params.id;
        const vehicle = await getVehicleById(vehicleId);

        if (!vehicle) {
            return res.status(404).render('errors/404', { 
                title: 'Vehicle Not Found', 
                message: 'The requested vehicle does not exist.' 
            });
        }

        const vehicleHTML = buildVehicleHTML(vehicle);

        res.render('inventory/detail', {
            title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            vehicleHTML
        });
    } catch (error) {
        console.error('❌ Error fetching vehicle details:', error);
        next(error);
    }
}

const inventoryModel = require("../models/inventoryModel");
async function getInventoryDisplay(req, res, next) {
    try {
        console.log("✅ GET /inventory/inventory-display route hit!");

        // Fetch inventory data
        const inventory = await inventoryModel.getAllInventoryWithClassification();

        if (!inventory || inventory.length === 0) {
            req.flash("errorMessage", "No inventory items found.");
        }

        // ✅ Render the correct EJS view
        res.render("inventory/inventory-display", {
            title: "Inventory List",
            inventory: inventory || [], // Ensure an empty array if no data
            flashMessage: req.flash("message"),
            errorMessage: req.flash("errorMessage"),
        });

    } catch (error) {
        console.error("❌ Error fetching inventory:", error);
        next(error);
    }
}

// Function to render management view
async function renderManagementView(req, res, next) {
    try {
        const classifications = await getClassificationsFromModel();
        res.render('inventory/management', {
            title: 'Inventory Management',
            classifications
        });
    } catch (error) {
        console.error('❌ Error rendering management view:', error);
        next(error);
    }
}

// Function to fetch inventory by classification
async function getInventoryByClassification(req, res, next) {
    try {
        console.log("✅ GET /inventory/classification/:id route hit!");
        
        const classificationId = req.params.classificationId;
        const inventory = await inventoryModel.getInventoryByClassification(classificationId);
        const classifications = await inventoryModel.getClassificationsFromModel(); // Fetch classifications

        console.log("Fetched Inventory:", inventory); // Debugging
        
        if (!inventory || inventory.length === 0) {
            req.flash('errorMessage', 'No inventory items found for this classification.');
        }

        // ✅ Render EJS view and explicitly pass `inventory`
        res.render("inventory/classification", {
            title: "Inventory Classification",
            inventory: inventory || [],  // Ensure it's always an array
            classifications,
            flashMessage: req.flash('message'),
            errorMessage: req.flash('errorMessage')
        });

    } catch (error) {
        console.error("❌ Error fetching inventory by classification:", error);
        next(error);
    }
}


module.exports = {
    getVehicleDetails,
    getInventoryDisplay,
    fetchAllInventory,
    addClassification,
    addInventory,
    getInventoryByClassification,
    getClassificationsFromModel,
    renderManagementView
};
