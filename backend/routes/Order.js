const express = require("express");
const { orderValidation } = require("../middleware/OrderValidation");
const { EnsureAuthenticated, isAdmin } = require("../middleware/EnsureAuthenticated");
const { createOrder, updateTrackingInfo, createRazorpayOrder, getAllOrders, getOrder, verifypayment, updateShippingAddress, cancelOrder } = require("../controllers/OrderController");
const router = express.Router();

router.post("/orders/create-order",EnsureAuthenticated,orderValidation,createOrder );
router.put("/orders/:orderId/tracking-info/update", EnsureAuthenticated, isAdmin, updateTrackingInfo);
router.get("/orders/user/:userId", EnsureAuthenticated, getAllOrders);
router.get("/orders/:orderId", EnsureAuthenticated, getOrder);
router.put("/orders/:orderId/verify-payment", EnsureAuthenticated, verifypayment)
router.put("/orders/:orderId/update/shipping-address", EnsureAuthenticated, updateShippingAddress)
router.put("/orders/:orderId/cancel-order", EnsureAuthenticated, cancelOrder)

module.exports = router