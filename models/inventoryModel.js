const db = require('../database/db-sql-code.sql');

// Function to retrieve a vehicle by its ID
async function getVehicleById(inv_id) {
    try {
        const sql = 'SELECT * FROM inventory WHERE inv_id = $1';
        const result = await db.query(sql, [inv_id]);
        if (result.rows.length === 0) {
            throw new Error(`Vehicle with ID ${inv_id} not found`);
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching vehicle by ID:', error.message);
        throw error;
    }
}

module.exports = { getVehicleById };
