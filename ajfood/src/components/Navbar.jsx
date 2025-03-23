import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineFastfood } from "react-icons/md";
import { showSuccessToast } from "../utils/toastMessage";
import { useRole } from "../utils/useRole";
import useCart from "../utils/useCart";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const { role, setRole, username,userId, setUserId, setUsername } = useRole();

const{cartItemCount} = useCart(userId);

  const checkAdmin = () => {
    if (role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const user = () => {
    if (localStorage.getItem("token")) {
      setIsUserLogin(true);
      setLoginUser(username);
    } else {
      setIsUserLogin(false);
      setLoginUser("");
    }
  };

  useEffect(() => {
    user();
    checkAdmin();
  }, [role, username]);


  const handleLogoutButton = () => {
    localStorage.clear();
    setRole(null);
    setUsername(null);
    setUserId(null);
    showSuccessToast("Logout Successfully");
    setIsUserLogin(false);
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link
          to="/"
          className="flex items-center text-2xl font-bold text-red-500"
        >
          <MdOutlineFastfood className="mr-2 text-3xl" /> Foodies
        </Link>

        <ul className="hidden md:flex space-x-6 text-lg font-medium">
          <li>
            <Link to="/" className="hover:text-red-500">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about-us" className="hover:text-red-500">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact-us" className="hover:text-red-500">
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="/faqs" className="hover:text-red-500">
              FAQs
            </Link>
          </li>
        </ul>
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-2xl text-gray-700 hover:text-red-500" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
          {isUserLogin ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="focus:outline-none hover:text-red-500 flex items-center gap-1"
              >
                <FaUserCircle className="text-2xl text-inherit" />
                <span className="text-inherit font-serif">{loginUser}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/add-product"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Add Product
                    </Link>
                  )}
                  <button
                    onClick={handleLogoutButton}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative text-gray-700 hover:text-red-500">
              <Link to="/login">
                <FaUserCircle className="text-3xl " />
                Login
              </Link>
            </div>
          )}

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <ul className="md:hidden bg-white w-full text-center py-4 space-y-4 border-t">
          <li>
            <Link to="/" className="block py-2 hover:text-red-500">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about-us" className="block py-2 hover:text-red-500">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact-us" className="block py-2 hover:text-red-500">
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="/faqs" className="block py-2 hover:text-red-500">
              FAQs
            </Link>
          </li>
          <li>
            <Link to="/profile" className="block py-2 hover:text-red-500">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/orders" className="block py-2 hover:text-red-500">
              Orders
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
