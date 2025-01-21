// routes/error.js

const express = require('express');
const router = express.Router();

router.get('/trigger-error', (req, res) => {
    throw new Error('This is a deliberate error!');
});

module.exports = router;