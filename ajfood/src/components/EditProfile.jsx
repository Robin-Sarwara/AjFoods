import React, { useEffect, useState } from "react";
import { useRole } from "../utils/useRole";
import { FaEdit } from "react-icons/fa";
import axiosInstance from '../utils/axiosInstance';
import Spinner from "./Spinner";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { username, userEmail, userId } = useRole();
  const navigate = useNavigate();

  const [name, setName] = useState(username);
  const [Email, setEmail] = useState(userEmail);
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [nameEdit, setNameEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(userEmail);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (nameEdit) {
      try {
        await axiosInstance.put(`/${userId}/update/name`, { name: name });
        setTimeout(() => {
          window.location.reload();
          setOpenSaveModal(false);
          setNameEdit(false);
        }, 3000);
        showSuccessToast("UserName updated successfully");
      } catch (error) {
        showErrorToast(error?.response?.data?.error || "Error updating UserName");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await axiosInstance.post(`/${userId}/verify-email`, { email: userEmail });
        console.log(response.data);
        showSuccessToast("OTP send to your email");
        setTimeout(() => {
          navigate('/update-email');
        }, 2000);
      } catch (error) {
        showErrorToast(error?.response?.data?.error || "Error sending otp");
      } finally {
        setLoading(false);
      }
    }
  };

  console.log(username);
  console.log(userEmail);

  const handleEditName = () => {
    setNameEdit(true);
    setOpenSaveModal(true);
    setName("");
  };

  const handleEditEmail = () => {
    setEmailEdit(true);
    setOpenSaveModal(true);
  };

  const handleCancel = () => {
    setOpenSaveModal(false);
    setNameEdit(false);
    setEmailEdit(false);
    setName(username);
    setEmail(userEmail);
  };

  useEffect(() => {
    setName(username || "");
    setEmail(userEmail || "");
    console.log(userEmail);
  }, [username, userEmail]);

  return (
    <>
      {loading && <Spinner />}
      <div className="max-w-lg mt-40 mx-auto p-5 bg-gray-50 rounded-lg shadow-md">
        {/* Header */}
        <div className="pb-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Edit Profile</h1>
            <p className="mt-2 text-sm text-gray-600">
              Update your personal information below.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back to Profile
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-5 flex flex-col gap-5">
          {/* Name Field */}
          {emailEdit ? "" : (
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                UserName
              </label>
              <div className="flex gap-4 justify-between items-center">
                <input
                  type="text"
                  id="name"
                  readOnly={nameEdit ? false : true}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  placeholder="Enter your new username"
                />
                {nameEdit ? "" : (
                  <FaEdit
                    size={30}
                    onClick={handleEditName}
                    className="text-xl cursor-pointer text-gray-700"
                  />
                )}
              </div>
            </div>
          )}

          {/* Email Field */}
          {nameEdit ? "" : (
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="flex gap-4 justify-between items-center">
                <input
                  type="email"
                  id="email"
                  value={Email}
                  readOnly={true}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  placeholder="Enter your email"
                />
                {emailEdit ? "" : (
                  <FaEdit
                    size={30}
                    className="text-xl cursor-pointer text-gray-700"
                    onClick={handleEditEmail}
                  />
                )}
              </div>
            </div>
          )}

          {openSaveModal && (
            <div className="flex gap-3 mt-5">
              <button
                type="submit"
                className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {emailEdit ? "Send OTP" : "Save Changes"}
              </button>
              <button
                type="button"
                className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default EditProfile;