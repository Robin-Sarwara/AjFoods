import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import Spinner from "./Spinner";
import OrderUpdate from "./OrderUpdate";
import Swal from "sweetalert2";


const OrderManager = () => {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [orderState, setOrderState] = useState("Active Orders");
  const [menuOpen, setMenuOpen] = useState(null);
  const [showUpdateOrderModal, setShowUpdateOrderModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const fetchOrders = async (type) => {
    setLoading(true);
    setOrderState(type);

    const endpoints = {
      "Active Orders": "orders/active-orders",
      "Delivered Orders": "orders/delivered-orders",
      "Cancelled Orders": "orders/cancelled-orders",
    };

    try {
      const response = await axiosInstance.get(endpoints[type]);
      setOrderData(response.data);
    } catch (error) {
      showErrorToast(`Error fetching ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = (id) => {
    setOrderId(id);
    setShowUpdateOrderModal(true);
    setMenuOpen(null);
  };

  const handleDeleteOrder = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
        setLoading(true);
    setMenuOpen(null);
      try {
        await axiosInstance.delete(`/orders/${id}/delete-order`);
        showSuccessToast("Order deleted successfully");
        setRefresh(prev=>!prev)
      } catch (error) {
        showErrorToast(error?.response?.data?.message || "Error deleting order")
      }
      finally{
        setLoading(false)
      }
    }
  };

  const toggleMenu = (orderId) => {
    setMenuOpen((prev) => (prev === orderId ? null : orderId));
  };

  useEffect(() => {
    fetchOrders(orderState);
  }, [refresh]);

  // Find the specific order to pass to OrderUpdate
  const selectedOrder = orderData.find((order) => order._id === orderId);

  return (
    <div className="min-h-screen bg-gray-100">
      {loading && <Spinner />}

      <nav className="bg-white shadow-lg rounded-b-xl sticky top-0 z-10">
        <ul className="flex flex-wrap justify-center gap-4 p-6 md:gap-8">
          {["Active Orders", "Delivered Orders", "Cancelled Orders"].map(
            (type) => (
              <li
                key={type}
                onClick={() => fetchOrders(type)}
                className={`cursor-pointer px-6 py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                  orderState === type
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-red-500"
                }`}
              >
                {type}
              </li>
            )
          )}
        </ul>
      </nav>

      <div className="container mx-auto px-4 py-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          {orderState}
        </h2>

        {orderData.length === 0 ? (
          <p className="text-center text-gray-500 text-xl font-medium bg-white p-6 rounded-lg shadow">
            No orders found
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orderData.map((order, index) => (
              <div
                key={order._id || index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 relative"
              >
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(order._id || index)}
                    className="absolute top-0 right-0 text-white sm:text-gray-500 hover:text-gray-700 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
                  >
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>

                  {menuOpen === (order._id || index) && (
                    <div className="absolute top-10 right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-30">
                      {orderState === "Active Orders" ? (
                        <button
                          onClick={() => handleUpdateOrder(order._id || index)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors"
                        >
                          Update Order
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeleteOrder(order._id || index)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors"
                        >
                          Delete Order
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {order.items.map((item, i) => (
                  <div key={i} className="mb-6 last:mb-0">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img
                        src={item.foodId.thumbnail}
                        alt={item.name}
                        className="w-full sm:w-28 h-28 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Price: ₹{item.price}
                        </p>
                        <p
                          className={`text-sm font-medium mt-1 ${
                            order.orderStatus === "Delivered"
                              ? "text-green-600"
                              : order.orderStatus === "Cancelled"
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        >
                          Status: {order.orderStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Tracking Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                      Tracking ID: {order.tracking.trackingId}
                    </p>
                    <p className="text-gray-600">
                      Courier: {order.tracking.courierName}
                    </p>
                    <p className="text-gray-600">
                      Estimated Delivery: {order.tracking.estimatedDelivery}
                    </p>
                    <p
                      className={`font-medium ${
                        order.tracking.deliveryStatus === "Delivered"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      Delivery Status: {order.tracking.deliveryStatus}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Shipping Address
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                    <br />
                    {order.shippingAddress.state} -{" "}
                    {order.shippingAddress.pincode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUpdateOrderModal && (
        <OrderUpdate
          setShowUpdateOrderModal={setShowUpdateOrderModal}
          orderId={orderId}
          setLoading={setLoading}
          loading={loading}
          setRefresh={setRefresh}
          orderData={selectedOrder} // Pass the specific order data
        />
      )}
    </div>
  );
};

export default OrderManager;
