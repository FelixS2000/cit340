const pool = require('../database/connection');
const bcrypt = require('bcryptjs');

async function findUserByEmailOrUsername(email) {
    try {
        const result = await pool.query(
            'SELECT * FROM account WHERE account_email = $1',
            [email]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Database error:", error);
        throw error;
    }
}

async function checkPassword(plainPassword, hashedPassword) {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        console.error("Password check error:", error);
        throw error;
    }
}

async function loginUser(email, password) {
    try {
        const user = await findUserByEmailOrUsername(email);
        if (!user) return null;

        const passwordMatch = await checkPassword(password, user.account_password);
        return passwordMatch ? user : null;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}


module.exports = {
    findUserByEmailOrUsername,
    checkPassword,
    loginUser,
};
