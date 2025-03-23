import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import Spinner from "./Spinner";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false)

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setSignupInfo({ ...signupInfo, [name]: value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      showErrorToast("Name, email, and password are required");
      return;
    }
    try {
      setLoading(true)
      const response = await axiosInstance.post(
        "/signup",
        signupInfo,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const { message, success } = response.data;
      if (success) {
        showSuccessToast(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        setLoading(false)
      }
    } catch (error) {
      if (error.response?.data?.error?.details) {
        error.response.data.error.details.forEach((err) => {
          showErrorToast(err.message);
        });
      } else if (error.response?.data?.message) {
        showErrorToast(error.response.data.message);
      } else {
        showErrorToast("Unexpected error occurred. Try again later.");
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={signupInfo.name}
              onChange={handleOnchange}
              className="w-full px-4 py-2 text-gray-800 border rounded-lg focus:ring focus:ring-indigo-300 focus:outline-none"
              placeholder="Enter your name"
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={signupInfo.email}
              onChange={handleOnchange}
              className="w-full px-4 py-2 text-gray-800 border rounded-lg focus:ring focus:ring-indigo-300 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={signupInfo.password}
                onChange={handleOnchange}
                className="w-full px-4 py-2 text-gray-800 border rounded-lg focus:ring focus:ring-indigo-300 focus:outline-none"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-2/4 right-4 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Signup
          </button>
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-500 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
    </>
  );
};

export default Signup;
