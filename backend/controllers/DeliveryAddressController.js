const UserModel = require("../models/user");
const { use } = require("../routes/Order");

const addDeliveryAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { street, city, state, pincode, phoneNumber } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        deliveryAddress: {
          street,
          city,
          state,
          pincode,
          phoneNumber,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Delivery Address updated successfully",
      deliveryAddress: user.deliveryAddress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getDeliveryAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId, {
      deliveryAddress: 1,
      _id: 0,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, deliveryAddress: user.deliveryAddress });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updateDeliveryAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { street, city, state, pincode, phoneNumber } = req.body;

    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        deliveryAddress: {
          street,
          city,
          state,
          pincode,
          phoneNumber,
        },
      },
      { new: true } // <-- return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Delivery Address updated successfully",
      deliveryAddress: user.deliveryAddress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { addDeliveryAddress, getDeliveryAddress, updateDeliveryAddress };
