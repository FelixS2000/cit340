const pool = require('../database/connection'); // Updated to import from connection.js

// Fetch classifications from the database
async function getClassificationsFromModel() {
    try {
        const query = `SELECT classification_id, classification_name FROM classification ORDER BY classification_name ASC`;
        const result = await pool.query(query);
        return result.rows; // Return all classifications
    } catch (error) {
        console.error('Error fetching classifications:', error.message);
        throw error;
    }
}

// Fetch vehicle details by ID
async function getVehicleById(vehicleId) {
    try {
        const query = `
            SELECT 
                inv_id AS id, 
                inv_make AS make, 
                inv_model AS model, 
                inv_year AS year, 
                inv_description AS description, 
                inv_image AS image, 
                inv_thumbnail AS thumbnail, 
                inv_price AS price, 
                inv_miles AS mileage, 
                inv_color AS color, 
                classification_id 
            FROM inventory 
            WHERE inv_id = $1
        `;
        const result = await pool.query(query, [vehicleId]);
        return result.rows[0] || null; // Return the first row or null if no record exists
    } catch (error) {
        console.error('Error fetching vehicle data:', error.message, 'Details:', error);
        throw error;
    }
}

// Function to save a new inventory item
async function saveInventoryToDatabase(make, model, year, price, mileage, classification_id, description, image, thumbnail, color) {
    try {
        const sql = `
            INSERT INTO inventory (inv_make, inv_model, inv_year, inv_price, inv_miles, classification_id, inv_description, inv_image, inv_thumbnail, inv_color)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        await pool.query(sql, [make, model, year, price, mileage, classification_id, description, image, thumbnail, color]);
    } catch (error) {
        console.error('Error saving inventory item:', error.message);
        throw error;
    }
}

// Function to save a new classification
async function saveClassificationToDatabase(classificationName) {
    try {
        const sql = `
            INSERT INTO classification (classification_name)
            VALUES ($1)
        `;
        await pool.query(sql, [classificationName]);
    } catch (error) {
        console.error('Error saving classification:', error.message);
        throw error;
    }
}

// Fetch inventory by classification ID
async function getInventoryByClassification(classificationId) {
    try {
        const query = `
            SELECT 
                inv_id AS id, 
                inv_image as image,
                inv_make AS make, 
                inv_model AS model, 
                inv_year AS year, 
                inv_price AS price, 
                inv_miles AS mileage, 
                inv_color AS color,
                inv_description AS description
            FROM inventory 
            WHERE classification_id = $1
        `;
        const result = await pool.query(query, [classificationId]);
        return result.rows; // Return all inventory items for the classification
    } catch (error) {
        console.error('Error fetching inventory by classification:', error.message);
        throw error;
    }
}
async function addInventory(req, res, next) {
    // Add a new inventory item
    try {
        console.log('Request Body:', req.body); // Log the request body for debugging

        const { make, model, year, price, mileage, classification_id, description, image, thumbnail, color } = req.body;

        // Server-side validation
        if (!make || !model || !year || !price || !mileage || !description || !image || !thumbnail || !color || isNaN(year) || isNaN(price) || isNaN(mileage)) {
            req.flash('errorMessage', 'All fields are required and must be valid.');
            return res.render('inventory/add-inventory', {
                flashMessage: req.flash('errorMessage'),
                make: make || '', // Ensure make is defined
                model: model || '', // Ensure model is defined
                year: year || '', // Ensure year is defined
                price: price || '', // Ensure price is defined
                mileage: mileage || '', // Ensure mileage is defined
                description: description || '', // Ensure description is defined
                image: image || '', // Ensure image is defined
                thumbnail: thumbnail || '', // Ensure thumbnail is defined
                color: color || '', // Ensure color is defined
                classification_id: classification_id || '', // Ensure classification_id is defined
                classifications: await getClassificationsFromModel() // Fetch classifications for the view
            });
        }

        // Save the inventory item to the database
        await saveInventoryToDatabase(make, model, year, price, mileage, classification_id, description, image, thumbnail, color);

        req.flash('message', 'Inventory item added successfully!');
        res.redirect('/inventory/management'); // Redirect to management view
    } catch (error) {
        console.error('Error adding inventory:', error); // Log the error for debugging
        req.flash('errorMessage', 'An error occurred while adding the inventory item. Please try again.');
        return res.render('inventory/add-inventory', {
            flashMessage: req.flash('errorMessage'),
            make: make || '', // Ensure make is defined
            model: model || '', // Ensure model is defined
            year: year || '', // Ensure year is defined
            price: price || '', // Ensure price is defined
            mileage: mileage || '', // Ensure mileage is defined
            description: description || '', // Ensure description is defined
            image: image || '', // Ensure image is defined
            thumbnail: thumbnail || '', // Ensure thumbnail is defined
            color: color || '', // Ensure color is defined
            classification_id: classification_id || '', // Ensure classification_id is defined
            classifications: await getClassificationsFromModel() // Fetch classifications for the view
        });
    }
}
// Fetch all inventory items
async function getAllInventory() {
    try {
        const query = `SELECT * FROM inventory`; // Adjust this query as needed
        const result = await pool.query(query);
        return result.rows; // Return all inventory items
    } catch (error) {
        console.error('Error fetching all inventory:', error.message);
        throw error;
    }
}
// Export the functions
module.exports = {
    addInventory: addInventory,
    getVehicleById: getVehicleById,
    getAllInventory: getAllInventory,
    getClassificationsFromModel: getClassificationsFromModel,
    saveInventoryToDatabase: saveInventoryToDatabase,
    saveClassificationToDatabase: saveClassificationToDatabase, // Export the new function
    getInventoryByClassification: getInventoryByClassification, // Export the new function
};
