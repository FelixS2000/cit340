const pool = require('../database/connection'); // Import database connection

// Fetch classifications from the database
async function getClassificationsFromModel() {
    try {
        const query = `SELECT classification_id, classification_name FROM classification ORDER BY classification_name ASC`;
        const result = await pool.query(query);
        return result.rows; // Return all classifications
    } catch (error) {
        console.error('❌ Error fetching classifications:', error.message);
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
        console.error('❌ Error fetching vehicle data:', error.message);
        throw error;
    }
}

// Save a new inventory item
async function saveInventoryToDatabase(make, model, year, price, mileage, classification_id, description, image, thumbnail, color) {
    try {
        const sql = `
            INSERT INTO inventory (inv_make, inv_model, inv_year, inv_price, inv_miles, classification_id, inv_description, inv_image, inv_thumbnail, inv_color)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        await pool.query(sql, [make, model, year, price, mileage, classification_id, description, image, thumbnail, color]);
    } catch (error) {
        console.error('❌ Error saving inventory item:', error.message);
        throw error;
    }
}

// Save a new classification
async function saveClassificationToDatabase(classificationName) {
    try {
        const sql = `INSERT INTO classification (classification_name) VALUES ($1)`;
        await pool.query(sql, [classificationName]);
    } catch (error) {
        console.error('❌ Error saving classification:', error.message);
        throw error;
    }
}

// Fetch inventory by classification ID
async function getInventoryByClassification(classificationId) {
    try {
        const query = `
            SELECT 
                inv_id, 
                inv_make, 
                inv_model, 
                inv_year, 
                inv_price, 
                inv_miles, 
                inv_color, 
                inv_description, 
                inv_image 
            FROM inventory 
            WHERE classification_id = $1
        `;
        const result = await pool.query(query, [classificationId]);
        return result.rows.length > 0 ? result.rows : []; // Return empty array if no data
    } catch (error) {
        console.error('❌ Error fetching inventory:', error.message);
        throw error;
    }
}

// Fetch all inventory items
async function getAllInventory() {
    try {
        const query = `SELECT * FROM inventory ORDER BY inv_make, inv_model, inv_year ASC`;
        const result = await pool.query(query);
        return result.rows; // Return all inventory items
    } catch (error) {
        console.error('❌ Error fetching all inventory:', error.message);
        throw error;
    }
}

async function getAllInventoryWithClassification() {
    try {
        const query = `
            SELECT 
                inventory.inv_id,
                inventory.inv_make AS make, 
                inventory.inv_model AS model, 
                inventory.inv_year AS year,
                inventory.inv_price AS price, 
                inventory.inv_miles AS mileage, 
                inventory.inv_description AS description, 
                inventory.inv_image AS image,
                classification.classification_name, 
                classification.classification_id
            FROM inventory
            JOIN classification ON inventory.classification_id = classification.classification_id
        `;

        const result = await pool.query(query);
        return result.rows.length > 0 ? result.rows : []; // Return empty array if no data

    } catch (error) {
        console.error("❌ Error fetching inventory:", error.message);
        throw error;
    }
}

// Get all unapproved inventory items
async function getUnapprovedInventory() {
    try {
        console.log('Checking if inv_approved column exists...');
        const checkColumn = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='inventory' 
            AND column_name='inv_approved'
        `;
        const columnExists = await pool.query(checkColumn);
        console.log('Column check result:', columnExists.rows);
        
        if (columnExists.rows.length === 0) {
            console.log('inv_approved column does not exist - creating it...');
            await pool.query(`
                ALTER TABLE inventory 
                ADD COLUMN inv_approved BOOLEAN DEFAULT FALSE
            `);
            console.log('Successfully created inv_approved column');
            
            // Return empty array since we just created the column
            return [];
        }

        console.log('Fetching unapproved inventory items...');
        const sql = `
            SELECT * 
            FROM inventory 
            WHERE inv_approved = FALSE 
            ORDER BY inv_id DESC
        `;
        const result = await pool.query(sql);
        console.log(`Found ${result.rows.length} unapproved items`);
        
        // Return empty array if no items found instead of null
        return result.rows || [];
    } catch (error) {
        console.error('Error in getUnapprovedInventory:', error);
        console.error('Stack trace:', error.stack);
        // Return empty array instead of throwing error
        return [];
    }
}






// Approve an inventory item
async function approveInventory(inv_id, admin_id) {
    const sql = `
        UPDATE inventory 
        SET inv_approved = TRUE, 
            account_id = $1, 
            inv_approved_date = NOW() 
        WHERE inv_id = $2`;
    await pool.query(sql, [admin_id, inv_id]);
}



// Delete/reject an unapproved inventory item
async function deleteInventory(inv_id) {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1';
    await pool.query(sql, [inv_id]);
}


// Export the functions (removed addInventory since it belongs in the controller)
module.exports = {
    getVehicleById,
    getAllInventory,
    getAllInventoryWithClassification,
    getClassificationsFromModel,
    getUnapprovedInventory,
    approveInventory,
    deleteInventory,
    saveInventoryToDatabase,
    saveClassificationToDatabase,
    getInventoryByClassification
};
