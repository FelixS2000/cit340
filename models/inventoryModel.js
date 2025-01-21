const pool = require('../database/db-sql-code.sql'); // Assume connection.js configures the database connection

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
        console.error('Error fetching vehicle data:', error.message);
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
                inv_price AS price, 
                inv_thumbnail AS thumbnail 
            FROM inventory 
            WHERE classification_id = $1
        `;
        const result = await pool.query(query, [classificationId]);

        return result.rows;
    } catch (error) {
        console.error('Error fetching inventory data:', error.message);
        throw error;
    }
}

module.exports = {
    getVehicleById,
    getInventoryByClassification,
};
