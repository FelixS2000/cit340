const express = require('express');
const router = express.Router();

// Sample route for account
router.get('/', (req, res) => {
    res.json({ message: 'Account route is working!' });
});

module.exports = router;
