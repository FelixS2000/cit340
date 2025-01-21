// routes/inventory.js

const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route to get vehicle details by ID
router.get('/inventory/:id', inventoryController.getVehicleDetails);
router.get('/detail/:id', inventoryController.getVehicleDetails);

module.exports = router;