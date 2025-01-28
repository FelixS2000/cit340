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

// Route for login (GET)
router.get('/login', (req, res) => {
    res.render('login', { errors: null }); // Render the login view
});

// Route for login (POST)
router.post('/login', inventoryController.loginUser); // Add this line for login processing

// Route for classification inventory
router.get('/classification/:classificationId', inventoryController.getInventoryByClassification);

module.exports = router;
