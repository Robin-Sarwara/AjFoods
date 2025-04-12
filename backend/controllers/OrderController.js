const Order = require("../models/Order");
const Razorpay = require("razorpay");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto"); // Make sure to require crypto
require("dotenv").config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, paymentMethod, shippingAddress } =
      req.body;
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
      orderDate: new Date(),
    });

    const savedOrder = await newOrder.save();

    if (paymentMethod === "Prepaid") {
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: totalAmount * 100, // amount in paisa
        currency: "INR",
        receipt: savedOrder._id.toString(),
        payment_capture: 1,
      });
      savedOrder.razorpayOrderId = razorpayOrder.id;
      await savedOrder.save();
      return res.status(200).json({ savedOrder, razorpayOrder });
    } else if (paymentMethod === "COD") {
      return res.status(200).json({ savedOrder });
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const deleteOrder = async(req, res)=>{
  try {
    const {id} = req.params;
    const order = await Order.findByIdAndDelete(id)
    if(!order){
      return res.status(404).json({message:"Order not found"})
    }
    res.status(200).json({message:"Order deleted successfully"})
  } catch (error) {
    res.status(500).json({message:"Internal server error", error:error.message})
  }
}

const updateShippingAddress = async (req, res) => {
  try {
    const { orderId } = req.params; // fixed typo: req.params
    const { shippingAddress } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.shippingAddress = shippingAddress;
    await order.save();

    res.status(200).json({
      message: "Shipping Address updated successfully",
      order: order.shippingAddress,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updateOrderStatus = async(req, res)=>{
  try {
    const {orderId} = req.params;
    const {orderStatus} = req.body;
  
    const order = await Order.findById(orderId);
    if(!order){
      return res.status(404).json({message:"Order not found"})
    }
    order.orderStatus = orderStatus;
    await order.save();
    res.status(200).json({message:"Order status updated successfully", orderStatus})
  } catch (error) {
    res.status(500).json({message:"Internal server error", error:error.message})
  }
  }

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const nonCancellableStatuses = ["Out for Delivery", "Delivered", "Cancelled"];
    if (nonCancellableStatuses.includes(order.orderStatus)) {
      return res.status(403).json({
        message: `Cannot cancel order in '${order.orderStatus}' status.`,
      });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const updateTrackingInfo = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { courierName, estimatedDelivery, deliveryStatus } = req.body;

    const trackingId = `TRK-${uuidv4()}`;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        tracking: {
          trackingId,
          courierName,
          estimatedDelivery,
          deliveryStatus,
        },
        orderStatus:
          deliveryStatus === "Out for Delivery"
            ? "Out for Delivery"
            : undefined,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Product updated successfully", updatedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const verifypayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentId, signature } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const razorpayOrderId = order.razorpayOrderId;
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpayOrderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");
    if (generatedSignature !== signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }
    order.paymentStatus = "Paid";
    order.paymentId = paymentId;
    await order.save();
    res.status(200).json({ success: true, message: "Payment verified" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getAllUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const activeOrders = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered",]


    const order = await Order.find({ userId: userId, orderStatus: { $in: activeOrders } })
      .sort({ orderDate: -1 })
      .populate("items.foodId", "thumbnail");

    res.status(200).json({ order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getAllActiveOrders =async(req, res)=>{
  try {
    const activeOrders = await Order.find({orderStatus:{$nin:["Delivered", "Cancelled"]}}).sort({createdAt: -1}).populate("items.foodId", "thumbnail");
    res.status(200).json(activeOrders)
  } catch (error) {
    res.status(500).json({message:"Internal server error", error:error.message})
  }
}

const getAllDeliveredOrder =async(req, res)=>{
  try {
    const deliveredOrders = await Order.find({orderStatus:"Delivered"}).sort({createdAt: -1}).populate("items.foodId", "thumbnail");
    res.status(200).json(deliveredOrders)
  } catch (error) {
    res.status(500).json({message:"Internal server error", error:error.message})
  }
}

const getAllCancelledOrders =async(req, res)=>{
  try {
    const cancelledOrders = await Order.find({orderStatus:"Cancelled"}).sort({createdAt: -1}).populate("items.foodId", "thumbnail");
    res.status(200).json(cancelledOrders)
  } catch (error) {
    res.status(500).json({message:"Internal server error", error:error.message})
  }
}

const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params; // fixed typo: req.params
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  createOrder,
  updateTrackingInfo,
  getAllUserOrders,
  getOrder,
  verifypayment,
  updateShippingAddress,
  cancelOrder,
  deleteOrder,
  getAllActiveOrders,
  getAllDeliveredOrder,
  getAllCancelledOrders,
  updateOrderStatus
};
