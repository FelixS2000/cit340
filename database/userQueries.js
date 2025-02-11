// database/userQueries.js
const pool = require('pg');
const bcrypt = require('bcryptjs');

/* *****************************
*   Register new user
* *************************** */
async function registerUser(first_name, last_name, email, password) {
    try {
        const sql = "INSERT INTO account (first_name, last_name, email, account_password) VALUES ($1, $2, $3, $4) RETURNING *"
        return await pool.query(sql, [first_name, last_name, email, password])
    } catch (error) {
        return error.message
    }
}

/* ****************************
 *   Check for existing email
 * ************************** */
async function checkExistingEmail(email) {
    try {
        const sql = "SELECT * FROM account WHERE email = $1"
        const email_exists = await pool.query(sql, [email])
        return email_exists.rowCount
    } catch (error) {
        return error.message
    }
}

/* *****************************
* Return user data using email address
* ***************************** */
async function getAccountByEmail(email) {
    try {
        const result = await pool.query(
            'SELECT account_id, first_name, last_name, email, account_password, account_type FROM account WHERE email = $1',
            [email]
        )
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

/* *****************************
* Return account data using account id
* ***************************** */
async function getAccountById(account_id) {
    try {
        const result = await pool.query(
            'SELECT account_id, first_name, last_name, email, account_type FROM account WHERE account_id = $1',
            [account_id]
        )
        return result.rows[0]
    } catch (error) {
        return new Error("No matching account found")
    }
}

/* *****************************
* Update account data
* ***************************** */
async function updateAccount(account_id, first_name, last_name, email) {
    try {
        const sql = "UPDATE account SET first_name = $1, last_name = $2, email = $3 WHERE account_id = $4 RETURNING *"
        const data = await pool.query(sql, [first_name, last_name, email, account_id])
        return data.rows[0]
    } catch (error) {
        return error.message
    }
}

/* *****************************
* Update account password
* ***************************** */
async function updatePassword(account_id, password) {
    try {
        const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
        const data = await pool.query(sql, [password, account_id])
        return data.rows[0]
    } catch (error) {
        return error.message
    }
}

module.exports = {
    registerUser,
    checkExistingEmail,
    getAccountByEmail,
    getAccountById,
    updateAccount,
    updatePassword
}
