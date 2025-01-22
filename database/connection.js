const { Pool } = require('pg'); // Assuming PostgreSQL is being used

const pool = new Pool({
    user: 'cse340dbguzman', // Database username
    host: 'dpg-cu55pnggph6c73du20i0-a.oregon-postgres.render.com', // Database host
    database: 'cse340dbguzman', // Database name
    password: 'K5RxwheTudWT21nsfYlA0rxoYGApEm7J', // Database password
    port: 5432, // Database port
    ssl: {
        rejectUnauthorized: false // Adjust as needed for production
    }
});

module.exports = pool;
