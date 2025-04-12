import React, { useEffect, useState } from "react";
import { showSuccessToast, showErrorToast } from "../utils/toastMessage";
import { useRole } from "../utils/useRole";
import useCart from "../utils/useCart";
import axiosInstance from "../utils/axiosInstance";
import { useParams } from "react-router-dom";
import { use } from "react";

const RazorpayPayment = ({
  productName,
  productPrice,
  quantity, // Optional: for single item purchases
  isCartSummary = false, // Optional: for "Buy All" case
  onPaymentSuccess,
  onClose,
  foodId
}) => {
  const razorpayKeyId = "rzp_test_YuYipOA69oYNNl";
  const razorpayKeySecret = "3xSKqG01boDkrEZVyOHBiQ9k";
  const { username, userId, email } = useRole();
  const {fetchCart, cart} = useCart(userId)
  
  // State for shipping address
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("Prepaid");

  const {id} = useParams();

  const orderItems = isCartSummary
  ? cart.items.map((i) => ({
      foodId: i.productId._id,
      name: i.productId.name,
      price: i.productId.price,
      quantity: i.quantity || 1,
    }))
  : [{
      foodId: id ?? foodId,
      name: productName,
      price: productPrice,
      quantity: quantity || 1,
    }];




  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);


  const handlePayment = async() => {
    setLoading(true)
    try {
      const totalAmount = isCartSummary ? productPrice : productPrice * (quantity || 1);
      const orderData={
        userId:userId,
        items: orderItems,
        totalAmount,
        paymentMethod: paymentMethod,
        shippingAddress,
      };

      const response = await axiosInstance.post('/orders/create-order', orderData);
      const data = response.data;
      if (response.status < 200 || response.status >= 300) {
        throw new Error(data.message || "Failed to create order");
      }

      if(paymentMethod === "Prepaid"){
        const options = {
          key: razorpayKeyId,
          amount: data.razorpayOrder.amount,
          currency: data.razorpayOrder.currency,
          name:"AJFood",
          description: isCartSummary ? "Payment for all cart items" : `Payment for ${productName}`,
          order_id: data.razorpayOrder.id,
          handler: async function(response){
            const verifyResponse = await axiosInstance.put(`/orders/${data.savedOrder._id}/verify-payment`,{
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            })
            const verifyData = verifyResponse.data
            if ((verifyResponse.status===200 || verifyResponse.status===204) && verifyData.success) {
              showSuccessToast("Payment Successful! Payment ID: " + response.razorpay_payment_id);
              if (onPaymentSuccess) onPaymentSuccess(data.savedOrder);
              onClose();
            } else {
              throw new Error(verifyData.message || "Payment verification failed");
            }
          },
          prefill: {
            name: username,
            email: email,
          },
          theme: {
            color: "#3399cc",
          },
        }
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        showErrorToast("Payment Failed: " + response.error.description);
      });
      rzp.open();
    } else if (paymentMethod === "COD") {
      showSuccessToast("Order placed successfully!");
      if (onPaymentSuccess) onPaymentSuccess(data.savedOrder);
      onClose();
    }
  } catch (error) {
    showErrorToast("Error: " + error.message);
  } finally {
    setLoading(false);
  }
    
  };

  const getSavedDeliveryAddress = async()=>{
    setLoading(true)
    try {
      const response = await axiosInstance.get(`${userId}/delivery-address`);
      setShippingAddress({
      street: response.data.deliveryAddress.street,
      city: response.data.deliveryAddress.city,
      state: response.data.deliveryAddress.state,
      pincode: response.data.deliveryAddress.pincode
      })
    } catch (error) {
      showSuccessToast(error?.response?.data?.error || "Error fetching Shipping Address")
    }
    finally{
      setLoading(false)
    }
  }

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
   getSavedDeliveryAddress();
  }, [])
  

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Purchase</h2>

        {/* Order Summary */}
        <div className="mb-6 border-b pb-4">
          <p className="text-gray-600"> 
            {isCartSummary ? "Cart Items" : `Product: ${productName}`}
          </p>
          {!isCartSummary && quantity && (
            <p className="text-gray-600">Quantity: {quantity}</p>
          )}
          <p className="text-gray-600">
            Total Amount: ₹{isCartSummary ? productPrice : productPrice * (quantity || 1)}
          </p>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Select Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="Prepaid">Prepaid (UPI/Card/Wallet)</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>

        {/* Shipping Address */}
        <div className="mb-6">
          <p className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</p>
          <div className="space-y-4">
            {["street", "city", "state", "pincode"].map((field) => (
              <div key={field} className="flex flex-col">
                <span className="text-gray-600 font-medium mb-1 capitalize">{field}</span>
                <input
                  type="text"
                  name={field}
                  value={shippingAddress[field]}
                  onChange={handleAddressChange}
                  placeholder={`Enter your ${field} here`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;