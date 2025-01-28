const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const regValidate = require('../utilities/account-validation');

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
    res.render('inventory/management', { flashMessage: req.flash('message') }); // Render management view
});

// Route for adding classification (GET)
router.get('/add-classification', (req, res) => {
    res.render('inventory/add-classification', { errors: null }); // Render add classification view
});

// Route for adding classification (POST)
router.post('/add-classification', inventoryController.addClassification);

// Route for adding inventory (GET)
router.get('/add-inventory', (req, res) => {
    res.render('inventory/add-inventory', { errors: null }); // Render add inventory view
});

// Route for adding inventory (POST)
router.post('/add-inventory', inventoryController.addInventory);

// Route for classification inventory
router.get('/classification/:classificationId', inventoryController.getInventoryByClassification);

module.exports = router;
