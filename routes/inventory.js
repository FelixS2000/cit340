const express = require('express');
const { checkAuth, checkAdmin, checkEmployeeOrAdmin } = require('../utilities/authMiddleware');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const db = require('../database/connection');

// Route to access inventory management view
router.get('/management', async (req, res) => {
    console.log("✅ GET /inventory/management route hit!");
    try {
        const classifications = await inventoryController.getClassificationsFromModel();
        res.render('inventory/management', { title: 'Inventory Management', classifications });
    } catch (error) {
        console.error('Error fetching classifications:', error);
        res.status(500).send('An error occurred while fetching classifications');
    }
});

// Route to get a specific classification and its inventory
router.get('/classification/:id', async (req, res) => {
    console.log(`✅ GET /inventory/classification/${req.params.id} route hit!`);
    const classificationId = req.params.id;

    try {
        const classificationResult = await db.query('SELECT * FROM classification WHERE classification_id = $1', [classificationId]);
        const inventoryResult = await db.query('SELECT * FROM inventory WHERE classification_id = $1', [classificationId]);

        if (classificationResult.rows.length === 0) {
            const errorMessage = 'Classification not found';
            return res.render('inventory/classification', {
                title: 'Classification Details',
                errorMessage,
            });
        }

        const classification = classificationResult.rows[0];
        const inventory = inventoryResult.rows;

        console.log('Fetched Classification:', classification);
        console.log('Fetched Inventory:', inventory);

        res.render('inventory/classification', {
            title: 'Classification Details',
            classification,
            inventory,
            errorMessage: undefined, // Ensure errorMessage is not passed as undefined
        });
    } catch (error) {
        console.error('❌ Error retrieving classification:', error);
        const errorMessage = 'An error occurred while fetching classification';
        res.render('inventory/classification', {
            title: 'Classification Details',
            errorMessage,
        });
    }
});

// Other routes...

module.exports = router;
