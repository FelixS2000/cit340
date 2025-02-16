// database/index.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'cse340dbguzman',  // Replace with new credentials
    host: 'dpg-cup1f2qj1k6c739epkqg-a.oregon-postgres.render.com',   // Replace with new host
    database: 'cse340dbguzman_ij3z', // Replace with new database name
    password: 'P6hRWe2R6eJzUqYgImRxKhKVs7N7gZUy', // Replace with new password
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});


// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully');
    }
});

module.exports = pool;
