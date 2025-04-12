const UserModel = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});


const updateName = async(req, res)=>{
    try {
        const{userId} = req.params;
        const {name} = req.body;

        const user = await UserModel.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        user.name = name;
        await user.save();
        res.status(200).json({message:"Name updated successfully", name:user.name})
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
}

const emailVerification =async(req, res)=>{
    try {
        const{userId} = req.params;
        const{email} = req.body;
        
        const user = await UserModel.findById(userId)
        if(!user){
            res.status(404).json({message:"User not found"})
        }

       if(user.email!==email){
        return res.status(401).json({message:"Invalid Email"})
       }
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000;
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        const mailOptions = {
            form: process.env.EMAIL,
            to: user.email,
            subject: "Email Change Otp",
            html:`<p>Your OTP for Email change is: <strong>${otp}</strong></p>`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.status(500).json({
                message: "Error sending email",
                error,
              });
            }
            res.status(200).json({
              message: "OTP sent to your email",
              success:true
            });
          });

    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
}

const updateEmail = async(req, res)=>{
    try {
        const{userId} = req.params;
        const{newEmail, otp} = req.body;
        
        const user = await UserModel.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        if(user.otp !== otp){
            return res.status(400).json({message:"Invalid OTP"})
        }
        if (Date.now() > user.otpExpiry) {
              return res.status(400).json({ message: "OTP expired" });
            }

        if(user.email === newEmail){
           return res.status(409).json({message:"Email already exists"})
        }

        user.email = newEmail;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        res.status(200).json({message:"Email changed successfully", user})

    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
}

module.exports = {updateName, emailVerification, updateEmail}