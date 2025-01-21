// routes/error.js

const express = require('express');
const router = express.Router();

router.get('/trigger-error', (req, res, next) => {
    throw new Error('Intentional Error for Testing');
});

module.exports = router;
