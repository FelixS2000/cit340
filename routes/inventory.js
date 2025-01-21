const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route for vehicle details
router.get('/vehicle/:id', inventoryController.getVehicleDetails);
router.get('/vehicle', inventoryController.getVehicleDetails);
router.get('/details/:vehicleId', inventoryController.getVehicleDetails);

// Route for classification inventory
router.get('/classification/:classificationId', inventoryController.getInventoryByClassification);

module.exports = router;
