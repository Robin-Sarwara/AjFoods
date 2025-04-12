const express = require("express");
const { orderValidation } = require("../middleware/OrderValidation");
const { EnsureAuthenticated, isAdmin } = require("../middleware/EnsureAuthenticated");
const { createOrder, updateTrackingInfo, createRazorpayOrder, getAllUserOrders, getOrder, verifypayment, updateShippingAddress, cancelOrder, deleteOrder, getAllActiveOrders, getAllDeliveredOrder, getAllCancelledOrders, updateOrderStatus } = require("../controllers/OrderController");
const router = express.Router();

router.post("/orders/create-order",EnsureAuthenticated,orderValidation,createOrder );
router.get("/orders/active-orders", EnsureAuthenticated, isAdmin, getAllActiveOrders);
router.get("/orders/delivered-orders", EnsureAuthenticated, isAdmin, getAllDeliveredOrder);
router.get("/orders/cancelled-orders", EnsureAuthenticated, isAdmin, getAllCancelledOrders);
router.put("/orders/:orderId/tracking-info/update", EnsureAuthenticated, isAdmin, updateTrackingInfo);
router.get("/orders/user/:userId", EnsureAuthenticated, getAllUserOrders);
router.get("/orders/:orderId", EnsureAuthenticated, getOrder);
router.put("/orders/:orderId/verify-payment", EnsureAuthenticated, verifypayment);
router.put("/orders/:orderId/update/shipping-address", EnsureAuthenticated, updateShippingAddress);
router.put("/orders/:orderId/cancel-order", EnsureAuthenticated, cancelOrder);
router.put("/orders/:orderId/status", EnsureAuthenticated,isAdmin, updateOrderStatus);
router.delete("/orders/:id/delete-order", EnsureAuthenticated, deleteOrder);




module.exports = router