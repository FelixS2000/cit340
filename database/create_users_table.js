const pool = require('./connection');

const createUsersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS public.users (
            user_id SERIAL PRIMARY KEY,
            account_firstname VARCHAR(50) NOT NULL,
            account_lastname VARCHAR(50) NOT NULL,
            account_email VARCHAR(100) UNIQUE NOT NULL,
            account_password VARCHAR(255) NOT NULL,
            account_type VARCHAR(20) DEFAULT 'Client'
        );
    `;

    try {
        await pool.query(query);
        console.log('Users table created successfully.');
    } catch (error) {
        console.error('Error creating users table:', error.message);
    } finally {
        pool.end(); // Close the pool connection
    }
};

createUsersTable();
