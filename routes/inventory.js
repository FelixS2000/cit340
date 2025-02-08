const express = require('express');
const { checkAuth, checkAdmin, checkEmployeeOrAdmin } = require('../utilities/authMiddleware');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const db = require('../database/connection');

// Route to access inventory management view
router.get('/management', async (req, res) => {
    console.log("✅ GET /inventory/management route hit!");
    try {
        const classifications = await db.query('SELECT * FROM classification');
        res.render('inventory/management', { title: 'Inventory Management', classifications: classifications.rows });
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
            return res.status(404).send('Classification not found');
        }

        const classification = classificationResult.rows[0];
        const inventory = inventoryResult.rows;

        console.log('Fetched Classification:', classification);
        console.log('Fetched Inventory:', inventory);

        res.render('inventory/classification', {
            title: 'Classification Details',
            classification,
            inventory
        });
    } catch (error) {
        console.error('❌ Error retrieving classification:', error);
        res.status(500).send('An error occurred while fetching classification');
    }
});

// Route to view a specific inventory item
router.get('/inventory/:id', checkEmployeeOrAdmin, async (req, res) => {
    const inventoryId = req.params.id;

    try {
        const inventoryItem = await db.query('SELECT * FROM inventory WHERE inv_id = $1', [inventoryId]);
        if (inventoryItem.rows.length > 0) {
            res.render('inventory/item', { title: 'Inventory Item Details', item: inventoryItem.rows[0] });
        } else {
            res.status(404).send('Inventory item not found');
        }
    } catch (error) {
        console.error('Error retrieving inventory item:', error);
        res.status(500).send('An error occurred while retrieving the inventory item');
    }
});

// Route to add a new classification
router.post('/add-classification', checkEmployeeOrAdmin, async (req, res) => {
    const { classificationName } = req.body;

    try {
        await db.query('INSERT INTO classification (classification_name) VALUES ($1)', [classificationName]);
        req.flash('message', 'Classification added successfully!');
        return res.redirect('/inventory/management');
    } catch (error) {
        req.flash('errorMessage', 'An error occurred while adding the classification. Please try again.');
        return res.redirect('/inventory/management');
    }
});

// Route to add a new inventory item
router.post('/add-inventory', checkEmployeeOrAdmin, async (req, res) => {
    const { itemName, classificationId, price, mileage, color, description } = req.body;

    try {
        await db.query(
            'INSERT INTO inventory (item_name, classification_id, price, mileage, color, description) VALUES ($1, $2, $3, $4, $5, $6)',
            [itemName, classificationId, price, mileage, color, description]
        );
        req.flash('message', 'Inventory item added successfully!');
        return res.redirect('/inventory/management');
    } catch (error) {
        req.flash('errorMessage', 'An error occurred while adding the inventory item. Please try again.');
        return res.redirect('/inventory/management');
    }
});

// ✅ Add this missing route
router.get("/inventory-display", inventoryController.getInventoryDisplay);

// Route to edit an inventory item
router.post('/edit/:id', checkEmployeeOrAdmin, async (req, res) => {
    const inventoryId = req.params.id;
    const { itemName, price, mileage, color, description } = req.body;

    try {
        await db.query(
            'UPDATE inventory SET item_name = $1, price = $2, mileage = $3, color = $4, description = $5 WHERE inv_id = $6',
            [itemName, price, mileage, color, description, inventoryId]
        );
        req.flash('message', 'Inventory item updated successfully!');
        return res.redirect('/inventory/management');
    } catch (error) {
        req.flash('errorMessage', 'An error occurred while updating the inventory item. Please try again.');
        return res.redirect('/inventory/management');
    }
});

// Route to delete an inventory item
router.delete('/delete/:id', checkEmployeeOrAdmin, async (req, res) => {
    const inventoryId = req.params.id;
    try {
        await db.query('DELETE FROM inventory WHERE inv_id = $1', [inventoryId]);
        res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ error: 'An error occurred while deleting the inventory item' });
    }
});

module.exports = router;
