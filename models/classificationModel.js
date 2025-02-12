async function getApprovedClassifications() {
  const sql = `SELECT * FROM classification WHERE classification_approved = TRUE`;
  return await db.query(sql);
}

module.export = {
  getApprovedClassifications,
};