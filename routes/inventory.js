const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

const utilities = require('../utilities/index'); // Import utilities for error handling

// Route for vehicle details

router.get('/vehicle/:id', inventoryController.getVehicleDetails);

// Route for management view
router.get('/management', async (req, res, next) => {
    try {
        const classifications = await inventoryController.getClassificationsFromModel();
        res.render('inventory/management', {
            title: 'Inventory Management',
            classifications: classifications // Pass classifications to the view
        });
    } catch (error) {
        console.error('Error rendering management view:', error);
        next(error);
    }
});

// New route for fetching inventory by classification
router.get("/getInventory/:classification_id", utilities.handleErrors(inventoryController.getInventoryJSON));

router.get('/add-classification', (req, res) => {
    res.render('inventory/add-classification', {
        title: 'Add Classification',
        errors: null,
        classificationName: ''
    });
});

router.post('/add-classification', 
    inventoryController.addClassification
);

// Route for adding inventory (GET)
router.get('/add-inventory', async (req, res, next) => {
    try {
        const classifications = await inventoryController.getClassificationsFromModel();
        if (!classifications) {
            throw new Error('Classifications could not be fetched');
        }

        const classification_id = req.query.classification_id || null; // Get classification_id from query

        res.render('inventory/add-inventory', {
            title: 'Add Inventory',
            errors: null,
            make: '', 
            model: '', 
            year: '',
            price: '',
            mileage: '',
            description: '',
            image: '',
            thumbnail: '',
            color: '',
            classifications: classifications,
            classification_id: classification_id // Pass classification_id to the template
        });
    } catch (error) {
        next(error);
    }
});

router.post('/add-inventory', inventoryController.addInventory);

router.get('/inventory-display', inventoryController.fetchAllInventory);

// Route for classification inventory
router.get('/classification/:classificationId', inventoryController.getInventoryByClassification);

module.exports = router;
