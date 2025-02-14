const pool = require('../database/connection');

async function getApprovedClassifications() {
  const sql = `SELECT * FROM classification WHERE classification_approved = TRUE`;
  return await pool.query(sql);
}


module.exports = {
  getApprovedClassifications,
};
