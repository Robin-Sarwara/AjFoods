import React, { useState } from 'react';
import { useRole } from '../utils/useRole';
import Spinner from './Spinner';
import axiosInstance from '../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../utils/toastMessage';
import { useNavigate } from 'react-router-dom';

const UpdateEmail = () => {
    const { userId } = useRole();
    const navigate = useNavigate();

    const [Email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.put(`/${userId}/update-email`, {
                otp: otp,
                newEmail: Email
            });
            showSuccessToast("Email updated successfully");
            setTimeout(() => {
                navigate("/edit-profile");
                window.location.reload();
            }, 2000);
        } catch (error) {
            showErrorToast(error?.response?.data?.error || "Error adding new email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Spinner />}
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-6 text-center">Update Email</h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                            OTP
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 placeholder-gray-400"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            type="text"
                            inputMode="numeric"
                            maxLength="6"
                            placeholder="Enter 6-digit OTP"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            New Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 placeholder-gray-400"
                            id="email"
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Enter new email"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            type="submit"
                        >
                            Update Email
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UpdateEmail;