const express = require('express');
const { checkAuth, checkAdmin, checkEmployeeOrAdmin } = require('../utilities/authMiddleware'); // Import the middleware
const router = express.Router();
const invModel = require('../models/inventoryModel');
const db = require('../database/connection'); // Import database connection

// Route to access inventory management view
router.get('/management', async (req, res) => {
    console.log("✅ GET /inventory/management route hit!"); // Debugging log
    try {
        const classifications = await db.query('SELECT * FROM classification');
        res.render('inventory/management', { title: 'Inventory Management', classifications: classifications.rows });
    } catch (error) {
        console.error('Error fetching classifications:', error);
        res.status(500).send('An error occurred while fetching classifications');
    }
});

router.get('/classification/:id', async (req, res) => {
    console.log(`✅ GET /inventory/classification/${req.params.id} route hit!`);
    const classificationId = req.params.id;
  
    try {
      const classification = await db.query('SELECT * FROM classification WHERE classification_id = $1', [classificationId]);
      const inventory = await db.query('SELECT * FROM inventory WHERE classification_id = $1', [classificationId]);
  
      if (classification.rows.length > 0) {
        res.render('inventory/classification', {
          title: 'Classification Details',
          classification: classification.rows[0],
          inventory: inventory.rows
        });
      } else {
        res.status(404).send('Classification not found');
      }
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
        return res.redirect('/inventory/management'); // Redirect to management view
    } catch (error) {
        req.flash('errorMessage', 'An error occurred while adding the classification. Please try again.');
        return res.redirect('/inventory/management'); // Redirect back to management view
    }
});

// Route to add a new inventory item
router.post('/add-inventory', checkEmployeeOrAdmin, async (req, res) => {
    const { itemName, classificationId } = req.body;

    try {
        await db.query('INSERT INTO inventory (item_name, classification_id) VALUES ($1, $2)', [itemName, classificationId]);
        req.flash('message', 'Inventory item added successfully!');
        return res.redirect('/inventory/management'); // Redirect to management view
    } catch (error) {
        req.flash('errorMessage', 'An error occurred while adding the inventory item. Please try again.');
        return res.redirect('/inventory/management'); // Redirect back to management view
    }
});

// Route to edit an inventory item
router.post('/edit/:id', checkEmployeeOrAdmin, (req, res) => {
    // Logic to edit inventory item
});

// Route to delete an inventory item
router.delete('/delete/:id', checkEmployeeOrAdmin, (req, res) => {
    // Logic to delete inventory item
});

module.exports = router;
