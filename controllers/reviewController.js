const reviewModel = require('../models/reviewModel');
const invModel = require('../models/inventoryModel'); // Add this


async function renderReviews(req, res) {
    try {
        const [reviews, vehicles] = await Promise.all([
            reviewModel.getAllReviews(),
            invModel.getAllInventory() // Get all vehicles for the dropdown

        ]);

        res.render('review/reviews', {
            title: 'Vehicle Reviews',
            reviews: reviews,
            vehicles: vehicles,
            accountData: req.session.accountData
        });
    } catch (error) {
        console.error('Error rendering reviews:', error);
        res.status(500).send('Server Error');
    }
}

async function createReview(req, res) {
    try {
        // Check if user is logged in
        if (!req.session.accountData) {
            return res.status(401).json({ 
                error: 'You must be logged in to submit a review' 
            });
        }

        const { inv_id, review_text } = req.body;
        
        // Validate input
        if (!inv_id || !review_text) {
            return res.status(400).json({ 
                error: 'Please provide both vehicle and review text' 
            });
        }

        // Create the review
        await reviewModel.createReview(
            review_text,
            inv_id,
            req.session.accountData.account_id
        );

        // Redirect back to reviews page
        res.redirect('/reviews');
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
}


// Handle fetching reviews for a specific inventory item
async function getReviews(req, res) {
    console.log('Fetching reviews for inventory ID:', req.params.id); // Log the inventory ID

    const invId = req.params.id;
    try {
        console.log('Attempting to fetch reviews from the database...'); // Log before fetching reviews
        const reviews = await reviewModel.getReviewsByInventoryId(invId);
        
        if (!reviews || reviews.length === 0) {
            console.log('No reviews found for inventory ID:', invId);
            return res.render('review/reviews', { reviews: [], invId, title: 'Reviews' });


        }

        console.log('Successfully fetched reviews:', reviews.length);
        res.render('review/reviews', { reviews, invId, title: 'Reviews' }); // Render the reviews view


    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send(`Error fetching reviews: ${error.message}`);
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


module.exports = {
    createReview,
    getReviews,
    renderReviews, // Add this line
    updateReview,
    deleteReview,
};
