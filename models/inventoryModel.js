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

// Function to save a new classification
async function saveClassificationToDatabase(classificationName) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1)"; // Use 'classification'
        await pool.query(sql, [classificationName]);
    } catch (error) {
        console.error('Error saving classification:', error.message);
        throw error;
    }
}

// Function to fetch all classifications
async function getClassificationsFromModel() {
    try {
        const query = "SELECT classification_id, classification_name FROM classification"; // Use 'classification'
        const result = await pool.query(query);
        return result.rows; // Return the rows containing classifications
    } catch (error) {
        console.error('Error fetching classifications:', error.message);
        throw error;
    }
}

// Function to save a new inventory item
async function saveInventoryToDatabase(make, model, year, price, mileage, classification_id) {
    try {
        const sql = `
            INSERT INTO inventory (inv_make, inv_model, inv_year, inv_price, inv_miles, classification_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        await pool.query(sql, [make, model, year, price, mileage, classification_id]);
    } catch (error) {
        console.error('Error saving inventory item:', error.message);
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
    saveClassificationToDatabase,
    saveInventoryToDatabase,
    getInventoryByClassification,
    getClassificationsFromModel, // Ensure this function is exported
};
