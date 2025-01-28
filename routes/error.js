const express = require('express');
const router = express.Router();

// Commented out the intentional error route
// router.get('/trigger-error', (req, res) => {
//     throw new Error('This is an intentional error for testing purposes.');
// });

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('errors/500', {
        title: 'Server Error',
        message: 'An unexpected error occurred. Please try again later.'
    });
});

// Export the router
module.exports = router;
