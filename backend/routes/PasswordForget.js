const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const UserModel = require("../models/user");
const crypto = require("crypto");
const { ResetPasswordValidation, ForgotPasswordValidation } = require("../middleware/authValidation");
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

router.post("/forget-password",ForgotPasswordValidation, async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email }); // Add await here

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const otpExpiry = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save(); // Save the updated user document

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`,
    };

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
    console.log("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/reset-password",ResetPasswordValidation, async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await UserModel.findOne({ email }); // Add await here

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > user.otpExpiry) {
      // Check the user object's otpExpiry
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save(); // Save the updated user document

    res.status(200).json({ message: "Password reset successfully", success:true });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
