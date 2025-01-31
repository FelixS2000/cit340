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
        if (!classifications) {
            throw new Error('Classifications could not be fetched');
        }

        res.render('inventory/add-inventory', {
            title: 'Add Inventory', // Pass the title variable
            errors: null,
            make: '', 
            model: '', 
            year: '',
            price: '',
            mileage: '',
            description: '', // Add description
            image: '', // Add image
            thumbnail: '', // Add thumbnail
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

// New route for classification inventory
router.post('/classification/:id', async (req, res, next) => {
    const id = req.params.id;
    const { make, model, year, price, mileage, description, image, thumbnail, classification_id } = req.body;

    try {
        // Logic to add the inventory item to the database
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

        // Redirect or render a success message
        res.redirect('/inventory/management'); // Redirect to management view after successful addition
    } catch (error) {
        next(error); // Handle errors
    }
});

// Route for classification inventory
router.get('/classification/:classificationId', inventoryController.getInventoryByClassification);

module.exports = router;
