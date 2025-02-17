const express = require('express');
const router = express.Router();
const { getApprovedClassifications } = require("../models/classificationModel");
const reviewController = require('../controllers/reviewController'); // Import review controller

const db = require('../database/connection');

const authMiddleware = require("../utilities/authMiddleware");

// Route to display inventory
router.get('/inventory-display', async (req, res) => {
    console.log(" GET /inventory/inventory-display route hit!");
    try {
        const inventoryResult = await db.query('SELECT * FROM public.inventory');
        const inventory = inventoryResult.rows;

        console.log("Fetched Inventory:", inventory); // Debugging line

        const flashMessage = req.flash('message');
        res.render('inventory/inventory-display', { title: 'Inventory Display', inventory, flashMessage });
    } catch (error) {
        console.error('Error fetching inventory:', error);
    res.status(500).send('An error occurred while fetching inventory'); 
    return; // Ensure no further processing occurs after sending the response

    }
});

router.get('/inventory/:id', async (req, res) => {
    const invId = req.params.id;
    try {
        const inventoryItem = await db.query('SELECT * FROM inventory WHERE inv_id = $1', [invId]);
        const reviewResult = await db.query('SELECT * FROM reviews WHERE inv_id = $1 ORDER BY review_date DESC', [invId]);
        const reviews = reviewResult.rows;

        res.render('inventory/detail', { inventoryItem: inventoryItem.rows[0], reviews }); // Render the detail view with inventory item and reviews
    } catch (error) {
        console.error('Error fetching inventory item details:', error);
        res.status(500).send('Error fetching inventory item details');
    }
});

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

// Management view route for inventory
router.get("/management", (req, res) => {
    res.render("inventory/management", {
        title: "Vehicle Management",
        flashMessage: req.flash("message")
    });
});

// Add Classification form route
router.get("/add-classification", (req, res) => {
    res.render("inventory/add-classification", {
        title: "Add Classification",
        flashMessage: req.flash("message")
    });
});

// Add Classification processing route
router.post("/add-classification", async (req, res) => {
    try {
        const { classificationName } = req.body;
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
        await db.query(sql, [classificationName]);
        req.flash("success", "Classification added successfully");
        res.redirect("/inventory/inventory-display");
    } catch (error) {
        console.error("Error adding classification:", error);
        req.flash("error", "Failed to add classification"); 
        return res.redirect("/inventory/add-classification"); // Ensure no further processing occurs after sending the response

    }
});

// Add Inventory form route
router.get("/add-inventory", async (req, res) => {
    try {
        // Get classifications for the dropdown
        const result = await db.query("SELECT * FROM classification ORDER BY classification_name");
        res.render("inventory/add-inventory", {
            title: "Add Vehicle",
            classifications: result.rows,
            flashMessage: req.flash("message"),
            // Initialize empty values for the form
            make: '', model: '', year: '', price: '', 
            mileage: '', description: '', image: '', 
            thumbnail: '', color: '', classification_id: ''
        });
    } catch (error) {
        console.error("Error loading add inventory form:", error);
        req.flash("error", "Error loading form"); 
        return res.redirect("/inventory/inventory-display"); // Ensure no further processing occurs after sending the response

    }
});

// Add Inventory processing route
router.post("/add-inventory", async (req, res) => {
    try {
        const {
            make, model, year, price, mileage,
            classification_id, description, image,
            thumbnail, color
        } = req.body;

        const sql = `
            INSERT INTO inventory (
                inv_make, inv_model, inv_year, inv_description,
                inv_image, inv_thumbnail, inv_price, inv_miles,
                inv_color, classification_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;

        await db.query(sql, [
            make, model, year, description,
            image, thumbnail, price, mileage,
            color, classification_id
        ]);

        req.flash("success", "Vehicle added successfully");
        res.redirect("/inventory/add-inventory");
    } catch (error) {
        console.error("Error adding inventory:", error);
        req.flash("error", "Failed to add vehicle");
        res.redirect("/inventory/add-inventory");
    }
});

// Review routes
router.post('/reviews', reviewController.createReview); // Route to create a review
router.get('/reviews/:id', async (req, res) => {
    try {
        const invId = req.params.id;
        const reviewResult = await db.query('SELECT * FROM reviews WHERE inv_id = $1', [invId]);
        const reviews = reviewResult.rows;

        res.render('review/reviews', { invId, reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('An error occurred while fetching reviews');
    }
});


router.put('/reviews', reviewController.updateReview); // Route to update a review
router.delete('/reviews/:id', reviewController.deleteReview); // Route to delete a review

router.get('/navigation', async (req, res) => {
    const classifications = await classificationModel.getApprovedClassifications();
    res.render('partials/navigation', { classifications });
});

router.get('/login', authMiddleware.ensureEmployeeOrAdmin, (req, res) => {
    res.render('account/login', { title: 'Login' });
});

module.exports = router;
