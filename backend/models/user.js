const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user', 'admin'],
        default:'user'
    },
    otp:{
        type:String
    },
    otpExpiry:{
        type:Date
    },
    deliveryAddress: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        phoneNumber: { type: String }
      }
})
const UserModel = mongoose.model('users',UserSchema )
module.exports = UserModel