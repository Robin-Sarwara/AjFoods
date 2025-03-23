const Cart = require("../models/addToCart");
const Products = require("../models/Products");
const UserModel = require("../models/user");

const addItem = async (req, res) => {
  try {
    const productId = req.params.id;
    const { userId, quantity } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cartModel = await Cart.findOne({ userId });
    if (!cartModel) {
      cartModel = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
        const existingItem = cartModel.items.find(item =>item.productId.toString()===productId.toString());

        if(existingItem){
            existingItem.quantity += quantity
        }else{
            cartModel.items.push({ productId, quantity });
        }
    }

    await cartModel.save();
    res.status(200).json({ message: "Food item added to cart successfully", cart: cartModel });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const deleteCartItem = async(req, res)=>{
    try {
        const {cartId, itemId} = req.params

        const cart = await Cart.findById(cartId)
        if(!cart){
            return res.status(404).json({message:"cart not found"})
        }

        const item = cart.items.id(itemId)
        if(!item){
            return res.status(404).json({message:"Item not found"})
        }

        cart.items.pull(itemId)
        await cart.save();
        res.status(200).json({message:"Item removed from cart successfully", cartData: cart, removedItem:item})
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
}

const getCartItems = async(req, res)=>{
    try {
        const userId = req.params.id;
        if(!userId){
           return res.status(400).json({message:"UserId is required"})
        }
        const user = await Cart.findOne({userId}).populate("items.productId", "price name thumbnail")
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        const id = user._id;
        const items = user.items;
        res.status(200).json({success:true ,_id:id,  items})
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
}

const updateCart = async(req, res)=>{
  try {
    const itemId = req.params.id;
    const {userId, newQuantity} = req.body;
    if(!userId){
      return res.status(400).json({message:"UserId is required"})
    }

    if(!newQuantity || newQuantity < 0){
      return res.status(400).json({message:"Valid quantity is required"})
    }

    const cart = await Cart.findOneAndUpdate(
      {
        userId:userId,
        "items._id": itemId
      },
      {
        $set:{
          "items.$.quantity": newQuantity,
          updatedAt: new Date()
        }
      },
      {
        new: true
      }
    );

    return res.status(200).json({messaeg:"Quantity updated successfully",
      cart:cart,
    });
  } catch (error) {
    res.status(500).json({message:"Internal server error", error:error.message})
  }
}

module.exports = { addItem, deleteCartItem, getCartItems, updateCart };
