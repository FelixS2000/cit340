// Existing imports
const pool = require('../database/connection'); // Updated to import from connection.js

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

// Check for existing email
async function checkExistingEmail(account_email) {
    try {
        const sql = "SELECT * FROM users WHERE email = $1"; // Adjust table name as necessary
        const email = await pool.query(sql, [account_email]);
        return email.rowCount > 0; // Return true if email exists
    } catch (error) {
        console.error('Error checking existing email:', error.message);
        throw error;
    }
}

// Fetch inventory by classification ID
async function getInventoryByClassification(classificationId) {
    try {
        const query = `
            SELECT 
                inv_id AS id, 
                inv_make AS make, 
                inv_model AS model, 
                inv_year AS year, 
                inv_description AS description, 
                inv_price AS price, 
                inv_thumbnail AS thumbnail,
                inv_miles AS mileage,
                inv_color AS color
            FROM inventory 
            WHERE classification_id = $1
        `;
        const result = await pool.query(query, [classificationId]);

        return result.rows;
    } catch (error) {
        console.error('Error fetching inventory data:', error.message, 'Details:', error);
        throw error;
    }
}

module.exports = {
    getVehicleById,
    checkExistingEmail,
    getInventoryByClassification,
};
