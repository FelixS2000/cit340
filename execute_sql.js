const fs = require('fs');
const pool = require('./database/connection');

async function executeSQL() {
    const sql = fs.readFileSync('./database/assignment2.sql', 'utf8');
    try {
        await pool.query(sql);
        console.log('SQL commands executed successfully.');
    } catch (error) {
        console.error('Error executing SQL commands:', error);
    } finally {
        await pool.end(); // Close the database connection
    }
}

executeSQL();
