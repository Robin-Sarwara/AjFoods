import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useRole } from '../utils/useRole';
import { showErrorToast, showSuccessToast } from '../utils/toastMessage';
import Spinner from './Spinner';

const AddDeliveryAddress = () => {
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phoneNumber: ''
  });
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { userId } = useRole();

  useEffect(() => {
    fetchDeliveryAddress();
  }, []);

  const fetchDeliveryAddress = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/${userId}/delivery-address`);
      if (response.data.deliveryAddress) {
        setFormData({
          street: response.data.deliveryAddress.street || "",
          city: response.data.deliveryAddress.city || "",
          state: response.data.deliveryAddress.state || "",
          pincode: response.data.deliveryAddress.pincode || "",
          phoneNumber: response.data.deliveryAddress.phoneNumber || ""
        });
        setHasSavedAddress(true);
      }
    } catch (error) {
        showErrorToast(error?.response?.data?.error || "Error fetching delivery address");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.street) tempErrors.street = 'Street is required';
    if (!formData.city) tempErrors.city = 'City is required';
    if (!formData.state) tempErrors.state = 'State is required';
    if (!formData.pincode) {
      tempErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      tempErrors.pincode = 'Pincode must be 6 digits';
    }
    if (!formData.phoneNumber) {
      tempErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = 'Phone number must be 10 digits';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        const method = hasSavedAddress ? 'put' : 'post';
        const url = hasSavedAddress 
          ? `/${userId}/update/delivery-address`    
          : `/${userId}/add/delivery-address`;
        
        const response = await axiosInstance[method](url, formData);
        showSuccessToast(hasSavedAddress 
          ? "Delivery Address Updated successfully" 
          : "Delivery Address Added successfully");
        
        setHasSavedAddress(true);
        setIsEditing(false);
      } catch (error) {
        showErrorToast(error?.response?.data?.error || "Error occurred while saving Delivery Address");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {hasSavedAddress && !isEditing ? "Your Delivery Address" : "Save Delivery Address"}
        </h2>

        {hasSavedAddress && !isEditing ? (
          <div className="space-y-4">
            <div className="text-gray-700">
              <p><strong>Street:</strong> {formData.street}</p>
              <p><strong>City:</strong> {formData.city}</p>
              <p><strong>State:</strong> {formData.state}</p>
              <p><strong>Pincode:</strong> {formData.pincode}</p>
              <p><strong>Phone:</strong> {formData.phoneNumber}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-semibold"
            >
              Edit Address
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="Enter street address"
              />
              {errors.street && (
                <p className="text-red-500 text-xs mt-1">{errors.street}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="Enter state"
              />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="Enter 6-digit pincode"
                maxLength={6}
              />
              {errors.pincode && (
                <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="Enter 10-digit phone number"
                maxLength={10}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-semibold"
            >
              {hasSavedAddress ? "Update Address" : "Save Address"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddDeliveryAddress;