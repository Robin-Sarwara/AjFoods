import React, { useEffect } from "react";
import { showSuccessToast, showErrorToast } from "../utils/toastMessage";
import { useRole } from "../utils/useRole";

const RazorpayPayment = ({
  productName,
  productPrice,
  quantity, // Optional: for single item purchases
  isCartSummary = false, // Optional: for "Buy All" case
  onPaymentSuccess,
  onClose,
}) => {
  const razorpayKeyId = "rzp_test_YuYipOA69oYNNl";
  const razorpayKeySecret = "3xSKqG01boDkrEZVyOHBiQ9k";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const{username, email} = useRole();

  const handlePayment = () => {
    const options = {
      key: razorpayKeyId,
      amount: productPrice * 100, // Amount in paise
      currency: "INR",
      name: "AJ Food",
      description: isCartSummary
        ? "Payment for all cart items"
        : `Payment for ${productName}`,
      image: "https://your-logo-url.com/logo.png",
      handler: function (response) {
        showSuccessToast(
          "Payment Successful! Payment ID: " + response.razorpay_payment_id
        );
        if (onPaymentSuccess) onPaymentSuccess(response);
      },
      prefill: {
        name: username,
        email: email,
      },
      notes: {
        product_id: productName,
      },
      theme: {
        color: "#3399cc",
      },
      method: ["upi", "wallet"], // Prioritize UPI (Google Pay) and wallets (Paytm)
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      showErrorToast("Payment Failed: " + response.error.description);
    });

    rzp.open();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>
        <p className="mb-4">
          {isCartSummary ? "Cart Items" : `Product: ${productName}`}
        </p>
        {quantity && !isCartSummary && (
          <p className="mb-4">Quantity: {quantity}</p>
        )}
        <p className="mb-4">Amount: ₹{productPrice}</p>
        <button
          onClick={handlePayment}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Pay Now
        </button>
        <button
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RazorpayPayment;
