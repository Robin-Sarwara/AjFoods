import React, { useEffect, useState } from "react";
import { useRole } from "../utils/useRole";
import axiosInstance from "../utils/axiosInstance";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import Spinner from "./Spinner";
import Swal from "sweetalert2";

const Orders = () => {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const { userId } = useRole();

  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/orders/user/${userId}`);
      setOrderData(response.data.orders);
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Cancel it!",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await axiosInstance.put(
          `/orders/${orderId}/cancel-order`
        );
        setLoading(false);
        showSuccessToast(
          response.data.message || "Order cancelled successfully"
        );
        fetchUserOrders();
      } catch (error) {
        showErrorToast(
          error?.response?.data?.message ||
            "Error occurred while cancelling your order"
        );
      }
    }
  };

  const handleOrderAgain = async (orderId) => {
    alert("Order placed again!");
  };

  useEffect(() => {
    if (userId) fetchUserOrders();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {loading && <Spinner />}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          Your Orders
        </h1>
        
        {orderData.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600 text-lg">No orders found.</p>
            <p className="text-gray-500 mt-2">Start shopping to see your orders here!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orderData.map((data, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300"
              >
                {data.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-b last:border-b-0 py-4 first:pt-0 last:pb-0"
                  >
                    <img
                      className="rounded-lg object-cover w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0"
                      src={item.foodId.thumbnail}
                      alt={item.name}
                      loading="lazy"
                    />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Item Details */}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="mt-2 space-y-1">
                          <p className="text-gray-600">
                            Price: <span className="font-medium">₹{item.price}</span>
                          </p>
                          <p className="text-gray-600">
                            Quantity: <span className="font-medium">{item.quantity}</span>
                          </p>
                        </div>
                      </div>

                      {/* Shipping and Status */}
                      <div className="md:text-right">
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Shipping Address:
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {data.shippingAddress.street}, {data.shippingAddress.city}
                              <br />
                              {data.shippingAddress.state} - {data.shippingAddress.pincode}
                            </p>
                          </div>
                          <p className="text-sm">
                            <span className="font-medium">Status: </span>
                            <span
                              className={`font-semibold ${
                                data.orderStatus === "Delivered"
                                  ? "text-green-600"
                                  : data.orderStatus === "Cancelled"
                                  ? "text-red-600"
                                  : "text-orange-600"
                              }`}
                            >
                              {data.orderStatus}
                            </span>
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex flex-wrap gap-3 md:justify-end">
                          {data.orderStatus !== "Cancelled" &&
                            data.orderStatus !== "Delivered" && (
                              <button
                                onClick={() => handleCancelOrder(data._id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                              >
                                Cancel Order
                              </button>
                            )}
                          <button
                            onClick={() => handleOrderAgain(data._id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                          >
                            Order Again
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;