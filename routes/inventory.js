const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route for vehicle details
router.get('/vehicle/:id', inventoryController.getVehicleDetails);

// Route for registration (GET)
router.get('/registration', (req, res) => {
    res.render('registration'); // Render the registration view
});

// Route for registration (POST)
router.post('/register', inventoryController.registerUser);

// Route for classification inventory
router.get('/classification/:classificationId', inventoryController.getInventoryByClassification);

module.exports = router;
