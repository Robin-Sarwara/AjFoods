import React, { useState } from "react";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Spinner from "./Spinner";

const ForgetPass = () => {
  const [forgetPassInfo, setForgetPassInfo] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForgetPassInfo({ ...forgetPassInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email } = forgetPassInfo;

    if (!email) {
      showErrorToast("Please enter your email");
      return;
    }

    try {
      setLoading(true)
      const response = await axiosInstance.post("/forget-password", forgetPassInfo);
      const { success, message } = response.data;

      if (success) {
        showSuccessToast(message);
        setTimeout(() => {
          navigate("/reset-password");
        }, 2000);
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

  return (
    <>
    {loading&&<Spinner/>}
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#FF9A8B] via-[#FF6A88] to-[#FF99AC]">
      <div className="p-6 bg-white w-[90%] max-w-[400px] shadow-lg rounded-md">
        <h1 className="text-3xl font-bold text-center mb-6">Forget Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#FF6A88]"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={forgetPassInfo.email}
              onChange={handleOnChange}
              autoFocus
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-[#8A2BE2] text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Send OTP
          </button>
          <p className="text-center mt-4 text-sm">
            Remembered your password?{" "}
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

export default ForgetPass;
