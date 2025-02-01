const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route for vehicle details
router.get('/vehicle/:id', inventoryController.getVehicleDetails);

// Route for management view
router.get('/management', inventoryController.renderManagementView);

// Route for adding classification (GET) without ID
router.get('/add-classification', (req, res) => {
    res.render('inventory/add-classification', {
        title: 'Add Classification',
        errors: null,
        classificationName: '',
        id: null
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
            classification_id: '',
            color: '', // Add color variable
            classifications: classifications
        });
    } catch (error) {
        next(error);
    }
});

router.post('/add-inventory', 
    inventoryController.addInventory
);

// New route for inventory display
router.get('/inventory-display', async (req, res, next) => {
    try {
        const inventory = await inventoryController.getAllInventory(); // Adjust this to fetch all inventory
        res.render('inventory/inventory-display', {
            title: 'Inventory List',
            inventory: inventory
        });
    } catch (error) {
        next(error);
    }
});

// New route for classification inventory
router.post('/classification/:id', async (req, res, next) => {
    const id = req.params.id;
    const { make, model, year, price, mileage, description, image, thumbnail, classification_id } = req.body;

    try {
        await inventoryController.addInventoryItem({
            id,
            make,
            model,
            year,
            price,
            mileage,
            description,
            image,
            thumbnail,
            classification_id
        });

        res.redirect('/inventory/management');
    } catch (error) {
        next(error);
    }
});

// Route for classification inventory
router.get('/classification/:classificationId', inventoryController.getInventoryByClassification);

module.exports = router;
