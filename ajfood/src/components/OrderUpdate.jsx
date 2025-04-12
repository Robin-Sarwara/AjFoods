import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';
import axiosInstance from '../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../utils/toastMessage';

const OrderUpdate = ({ setShowUpdateOrderModal, orderId, setLoading, loading, setRefresh, orderData }) => {
  // Initialize state with existing order data if available
  const [trackingData, setTrackingData] = useState({
    courierName: orderData?.tracking?.courierName || '',
    estimatedDelivery: orderData?.tracking?.estimatedDelivery || '',
    deliveryStatus: orderData?.tracking?.deliveryStatus || 'Pending',
  });
  const [orderStatus, setOrderStatus] = useState(orderData?.orderStatus || 'Pending');

  const handleCancel = () => {
    setShowUpdateOrderModal(false);
  };

  const handleOrderUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put(`/orders/${orderId}/tracking-info/update`, trackingData);
      await axiosInstance.put(`/orders/${orderId}/status`, { orderStatus });
      showSuccessToast("Order Updated successfully");
      setRefresh((prev) => !prev);
      setShowUpdateOrderModal(false);
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "Error updating Order");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setTrackingData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStatusChange = (e) => {
    setOrderStatus(e.target.value);
  };

  // Update state when orderData changes (e.g., when modal opens with new orderId)
  useEffect(() => {
    if (orderData) {
      setTrackingData({
        courierName: orderData.tracking?.courierName || '',
        estimatedDelivery: orderData.tracking?.estimatedDelivery || '',
        deliveryStatus: orderData.tracking?.deliveryStatus || 'Pending',
      });
      setOrderStatus(orderData.orderStatus || 'Pending');
    }
  }, [orderData]);

  return (
    <>
      {loading && <Spinner />}
      <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-70 flex justify-center items-center">
        <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 shadow-xl rounded-lg p-6">
          <p className="font-bold text-3xl text-center mb-6">Update Order</p>
          <form onSubmit={handleOrderUpdate} className="space-y-4">
            <div>
              <label htmlFor="courierName" className="block text-base font-semibold mb-1">
                Restaurant Name
              </label>
              <input
                name="courierName"
                value={trackingData.courierName}
                onChange={handleChange}
                className="w-full outline-none border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Enter Restaurant Name Here..."
              />
            </div>
            <div>
              <label htmlFor="estimatedDelivery" className="block text-base font-semibold mb-1">
                Estimated Delivery Time
              </label>
              <input
                name="estimatedDelivery"
                value={trackingData.estimatedDelivery}
                onChange={handleChange}
                className="w-full outline-none border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Enter estimated delivery time here..."
              />
            </div>
            <div>
              <label htmlFor="deliveryStatus" className="block text-base font-semibold mb-1">
                Delivery Status
              </label>
              <select
                name="deliveryStatus"
                value={trackingData.deliveryStatus}
                onChange={handleChange}
                className="w-full outline-none border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="onTheWay">On the Way</option>
                <option value="Delayed">Delayed</option>
                <option value="Delivered">Delivered</option>
                <option value="Returned">Returned</option>
              </select>
            </div>
            <div>
              <label htmlFor="orderStatus" className="block text-base font-semibold mb-1">
                Order Status
              </label>
              <select
                name="orderStatus"
                value={orderStatus}
                onChange={handleStatusChange}
                className="w-full outline-none border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="OutForDelivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCancel}
                type="button"
                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Update Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default OrderUpdate;