const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const regValidate = require('../utilities/account-validation'); // Ensure this line is only declared once

// Route for vehicle details
router.get('/vehicle/:id', inventoryController.getVehicleDetails);

// Route for registration (GET)
router.get('/registration', (req, res) => {
    res.render('registration', { errors: null }); // Render the registration view
});

// Route for registration (POST)
router.post('/register', 
    regValidate.registrationRules(), 
    regValidate.checkRegData, 
    inventoryController.registerUser
);

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
        errors: null,
        classificationName: '' // Pass an empty string for classificationName
    }); // Render add classification view
});

router.post('/add-classification', 
    regValidate.classificationRules(), // Add validation middleware
    inventoryController.addClassification
);

// Route for adding inventory (GET)
router.get('/add-inventory', async (req, res) => {
    try {
        const classifications = await getClassificationsFromModel(); // Ensure this function is defined in your model
        res.render('inventory/add-inventory', { 
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
    regValidate.inventoryRules(), // Add validation middleware
    inventoryController.addInventory
);

// Route for classification inventory
router.get('/classification/:classificationId', inventoryController.getInventoryByClassification);

module.exports = router;
