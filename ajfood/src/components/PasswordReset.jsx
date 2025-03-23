import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Spinner from "./Spinner";

const PasswordReset = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassInfo, setResetPassInfo] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setResetPassInfo({ ...resetPassInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, otp, newPassword } = resetPassInfo;

    if (!email || !newPassword || !otp) {
      showErrorToast("Email, OTP, and new password are required");
      return;
    }

    try {
      setLoading(true)
      const response = await axiosInstance.post("/reset-password", resetPassInfo);
      if (response.data.success) {
        showSuccessToast(response.data.message);
        setLoading(false)
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        showErrorToast("An error occured");
        setLoading(false)
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { error: errDetails, message } = error.response.data;

        if (errDetails && errDetails.details) {
          showErrorToast(errDetails.details[0].message || "Unexpected error occurred. Try again later");
        } else if (message) {
          showErrorToast(message);
        } else {
          showErrorToast("Something went wrong. Please try again.");
        }
      } else {
        showErrorToast("Unexpected error occurred. Please check your internet connection.");
      }
      setLoading(false)
    }
    finally{
      setLoading(false)
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
    {loading && <Spinner/>}
      <div className="w-full h-[100vh] flex flex-col justify-center items-center bg-gradient-to-br from-[#FF9A8B] via-[#FF6A88] to-[#FF99AC]">
        <div className="p-6 bg-white w-[90%] max-w-[400px] shadow-lg rounded-md">
          <h1 className="font-bold text-4xl text-center mb-5">Reset Password</h1>
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="font-semibold text-sm block mb-1">
                Email
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#FF6A88]"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={resetPassInfo.email}
                onChange={handleOnChange}
              />
            </div>

            {/* OTP Field */}
            <div className="mb-4">
              <label htmlFor="otp" className="font-semibold text-sm block mb-1">
                OTP
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#FF6A88]"
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={resetPassInfo.otp}
                onChange={handleOnChange}
              />
            </div>

            {/* New Password Field */}
            <div className="mb-6 relative">
              <label htmlFor="newPassword" className="font-semibold text-sm block mb-1">
                New Password
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#FF6A88] pr-12"
                type={showPassword ? "text" : "password"}
                name="newPassword"
                placeholder="Enter your new password"
                value={resetPassInfo.newPassword}
                onChange={handleOnChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-[35px] right-3 text-gray-500"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#8A2BE2] text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Save
            </button>

            {/* Back to Login */}
            <p className="text-center mt-4 text-sm">
              Back to{" "}
              <span
                className="font-bold text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
