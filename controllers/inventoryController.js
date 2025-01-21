// Fetch vehicle details by ID
const { getVehicleById } = require('../models/inventoryModel');
const { buildVehicleHTML } = require('../utilities/index');

// Fetch vehicle details by ID
async function getVehicleDetails(req, res, next) {
    try {
        const vehicleId = req.params.vehicleId;
        const vehicle = await getVehicleById(vehicleId);

        if (!vehicle) {
            return res.status(404).render('errors/404', { 
                title: 'Vehicle Not Found', 
                message: 'The requested vehicle does not exist.' 
            });
        }

        const vehicleHTML = buildVehicleHTML(vehicle);

        res.render('inventory/detail', {
            title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            vehicleHTML,
        });
    } catch (error) {
        next(error);
    }
}


// Fetch inventory list by classification ID
async function getInventoryByClassification(req, res, next) {
    try {
        const classificationId = req.params.classificationId;
        const inventory = await getClassificationFromModel(classificationId);

        if (!inventory.length) {
            return res.status(404).render('errors/404', { 
                title: 'No Inventory Found', 
                message: 'No vehicles found for this classification.' 
            });
        }

        res.render('inventory/classification', {
            title: 'Inventory',
            inventory,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getVehicleDetails,
    getInventoryByClassification,
};
