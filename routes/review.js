const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../utilities/authMiddleware');

// Base routes
router.get('/', authMiddleware.ensureAuthenticated, reviewController.renderReviews);


router.post('/', authMiddleware.ensureAuthenticated, reviewController.createReview);


router.get('/:id', authMiddleware.ensureAuthenticated, reviewController.getReviews);


router.put('/:id', authMiddleware.ensureAuthenticated, reviewController.updateReview);


router.delete('/:id', authMiddleware.ensureAuthenticated, reviewController.deleteReview);



module.exports = router;
