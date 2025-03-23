const express = require("express");
const { orderValidation } = require("../middleware/OrderValidation");
const { EnsureAuthenticated, isAdmin } = require("../middleware/EnsureAuthenticated");
const { createOrder, updateTrackingInfo, createRazorpayOrder, getAllOrders, getOrder } = require("../controllers/OrderController");
const router = express.Router();

router.post("/orders/add-details",EnsureAuthenticated,orderValidation,createOrder );
router.put("/orders/:orderId/tracking-info/update", EnsureAuthenticated, isAdmin, updateTrackingInfo);
router.post("/orders/razorpay/create-order", EnsureAuthenticated,createRazorpayOrder);
router.get("orders/user/:userId", EnsureAuthenticated, getAllOrders)
router.get("orders/:orderId", EnsureAuthenticated, getOrder)