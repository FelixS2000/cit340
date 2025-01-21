// controllers/inventoryController.js

const inventoryModel = require('../models/inventoryModel');
const utilities = require('../utilities/index');

exports.getVehicleDetails = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const vehicleData = await inventoryModel.getVehicleById(vehicleId);
        
        if (!vehicleData) {
            return res.status(404).render('error', { message: 'Vehicle not found' });
        }

        const vehicleHTML = utilities.wrapVehicleDetailsInHTML(vehicleData);
        res.render('inventory/detail', { vehicleHTML });
    } catch (error) {
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
};