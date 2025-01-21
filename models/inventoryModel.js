// models/inventoryModel.js

const db = require('../database'); // Assuming you have a database connection

exports.getVehicleById = async (id) => {
    const query = 'SELECT * FROM vehicles WHERE id = ?'; // Use parameterized query
    const [rows] = await db.execute(query, [id]);
    return rows[0]; // Return the first vehicle found
};