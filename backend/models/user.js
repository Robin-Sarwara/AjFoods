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
    }
})
const UserModel = mongoose.model('users',UserSchema )
module.exports = UserModel