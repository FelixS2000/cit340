// database/index.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'cse340dbguzman',
    host: 'dpg-cu55pnggph6c73du20i0-a.oregon-postgres.render.com',
    database: 'cse340dbguzman',
    password: 'K5RxwheTudWT21nsfYlA0rxoYGApEm7J',
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
