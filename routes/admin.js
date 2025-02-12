const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../utilities/authMiddleware');

// ✅ Ensure only admins can access these routes
router.use(authMiddleware.ensureAdmin);

// Route to view pending approvals
router.get('/pending', adminController.getPendingItems);

// Route to approve an inventory item
router.post('/approve-inventory/:id', adminController.approveInventory);

// Route to reject (delete) an inventory item
router.delete('/reject-inventory/:id', adminController.rejectInventory);

module.exports = router;
