const { ref, required, number } = require("joi");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true },

    items:[
        {
            foodId:{type:mongoose.Schema.Types.ObjectId, ref:"Product", required:true},
            name:{type:String, required:true},
            quantity:{type:String, required:true},
            price: {type: Number, required:true}
        },
    ],

    totalAmount:{type:Number, required:true},
    paymentMethod:{type:String, enum:["COD", "Prepaid"], required:true},
    paymentStatus:{type:String, enum:["Pending", "Paid", "Failed"], default:"Pending"},
    paymentId : { type: String, default: null },

    orderStatus:{
        type:String,
        enum:["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled", "inactive"],
        default:"Pending",
    },

    tracking:{
        trackingId:{type:String, default:null},
        courierName:{type:String, default:null},
        estimatedDelivery:{type:String, default:null},
        deliveryStatus:{type:String, default:"Pending"}
    },

    shippingAddress: {
        street:{type:String, required:true},
        city:{type:String, required:true},
        state:{type:String, required:true},
        pincode:{type:String, required:true}
    },
    orderDate: { type: Date, default: Date.now },
    deliveredAt: { type: Date, default: null },
    razorpayOrderId : { type: String, default: null },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;