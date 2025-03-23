import React, { useEffect, useState } from "react";
import useCart from "../utils/useCart";
import { useRole } from "../utils/useRole";
import { Minus, Plus } from "lucide-react";
import Spinner from "./Spinner";
import axiosInstance from "../utils/axiosInstance";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import RazorpayPayment from "./RazorpayPayment";

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const { userId } = useRole();
  const { cart, fetchCart } = useCart(userId);
  const [refresh, setRefresh] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // For single item
  const [showBuyAllModal, setShowBuyAllModal] = useState(false); // For Buy All
  const [selectedItem, setSelectedItem] = useState(null); // For single item payment

  const cartId = cart.id;

  const handleDecrement = async (quantity, id) => {
    if (quantity <= 1) return;
    setLoading(true);
    const newQuantity = quantity - 1;
    try {
      await axiosInstance.put(`/cart/${id}/update`, { newQuantity, userId });
      setRefresh((prev) => !prev);
    } catch (error) {
      showErrorToast(error.response.data.message || "Error updating item");
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = async (quantity, id) => {
    setLoading(true);
    const newQuantity = quantity + 1;
    try {
      await axiosInstance.put(`/cart/${id}/update`, { newQuantity, userId });
      setRefresh((prev) => !prev);
    } catch (error) {
      showErrorToast(error.response.data.error || "Error updating item");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });
    if (result.isConfirmed) {
      setLoading(true);
      try {
        await axiosInstance.delete(`/delete/cart/${cartId}/items/${itemId}`);
        showSuccessToast("Item removed successfully");
        setRefresh((prev) => !prev);
      } catch (error) {
        showErrorToast(
          error.response.data.message || "Error occurred while deleting item"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBuyItem = (item) => {
    setSelectedItem(item); // Store the selected item
    setShowPaymentModal(true); // Show payment modal for single item
  };

  const handleBuyAll = () => {
    setShowBuyAllModal(true); 
  };

  const handlePaymentSuccess = async(response) => {
    console.log("Payment Success:", response);
    setShowPaymentModal(false);
    setShowBuyAllModal(false);
    setSelectedItem(null);
    setRefresh((prev) => !prev); // Refresh cart after payment
    showSuccessToast("Order placed successfully!");
    try {
      let itemId = selectedItem._id
      await axiosInstance.delete(`/delete/cart/${cartId}/items/${itemId}`);
      showSuccessToast("Item removed successfully");
      setRefresh((prev) => !prev);
    } catch (error) {
      showErrorToast(
        error.response.data.message || "Error occurred while deleting item"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setShowBuyAllModal(false);
    setSelectedItem(null);
  };

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.quantity * item.productId.price,
    0
  );

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [refresh, userId]);

  return (
    <>
      {loading && <Spinner />}
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-10">Your Cart</h1>
          <div className="flex flex-col gap-8">
            {cart.items.map(({ productId, quantity, _id }) => (
              <div
                key={_id}
                className="flex flex-col sm:flex-row items-center bg-white p-6 rounded-lg shadow-lg"
              >
                <Link
                  to={`/product/${productId._id}`}
                  className="flex-shrink-0 hover:scale-105 transition-transform"
                >
                  <img
                    className="w-40 h-40 object-cover rounded-lg"
                    src={productId.thumbnail}
                    alt={productId.name}
                  />
                </Link>
                <div className="sm:ml-6 flex flex-col justify-between w-full mt-4 sm:mt-0">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {productId.name}
                    </h2>
                    <p className="mt-2 text-gray-600">
                      Price: <span className="font-bold">₹{productId.price}</span>
                    </p>
                    <p className="mt-1 text-gray-600">
                      Total:{" "}
                      <span className="font-bold text-xl">
                        ₹{quantity * productId.price}
                      </span>
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      onClick={() => handleDecrement(quantity, _id)}
                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-lg font-medium">{quantity}</span>
                    <button
                      onClick={() => handleIncrement(quantity, _id)}
                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleBuyItem({ productId, quantity, _id })}
                      className="py-1 px-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition text-sm"
                    >
                      Order Now
                    </button>
                    <button
                      onClick={() => handleRemove(_id)}
                      className="py-1 px-3 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {/* Global Summary Section at the Bottom */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-center mb-6">Cart Summary</h2>
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <span className="text-lg text-gray-700">Total Items</span>
                <span className="text-xl font-bold text-gray-900">
                  {cart.items.length}
                </span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg text-gray-700">Total Price</span>
                <span className="text-xl font-bold text-green-600">
                  ₹{totalPrice}
                </span>
              </div>
              <button
                onClick={handleBuyAll}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300"
              >
                Buy All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Payment Modal for Single Item */}
      {showPaymentModal && selectedItem && (
        <RazorpayPayment
          productName={selectedItem.productId.name}
          productPrice={selectedItem.quantity * selectedItem.productId.price}
          quantity={selectedItem.quantity}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={handleCloseModal}
        />
      )}

      {/* Razorpay Payment Modal for Buy All */}
      {showBuyAllModal && (
        <RazorpayPayment
          productName="Cart Items"
          productPrice={totalPrice}
          isCartSummary={true}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Cart;