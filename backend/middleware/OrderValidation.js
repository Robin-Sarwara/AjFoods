const { body, validationResult } = require("express-validator");

const orderValidation = [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
    body("totalAmount").isNumeric().withMessage("Total Amount must be a number"),
    body("paymentMethod")
        .isIn(["COD", "Card", "UPI", "Wallet"])
        .withMessage("Invalid payment method"),
    
    body("shippingAddress.street").notEmpty().withMessage("Street is required"),
    body("shippingAddress.city").notEmpty().withMessage("City is required"),
    body("shippingAddress.state").notEmpty().withMessage("State is required"),
    body("shippingAddress.pincode").notEmpty().withMessage("Pincode is required"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { orderValidation };
