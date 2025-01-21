const { Pool } = require('pg'); // Assuming PostgreSQL is being used

const pool = new Pool({
    user: 'cse340dbguzman', // Replace with your database username
    host: 'render.com', // Replace with your database host
    database: 'cse340dbguzman', // Replace with your database name
    password: 'K5RxwheTudWT21nsfYlA0rxoYGApEm7J', // Replace with your database password
    port: 5432, // Replace with your database port
});

module.exports = pool;
