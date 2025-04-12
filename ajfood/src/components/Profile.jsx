import React, { useEffect } from 'react';
import { useRole } from '../utils/useRole';
import { Link, useNavigate } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md';
import Spinner from './Spinner';

const Profile = () => {
    const { username, userEmail, loading } = useRole();
    const navigate = useNavigate();

    if (loading) {
        return <Spinner />;
    }

    const handleEditProfile = () => {
        navigate("/edit-profile");
    };

    return (
        <>
            <div className="max-w-lg mt-10 mx-auto p-5 bg-gray-50 rounded-lg shadow-md">
                {/* Top Section: User Info */}
                <div className="flex items-center gap-5 pb-5 border-b border-gray-200">
                    <div className="w-20 h-20">
                        <MdAccountCircle className="text-5xl text-gray-700" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-800">{username}</h2>
                        <p className="text-sm text-gray-600">{userEmail}</p>
                        <div className="mt-2 flex gap-3">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                onClick={handleEditProfile}
                            >
                                Edit Profile
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition-colors"
                                onClick={() => navigate('/home')}
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Core Features */}
                <div className="flex flex-col gap-3 py-5">
                    <Link
                        to="/delivery-address/add"
                        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-xl">📍</span> Saved Addresses
                    </Link>
                    <Link
                        to="/order"
                        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-xl">📦</span> Your Orders
                    </Link>
                    <button
                        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-xl">💳</span> Payment Methods
                    </button>
                </div>

                {/* Bottom Section: Settings & Support */}
                <div className="flex flex-col gap-3 pt-5">
                    <Link
                        to="/contact-us"
                        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-xl">❓</span> Help & Support
                    </Link>
                    <Link
                        to="/terms-and-condtions"
                        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-xl">📜</span> Terms & Conditions
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Profile;