const { object, required, ref } = require('joi')
const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
    items:[{
        productId:{ type:mongoose.Schema.Types.ObjectId, ref:"Product", required:true},
        quantity:{ type:Number, default:1},
    }]
}, {timestamps:true});

const Cart = mongoose.model("cart", cartSchema)
module.exports = Cart;