import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import axiosInstance from "../utils/axiosInstance";
import { useRole } from "../utils/useRole";
import Spinner from "./Spinner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [forgetPass, setForgetPass] = useState(false);
  const { setRole, setUserId, setUsername, setUserEmail } = useRole();
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      showErrorToast("Email and password are required");
      return;
    }

    try {
      setLoading(true)
      const response = await axiosInstance.post("/login", loginInfo, {
        headers: { "Content-Type": "application/json" },
      });

      const { message, success, id, accessToken, name, role, email } = response.data;

      if (success) {
        showSuccessToast(message);
        localStorage.setItem("token", accessToken);
        setRole(role);
        setUsername(name);
        setUserId(id);
        setUserEmail(email)
        setLoading(false)

        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
    } catch (error) {
      if (error.response?.data?.error?.details) {
        error.response.data.error.details.forEach((err) =>
          showErrorToast(err.message)
        );
        setForgetPass(true);
      } else if (error.response?.data?.message) {
        showErrorToast(error.response.data.message);
        setForgetPass(true);
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300">
      <div className="bg-white shadow-lg rounded-lg p-6 w-[90%] max-w-md sm:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h1>
        <form onSubmit={handleSubmit}>
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
              value={loginInfo.email}
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
                value={loginInfo.password}
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
            Login
          </button>
          {forgetPass && (
            <p className="mt-4 text-sm text-center">
              <Link
                to="/forget-pass"
                className="text-indigo-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </p>
          )}
          <p className="mt-4 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-500 font-semibold hover:underline"
            >
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
    </>
  );
};

export default Login;
