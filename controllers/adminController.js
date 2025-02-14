const inventoryModel = require('../models/inventoryModel');
const classificationModel = require('../models/classificationModel');

// Show all pending (unapproved) inventory items

async function getPendingItems(req, res) {
  try {
      const classifications = await classificationModel.getClassificationsByApproval(false);
      const inventory = await inventoryModel.getInventoryByApproval(false);
      res.render('admin/pending', { 
        title: 'Pending Approvals',
        classifications, 
        inventory,
        errors: null
      });

  } catch (error) {
      res.status(500).send('Error fetching pending items');
  }
}


// Approve an inventory item
async function approveInventory(req, res) {
    try {
        const admin_id = req.user.account_id; // Ensure authentication middleware sets req.user
        await inventoryModel.approveInventory(req.params.id, admin_id);
        res.redirect('/admin/pending');
    } catch (error) {
        res.status(500).send('Error approving inventory');
    }
}

// Reject (delete) an inventory item
async function rejectInventory(req, res) {
    try {
        await inventoryModel.deleteInventory(req.params.id);
        res.redirect('/admin/pending');
    } catch (error) {
        res.status(500).send('Error rejecting inventory');
    }
}

module.exports = { getPendingItems, approveInventory, rejectInventory };
