const reviewModel = require('../models/reviewModel');

async function renderReviews(req, res) {
    try {
        const reviews = await reviewModel.getAllReviews(); // Assuming a function to get all reviews
        res.render('review/reviews', { reviews }); // Render the reviews view
    } catch (error) {
        res.status(500).send('Error fetching reviews');
    }
}

// Handle creating a review

async function createReview(req, res) {
    const { reviewText, invId } = req.body;
    const accountId = req.user.account_id; // Assuming user is authenticated and account_id is available
    try {
        await reviewModel.createReview(reviewText, invId, accountId);
        res.status(201).redirect(`/inventory/${invId}`); // Redirect to the inventory item page
    } catch (error) {
        res.status(500).send('Error creating review');
    }
}

// Handle fetching reviews for a specific inventory item
async function getReviews(req, res) {
    console.log('Fetching reviews for inventory ID:', req.params.id); // Log the inventory ID

    const invId = req.params.id;
    try {
        console.log('Attempting to fetch reviews from the database...'); // Log before fetching reviews
        const reviews = await reviewModel.getReviewsByInventoryId(invId);

        res.render('reviews', { reviews, invId }); // Render the reviews view
    } catch (error) {
        res.status(500).send('Error fetching reviews');
    }
}

async function updateReview(req, res) {
    const { reviewId, reviewText } = req.body;
    const accountId = req.user.account_id; // Assuming user is authenticated and account_id is available
    try {
        // Check if the review belongs to the user
        const review = await reviewModel.getReviewById(reviewId);
        if (review.account_id !== accountId) {
            return res.status(403).send('You are not authorized to update this review');
        }
        await reviewModel.updateReview(reviewId, reviewText);
        res.status(200).send('Review updated successfully');
    } catch (error) {
        res.status(500).send('Error updating review');
    }
}

// Handle deleting a review
async function deleteReview(req, res) {
    const reviewId = req.params.id;
    const accountId = req.user.account_id; // Assuming user is authenticated and account_id is available
    try {
        // Check if the review belongs to the user
        const review = await reviewModel.getReviewById(reviewId);
        if (review.account_id !== accountId) {
            return res.status(403).send('You are not authorized to delete this review');
        }
        await reviewModel.deleteReview(reviewId);
        res.status(200).send('Review deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting review');
    }
}


// Handle deleting a review
async function deleteReview(req, res) {
    const reviewId = req.params.id;
    try {
        await reviewModel.deleteReview(reviewId);
        res.status(200).send('Review deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting review');
    }
}

module.exports = {
    createReview,
    getReviews,
    renderReviews, // Add this line
    updateReview,
    deleteReview,
};
