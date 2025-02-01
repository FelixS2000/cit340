const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route for vehicle details
router.get('/vehicle/:id', inventoryController.getVehicleDetails);

// Route for management view
router.get('/management', inventoryController.renderManagementView);

// Route for adding classification (GET)
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
            classifications: classifications
        });
    } catch (error) {
        next(error);
    }
});

router.post('/add-inventory', 
    inventoryController.addInventory
);

router.get('/inventory-display', inventoryController.fetchAllInventory);


// Route for classification inventory
router.get('/classification/:classificationId', inventoryController.getInventoryByClassification);

module.exports = router;
