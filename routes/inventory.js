const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route for vehicle details
router.get('/vehicle/:id', inventoryController.getVehicleDetails);

// Route for management view
router.get('/management', (req, res) => {
    res.render('inventory/management', { 
        flashMessage: req.flash('message'),
        title: 'Inventory Management' // Pass the title variable
    }); // Render management view
});

// Route for adding classification (GET)
router.get('/add-classification', (req, res) => {
    res.render('inventory/add-classification', {
        title: 'Add Classification', // Pass the title variable
        errors: null,
        classificationName: '' // Pass an empty string for classificationName
    }); // Render add classification view
});

router.post('/add-classification', 
    inventoryController.addClassification
);

// Route for adding inventory (GET)
router.get('/add-inventory', async (req, res, next) => {
    try {
        const classifications = await inventoryController.getClassificationsFromModel(); // Ensure this function is defined in your model
        res.render('inventory/add-inventory', {
            title: 'Add Inventory', // Pass the title variable
            errors: null,
            make: '', 
            model: '', 
            year: '',
            price: '',
            mileage: '',
            classification_id: '',
            classifications: classifications // Pass classifications to the view
        });
    } catch (error) {
        next(error);
    }
});

router.post('/add-inventory', 
    inventoryController.addInventory
);

// Route for classification inventory
router.get('/classification/:classificationId', inventoryController.getInventoryByClassification);

module.exports = router;
