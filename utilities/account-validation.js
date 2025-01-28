const { body, validationResult } = require("express-validator");
const accountModel = require("../models/inventoryModel");

// Validation rules for registration
const registrationRules = () => {
    return [
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a first name."),
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a last name."),
        body("account_email")
            .trim()
            .escape()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email);
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use a different email.");
                }
            }),
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ];
};

// Validation rules for classification
const classificationRules = () => {
    return [
        body('classificationName')
            .notEmpty().withMessage('Classification name is required.')
            .matches(/^[a-zA-Z0-9]+$/).withMessage('Classification name cannot contain spaces or special characters.')
    ];
};

// Validation rules for inventory
const inventoryRules = () => {
    return [
        body('make').notEmpty().withMessage('Make is required.'),
        body('model').notEmpty().withMessage('Model is required.'),
        body('year').isNumeric().withMessage('Year must be a number.'),
        body('price').notEmpty().withMessage('Price is required.'),
        body('mileage').notEmpty().withMessage('Mileage is required.'),
        body('classification_id').notEmpty().withMessage('Classification is required.')
    ];
};

// Check registration data and return errors or continue
const checkRegData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render("registration", {
            errors: errors.array(),
            title: "Registration",
            account_firstname: req.body.account_firstname,
            account_lastname: req.body.account_lastname,
            account_email: req.body.account_email,
        });
    }
    next();
};

// Check validation errors for classification and inventory
const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(err => err.msg).join(', '));
        return res.redirect(req.get('referer')); // Redirect back to the previous page
    }
    next();
};

module.exports = {
    registrationRules,
    classificationRules,
    inventoryRules,
    checkRegData,
    checkValidationErrors
};
