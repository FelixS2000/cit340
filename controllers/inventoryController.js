const inventoryModel = require('../models/inventoryModel');
const utilities = require('../utilities/index');

async function getVehicleDetails(req, res, next) {
    try {
        const vehicleId = req.params.id;
        const vehicleData = await inventoryModel.getVehicleById(vehicleId);
        if (!vehicleData) {
            return res.status(404).render('errors/404', { title: 'Not Found' });
        }
        const vehicleHTML = utilities.buildVehicleHTML(vehicleData);
        res.render('inventory/detail', {
            title: `${vehicleData.make} ${vehicleData.model}`,
            vehicleData,
            vehicleHTML
        });
    } catch (err) {
        next(err); // Pass error to middleware
    }
}

module.exports = { getVehicleDetails };
