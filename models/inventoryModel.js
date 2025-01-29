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
async function saveInventoryToDatabase(make, model, year, price, mileage, classification_id, description) {
    try {
        const sql = `
            INSERT INTO inventory (inv_make, inv_model, inv_year, inv_price, inv_miles, classification_id, inv_description)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await pool.query(sql, [make, model, year, price, mileage, classification_id, description]);
    } catch (error) {
        console.error('Error saving inventory item:', error.message);
        throw error;
    }
}

// Other functions remain unchanged...

module.exports = {
    getVehicleById,
    getClassificationsFromModel,
    saveInventoryToDatabase,
    // Other exports...
};
