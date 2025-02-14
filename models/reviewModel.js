const pool = require('../database/connection'); // Import database connection

// Create a new review
async function createReview(reviewText, invId, accountId) {
    try {
        const sql = `
            INSERT INTO public.review (review_text, inv_id, account_id)
            VALUES ($1, $2, $3)
        `;
        await pool.query(sql, [reviewText, invId, accountId]);
    } catch (error) {
        console.error('❌ Error creating review:', error.message);
        throw error;
    }
}

// Fetch all reviews for a specific inventory item
async function getReviewsByInventoryId(invId) {
    try {
        const sql = `
            SELECT * FROM public.review WHERE inv_id = $1
        `;
        const result = await pool.query(sql, [invId]);
        return result.rows; // Return all reviews for the inventory item
    } catch (error) {
        console.error('❌ Error fetching reviews:', error.message);
        throw error;
    }
}

// Update a review
async function updateReview(reviewId, reviewText) {
    try {
        const sql = `
            UPDATE public.review SET review_text = $1 WHERE review_id = $2
        `;
        await pool.query(sql, [reviewText, reviewId]);
    } catch (error) {
        console.error('❌ Error updating review:', error.message);
        throw error;
    }
}

// Delete a review
async function deleteReview(reviewId) {
    try {
        const sql = `
            DELETE FROM public.review WHERE review_id = $1
        `;
        await pool.query(sql, [reviewId]);
    } catch (error) {
        console.error('❌ Error deleting review:', error.message);
        throw error;
    }
}

module.exports = {
    createReview,
    getReviewsByInventoryId,
    updateReview,
    deleteReview,
};
