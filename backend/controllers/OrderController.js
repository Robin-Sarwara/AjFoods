const Order = require("../models/Order");
const { findByIdAndUpdate } = require("../models/user");
const Razorpay = require("razorpay");
const { v4: uuidv4 } = require("uuid");
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
    
    if(paymentMethod === "Prepaid"){
        const razorpayOrder = await razorpayInstance.orders.create({
            amount: totalAmount*100,
            currency: "INR",
            receipt: savedOrder._id.toString(),
            payment_capture: 1
        })
        savedOrder.razorpayOrderId = razorpayOrder.id;
        await savedOrder.save();
        return res.status(200).json({savedOrder, razorpayOrder})
    }
    else if(paymentMethod === "COD"){
        return res.status(200).json({savedOrder})
    }
    else{
        return res.status(400).json({message:"Invalid payment method"})
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updateShippingAddress = async(req, res)=>{
    try {
        const {orderId} = req.parmas;
        const {shippingAddress} = req.body;

        const order = await Order.findById(orderId)
        if(!order){
            return res.status(404).json({message:"Order not found"})
        }
        order.shippingAddress = shippingAddress;
        await order.save();

        res.status(200).json({message:"Shipping Address updated successfully", order: order.shippingAddress})
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
}

const updateTrackingInfo = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { courierName, estimatedDelivery, deliveryStatus } = req.body;

    const trackingId = `TRK-${uuidv4()}`;

    const updatedOrder = await findByIdAndUpdate(
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

    if(!updatedOrder){
        return res.status(404).json({message:"Order not found"})
    }
    
    res.status(200).json({message:"Product updated successfully", updatedOrder})
  } catch (error) {
    res.status(500).json({message:"Internal server error", error:error.message})
  }
};

const verifypayment = async(req, res) => {
    try {
        const {orderId, paymentId, signature} = req.body;
        const order = await Order.findOne({ razorpayOrderId:orderId });
        if(!order){
            res.status(404).json({message:"Order not found"})
        }

        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        hmac.update(orderId + '|' + paymentId);
        const generatedSignature = hmac.digest("hex");
        if(generatedSignature !== signature){
            return res.status(400).json({message:"Invalid payment signature"})
        }
        order.status = "Paid";
        order.paymentId = paymentId;
        await order.save();
        res.status(200).json({success:true, message:"Payment verified"})
    } catch (error) {
       res.status(500).json({message:"Internal server error", error: error.message}) 
    }
}

const createRazorpayOrder = async(req, res)=>{
    try {
        const {amount, currency, receipt} = req.body;
        const options = {
            amount,
            currency: currency || "INR",
            receipt: receipt || `receipt_order_${Date.now()}`
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);
        res.status(201).json(razorpayOrder);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const getAllOrders = async(req, res) => {
    try {
        const {userId} = req.params;

        const orders = await Order.find({userId:userId}).sort({orderDate: -1});
        res.status(200).json({orders});
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
}

const getOrder = async(req, res)=>{
    try {
        const {orderId} = req.parmas;

        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({message:"Order not found"})
        }
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({message:"Internal server error" ,error: error.message})
    }
}


module.exports = { createOrder, updateTrackingInfo, createRazorpayOrder, getAllOrders, getOrder};
